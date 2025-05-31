import React, { useState, useEffect } from "react";
import NavbarStay from "../componen/NavbarStay";
import Footer from "../componen/Footer";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const DetailBarang = () => {
  const { id } = useParams();
  const [barang, setBarang] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fotoList, setFotoList] = useState([]);
  const [lostItemsData, setLostItemsData] = useState([]);

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/barang/${id}`
        );
        const data = response.data;
        setBarang(data);
        setSelectedImage(data.is_utama);
        if (Array.isArray(data.foto) && data.foto.length > 0) {
          const fotoUrls = data.foto.map((f) => f.url_foto);
          setFotoList(fotoUrls);
          setSelectedImage(fotoUrls[0]); // atau dari data.is_utama
        }

        const lostItemsResponse = await axios.get(
          "http://localhost:3000/api/barang/status/hilang"
        );

        if (Array.isArray(lostItemsResponse.data)) {
          const sortedData = lostItemsResponse.data
            .sort(
              (a, b) =>
                new Date(b.tanggal_ditemukan) - new Date(a.tanggal_ditemukan)
            )
            .slice(0, 4);

          setLostItemsData(sortedData);
        } else {
          setLostItemsData([]);
        }
      } catch (error) {
        console.error("Gagal mengambil data barang:", error);
      }
    };

    fetchBarang();
  }, [id]);

  if (!barang) return <div className="text-center py-16">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarStay />

      <div className="flex-grow container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <div>
              <img
                src={selectedImage}
                alt="Selected Item"
                className="w-full rounded-lg shadow-md mb-4"
              />
              <div className="flex space-x-2 overflow-x-auto">
                {fotoList.map((foto, index) => (
                  <img
                    key={index}
                    src={foto}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => setSelectedImage(foto)}
                    className={`w-20 h-20 object-cover rounded border cursor-pointer ${
                      selectedImage === foto
                        ? "border-yellow-500"
                        : "border-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {barang.nama_barang}
            </h1>
            <p className="text-gray-600 mb-2">
              <strong>Lokasi Ditemukan:</strong> {barang.lokasi_ditemukan}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Tanggal Ditemukan:</strong>{" "}
              {new Date(barang.tanggal_ditemukan).toLocaleDateString("id-ID")}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Keterangan:</strong> {barang.deskripsi}
            </p>
            <button className="bg-yellow-400 text-white px-6 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition">
              Hubungi Admin
            </button>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Barang Terbaru
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {lostItemsData.map((item) => (
              <Link to={`/detailbarang/${item.id}`} key={item.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                  <img
                    src={item.is_utama}
                    alt={item.nama_barang}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-gray-800 text-sm font-bold">
                      {item.nama_barang}
                    </h3>
                    <p className="text-gray-600 text-xs">
                      {new Date(item.tanggal_ditemukan).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DetailBarang;

import React, { useEffect, useState } from 'react';
import NavbarStay from '../componen/NavbarStay';
import Footer from '../componen/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Display = () => {
  const [lostItemsData, setLostItemsData] = useState([]);
  const [visibleItems, setVisibleItems] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState("");
  const [filterKategori, setFilterKategori] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const lostItemsResponse = await axios.get('http://localhost:3000/api/barang/status/hilang');
      if (Array.isArray(lostItemsResponse.data)) {
        const sortedData = lostItemsResponse.data.sort(
          (a, b) => new Date(b.tanggal_ditemukan) - new Date(a.tanggal_ditemukan)
        );
        setLostItemsData(sortedData);
      } else {
        setLostItemsData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + 8);
  };

  const handleDetailClick = (id) => {
    navigate(`/detailbarang/${id}`);
  };

  const filteredItems = lostItemsData.filter((item) => {
    const matchesSearch = item.nama_barang
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const itemDate = new Date(item.tanggal_ditemukan).toLocaleDateString("sv-SE");
    const matchesDate = filterDate ? itemDate === filterDate : true;

    const matchesKategori = filterKategori ? item.kategori === filterKategori : true;

    return matchesSearch && matchesDate && matchesKategori;
  });

  // Mengambil semua kategori unik dari data
  const uniqueCategories = [...new Set(lostItemsData.map(item => item.kategori))];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarStay />

      <div className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Barang Tertinggal</h1>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <input
            type="text"
            placeholder="Cari berdasarkan nama barang..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400"
          />
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Semua Kategori</option>
            {uniqueCategories.map((kategori, index) => (
              <option key={index} value={kategori}>{kategori}</option>
            ))}
          </select>
        </div>

        {/* Display Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredItems.slice(0, visibleItems).map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col">
              <img
                src={item.is_utama}
                alt="foto barang"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800 mb-1">{item.nama_barang}</h2>
              <p className="text-sm text-gray-500 mb-1"><strong>Kategori:</strong> {item.kategori}</p>
              <p className="text-sm text-gray-500 mb-1"><strong>Lokasi:</strong> {item.lokasi_ditemukan}</p>
              <p className="text-sm text-gray-500 mb-3"><strong>Tanggal:</strong> {new Date(item.tanggal_ditemukan).toLocaleDateString('id-ID')}</p>
              <button
                className="mt-auto bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-2 rounded-lg"
                onClick={() => handleDetailClick(item.id)}
              >
                Selengkapnya
              </button>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleItems < filteredItems.length && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLoadMore}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
            >
              Lihat Lainnya
            </button>
          </div>
        )}

        {/* No Data */}
        {filteredItems.length === 0 && (
          <p className="text-center text-gray-500 mt-10">Tidak ada barang yang ditemukan.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Display;

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
  const [searchDate, setSearchDate] = useState('');
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateChange = (e) => {
    setSearchDate(e.target.value);
  };

  const filteredItems = lostItemsData.filter((item) => {
    const matchesSearch = item.nama_barang
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const itemDate = new Date(item.tanggal_ditemukan).toLocaleDateString(
      "sv-SE"
    );
    const matchesDate = filterDate ? itemDate === filterDate : true;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarStay />

      <div className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Display Barang Tertinggal</h1>

        <div className="flex justify-center space-x-4 mb-8">
          <input
            type="text"
            placeholder="Cari berdasarkan nama"
            className="border border-gray-300 rounded-lg px-4 py-2 w-1/3"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-1/3"
        />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredItems.slice(0, visibleItems).map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
              <img
                src={item.is_utama}
                alt="foto barang"
                className="w-full h-56 object-cover mb-2 rounded"
              />
              <h2 className="text-lg font-bold text-gray-800">{item.nama_barang}</h2>
              <p className="text-gray-600 text-sm">
                <strong>Lokasi Ditemukan:</strong> {item.lokasi_ditemukan}
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Tanggal Ditemukan:</strong>{" "}
                {new Date(item.tanggal_ditemukan).toLocaleDateString('id-ID')}
              </p>
              <button
                className="bg-yellow-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition mt-4"
                onClick={() => handleDetailClick(item.id)}
              >
                Selengkapnya
              </button>
            </div>
          ))}
        </div>

        {visibleItems < filteredItems.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              className="text-blue-600 hover:underline"
            >
              Lihat Lainnya
            </button>
          </div>
        )}

        {filteredItems.length === 0 && (
          <p className="text-center text-gray-500 mt-8">Tidak ada barang yang ditemukan.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Display;

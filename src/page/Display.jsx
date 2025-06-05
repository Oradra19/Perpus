import React, { useEffect, useState } from 'react';
import NavbarStay from '../componen/NavbarStay';
import Footer from '../componen/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Display = () => {
  const [lostItemsData, setLostItemsData] = useState([]);
  const [visibleItems, setVisibleItems] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://perpus-be.vercel.app/api/barang/status/hilang');
        if (Array.isArray(res.data)) {
          const sorted = res.data.sort((a, b) =>
            new Date(b.tanggal_ditemukan) - new Date(a.tanggal_ditemukan)
          );
          setLostItemsData(sorted);
        } else {
          setLostItemsData([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleLoadMore = () => setVisibleItems(prev => prev + 8);
  const handleDetailClick = (id) => navigate(`/detailbarang/${id}`);

  const filteredItems = lostItemsData.filter(item => {
    const matchSearch = item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDate = filterDate
      ? new Date(item.tanggal_ditemukan).toLocaleDateString('sv-SE') === filterDate
      : true;
    const matchKategori = filterKategori ? item.kategori === filterKategori : true;
    return matchSearch && matchDate && matchKategori;
  });

  const uniqueCategories = [...new Set(lostItemsData.map(item => item.kategori))];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
      <NavbarStay />

      <main className="flex-grow container mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">📦 Daftar Barang Tertinggal</h1>

        {/* Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 bg-white p-4 rounded-xl shadow-sm">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium mb-1">Cari Barang</label>
            <input
              type="text"
              placeholder="Nama barang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium mb-1">Tanggal Ditemukan</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-yellow-400 outline-none"
            >
              <option value="">Semua Kategori</option>
              {uniqueCategories.map((kategori, idx) => (
                <option key={idx} value={kategori}>{kategori}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.slice(0, visibleItems).map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all">
              <img
                src={item.is_utama}
                alt={item.nama_barang}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-900">{item.nama_barang}</h2>
                <p className="text-sm text-gray-600">📍 {item.lokasi_ditemukan}</p>
                <p className="text-sm text-gray-500">🗂 {item.kategori}</p>
                <p className="text-sm text-gray-500">
                  🕒 {new Date(item.tanggal_ditemukan).toLocaleDateString('id-ID')}
                </p>
                <button
                  onClick={() => handleDetailClick(item.id)}
                  className="mt-2 w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-2 rounded-lg transition"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {visibleItems < filteredItems.length && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLoadMore}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow transition"
            >
              Lihat Lebih Banyak
            </button>
          </div>
        )}

        {/* No Result */}
        {filteredItems.length === 0 && (
          <p className="text-center text-gray-500 mt-20 text-lg">Tidak ada barang ditemukan.</p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Display;

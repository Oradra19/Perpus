import React, { useState, useEffect } from 'react';
import { Box, Search, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from 'axios'; 
import LostItemsTable from '../componen/LostItemsTable'; 
import FoundItemsTable from '../componen/FoundItemsTable'; 
import ArchivedItemsTable from '../componen/ArchivedItemsTable'; 
import Logo from '../assets/logo.png';

const AdminDashboard = () => {
  const [lostItemsData, setLostItemsData] = useState([]);
  const [foundItemsData, setFoundItemsData] = useState([]);
  const [archivedItemsData, setArchivedItemsData] = useState([]);
  const [activeTab, setActiveTab] = useState('lost-items');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchData = async () => {
      try {
        const lostItemsResponse = await api.get('https://perpus-be.vercel.app/api/barang/status/hilang');
        const foundItemsResponse = await api.get('https://perpus-be.vercel.app/api/barang/status/ditemukan');
        const archivedItemsResponse = await api.get('https://perpus-be.vercel.app/api/barang/status/arsip');

        setLostItemsData(Array.isArray(lostItemsResponse.data) ? lostItemsResponse.data : []);
        setFoundItemsData(Array.isArray(foundItemsResponse.data) ? foundItemsResponse.data : []);
        setArchivedItemsData(Array.isArray(archivedItemsResponse.data) ? archivedItemsResponse.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

  useEffect(() => {

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-blue-800 text-white p-4">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={Logo}
            alt="Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <nav>
          <ul>
            <li
              className={`flex items-center p-2 mb-2 rounded cursor-pointer ${activeTab === 'lost-items' ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
              onClick={() => setActiveTab('lost-items')}
            >
              <Box className="mr-2" /> Barang Hilang
            </li>
            <li
              className={`flex items-center p-2 mb-2 rounded cursor-pointer ${activeTab === 'found-items' ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
              onClick={() => setActiveTab('found-items')}
            >
              <Search className="mr-2" /> Barang Ditemukan
            </li>
            <li
              className={`flex items-center p-2 mb-2 rounded cursor-pointer ${activeTab === 'archived-items' ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
              onClick={() => setActiveTab('archived-items')}
            >
              <Archive className="mr-2" /> Arsip
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex-1 bg-white flex flex-col">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {activeTab === 'lost-items' && 'Barang Hilang'}
            {activeTab === 'found-items' && 'Barang Ditemukan'}
            {activeTab === 'archived-items' && 'Arsip'}
          </h2>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Keluar
          </button>
        </header>

        <div className="p-6 flex-1">
          {activeTab === 'lost-items' && <LostItemsTable lostItemsData={lostItemsData} refreshData={fetchData}/>}
          {activeTab === 'found-items' && <FoundItemsTable foundItemsData={foundItemsData} refreshData={fetchData} />}
          {activeTab === 'archived-items' && <ArchivedItemsTable archivedItemsData={archivedItemsData} refreshData={fetchData}/>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

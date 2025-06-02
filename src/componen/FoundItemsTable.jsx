import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const FoundItemsTable = ({ foundItemsData, refreshData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [selectedStatusItem, setSelectedStatusItem] = useState(null);

  const filteredItems = foundItemsData.filter((item) => {
    const matchesSearch = item.nama_barang
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const itemDate = new Date(item.tanggal_ditemukan).toLocaleDateString(
      "sv-SE"
    );
    const matchesDate = filterDate ? itemDate === filterDate : true;
    return matchesSearch && matchesDate;
  });

  const updateNoPengambil = async ({ id, no_pengambil, status_barang }) => {
    const res = await axios.put(
      `http://localhost:3000/api/barang/${id}/no_pengambil`,
      {
        no_pengambil,
        status_barang,
      }
    );
    return res.data;
  };

  const handleUpdateStatus = async () => {
    try {
      await updateNoPengambil(selectedStatusItem); // kirim ke backend
      setIsEditStatusModalOpen(false);
      refreshData(); // refresh data

      Swal.fire("Berhasil!", "Status barang berhasil diperbarui.", "success");
    } catch (err) {
      console.error("Gagal update status", err);
      Swal.fire(
        "Gagal!",
        "Terjadi kesalahan saat memperbarui status.",
        "error"
      );
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const handleDelete = async (id) => {
    const confirmation = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus item ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirmation.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/barang/${id}`);
        refreshData();
        Swal.fire("Berhasil!", "Item berhasil dihapus.", "success");
      } catch {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus item.", "error");
      }
    }
  };

  return (
    <div className="p-4">
      {/* Search and Filter */}
      <div className="flex gap-4 flex-wrap mb-4">
        <input
          type="text"
          placeholder="Cari barang..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-64"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">No</th>
            <th className="border px-2 py-1">Foto</th>
            <th className="border px-2 py-1">Nama</th>
            <th className="border px-2 py-1">Deskripsi</th>
            <th className="border px-2 py-1">Kategori</th>
            <th className="border px-2 py-1">Tanggal</th>
            <th className="border px-2 py-1">Lokasi</th>
            <th className="border px-2 py-1">No Pengambil</th>
            <th className="border px-2 py-1">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item, index) => (
            <tr key={item.id}>
              <td className="border text-center">{index + 1}</td>
              <td className="border">
                <img
                  src={item.is_utama} // ambil thumbnail
                  alt="foto barang"
                  className="aspect-video w-40 object-cover"
                />
              </td>
              <td className="border">{item.nama_barang}</td>
              <td className="border">{item.deskripsi}</td>
              <td className="border">{item.kategori}</td>
              <td className="border">
                {new Date(item.tanggal_ditemukan).toLocaleDateString("id-ID")}
              </td>
              <td className="border">{item.lokasi_ditemukan}</td>
              <td className="border">{item.no_pengambil}</td>
              <td className="border space-x-2">
                <button
                  onClick={() => {
                    setSelectedStatusItem(item);
                    setIsEditStatusModalOpen(true);
                  }}
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Ubah Status
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isEditStatusModalOpen && selectedStatusItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Ubah Status Barang</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateStatus();
              }}
            >
              <select
                name="status_barang"
                value={selectedStatusItem.status_barang}
                onChange={(e) =>
                  setSelectedStatusItem({
                    ...selectedStatusItem,
                    status_barang: e.target.value,
                  })
                }
                className="w-full p-2 border rounded mb-2"
              >
                <option value="ditemukan">Ditemukan</option>
                <option value="arsip">Arsip</option>
              </select>
              <input
                type="text"
                placeholder="Nomor Pengambil (opsional)"
                value={selectedStatusItem.no_pengambil || ""}
                onChange={(e) =>
                  setSelectedStatusItem({
                    ...selectedStatusItem,
                    no_pengambil: e.target.value,
                  })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditStatusModalOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoundItemsTable;

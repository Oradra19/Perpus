import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const kategoriOtomatis = ["Dokumen", "SIM", "KTP", "STNK", "ATM"];
const defaultImages = {
  Dokumen: "/dokumen.png",
  SIM: "/sim.jpg",
  KTP: "/ktp.jpg",
  STNK: "/stnk.jpg",
  ATM: "/atm.jpg",
};
const LostItemsTable = ({ lostItemsData, refreshData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStatusItem, setSelectedStatusItem] = useState(null);

  const [currentItem, setCurrentItem] = useState({
    nama_barang: "",
    tanggal_ditemukan: "",
    lokasi_ditemukan: "",
    deskripsi: "",
    url_foto: [null, null, null, null], // 4 foto
    is_utama: 0,
    status_barang: "hilang",
    kategori: "",
  });

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

  const updateNoPengambil = async ({ id, no_pengambil, status_barang }) => {
    const res = await axios.put(
      `https://perpus-be.vercel.app/api/barang/${id}/no_pengambil`,
      {
        no_pengambil,
        status_barang,
      }
    );
    return res.data;
  };

  const handleAdd = () => {
    setCurrentItem({
      nama_barang: "",
      tanggal_ditemukan: "",
      lokasi_ditemukan: "",
      deskripsi: "",
      is_utama: 0,
      status_barang: "hilang",
      kategori: "",
      url_foto: [null, null, null, null],
    });
    setEditingIndex(null);
    setIsModalOpen(true);
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
        await axios.delete(`https://perpus-be.vercel.app/api/barang/${id}`);
        refreshData();
        Swal.fire("Berhasil!", "Item berhasil dihapus.", "success");
      } catch {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus item.", "error");
      }
    }
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newFiles = [...currentItem.url_foto];
      newFiles[index] = file;
      setCurrentItem({ ...currentItem, url_foto: newFiles });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true); // Mulai menyimpan

    const formData = new FormData();
    formData.append("nama_barang", currentItem.nama_barang);
    formData.append("tanggal_ditemukan", currentItem.tanggal_ditemukan);
    formData.append("lokasi_ditemukan", currentItem.lokasi_ditemukan);
    formData.append("deskripsi", currentItem.deskripsi);
    formData.append("status_barang", currentItem.status_barang);
    formData.append("kategori", currentItem.kategori);
    formData.append("is_utama", currentItem.is_utama);

    if (kategoriOtomatis.includes(currentItem.kategori)) {
      try {
        const defaultImage = defaultImages[currentItem.kategori];
        const response = await fetch(defaultImage);
        const blob = await response.blob();
        const file = new File(
          [blob],
          `${currentItem.kategori.toLowerCase()}.png`,
          {
            type: blob.type,
          }
        );
        formData.append("url_foto", file);
      } catch (err) {
        console.error("Gagal mengambil gambar default", err);
      }
    } else {
      currentItem.url_foto.forEach((file, i) => {
        if (file instanceof File) {
          formData.append("url_foto", file);
        }
      });
    }

    try {
      if (editingIndex !== null) {
        const editedItem = filteredItems[editingIndex];
        await axios.put(
          `https://perpus-be.vercel.app/api/barang/${editedItem.id}`,
          formData
        );
        Swal.fire("Berhasil!", "Data berhasil diperbarui.", "success");
      } else {
        await axios.post("https://perpus-be.vercel.app/api/barang", formData);
        Swal.fire("Berhasil!", "Data berhasil ditambahkan.", "success");
      }
      refreshData();
      closeModal();
    } catch (error) {
      console.error("Error saving item:", error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan item.", "error");
    } finally {
      setIsSaving(false); // Proses selesai
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "kategori") {
      if (kategoriOtomatis.includes(value)) {
        setCurrentItem((prev) => ({
          ...prev,
          kategori: value,
          url_foto: [defaultImages[value], null, null, null],
        }));
      } else {
        setCurrentItem((prev) => ({
          ...prev,
          kategori: value,
          url_foto: [null, null, null, null],
        }));
      }
    } else {
      setCurrentItem((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="p-4">
      {/* Search and Filter */}
      <button
        className="bg-green-500 text-white px-5 py-2 rounded mb-4"
        onClick={handleAdd}
      >
        Tambah Barang
      </button>

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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingIndex !== null ? "Edit Barang" : "Tambah Barang"}
            </h2>
            <form onSubmit={handleSave}>
              {/* Form Fields */}
              <input
                type="text"
                name="nama_barang"
                placeholder="Nama Barang"
                value={currentItem.nama_barang}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <textarea
                name="deskripsi"
                placeholder="Deskripsi"
                value={currentItem.deskripsi}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="text"
                name="lokasi_ditemukan"
                placeholder="Lokasi"
                value={currentItem.lokasi_ditemukan}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="date"
                name="tanggal_ditemukan"
                value={currentItem.tanggal_ditemukan?.split("T")[0]}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <select
                name="kategori"
                value={currentItem.kategori}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="">Pilih Kategori</option>
                <option value="Aksesoris">Aksesoris</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Pakaian">Pakaian</option>
                <option value="SIM">SIM</option>
                <option value="KTP">KTP</option>
                <option value="STNK">STNK</option>
                <option value="ATM">ATM</option>
                <option value="Dokumen">Dokumen</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              <select
                name="status_barang"
                value={currentItem.status_barang}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="hilang">Hilang</option>
                <option value="ditemukan">Ditemukan</option>
                <option value="arsip">Arsip</option>
              </select>
              {!kategoriOtomatis.includes(currentItem.kategori) ? (
                [0, 1, 2, 3].map((i) => (
                  <div key={i} className="mb-2">
                    <label>Foto {i + 1}</label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, i)}
                      className="w-full p-1"
                    />
                  </div>
                ))
              ) : (
                <div className="mb-2">
                  <label>Foto (Otomatis)</label>
                  <div className="w-full border p-2 rounded bg-gray-100">
                    <img
                      src={defaultImages[currentItem.kategori]}
                      alt={`Foto default ${currentItem.kategori}`}
                      className="max-h-48 mx-auto"
                    />
                  </div>
                  <small className="text-sm text-gray-500 italic">
                    Gambar ini akan otomatis digunakan untuk kategori{" "}
                    {currentItem.kategori}.
                  </small>
                </div>
              )}

              <div className="flex justify-end mt-4 gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-4 py-2 rounded text-white ${
                    isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
                  }`}
                >
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
                <option value="hilang">Hilang</option>
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

export default LostItemsTable;

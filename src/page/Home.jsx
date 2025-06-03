import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../componen/Navbar";
import Footer from "../componen/Footer";
import home from "../assets/home.jpg";
import faqImage from "../assets/faq.png";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AOS from "aos";
import "aos/dist/aos.css";
import api from "axios";

const HomePage = () => {
  const [lostItemsData, setLostItemsData] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 10 });

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const lostItemsResponse = await api.get(
        "http://localhost:3000/api/barang/status/hilang"
      );

      if (Array.isArray(lostItemsResponse.data)) {
        const sortedData = lostItemsResponse.data
          .sort(
            (a, b) =>
              new Date(b.tanggal_ditemukan) - new Date(a.tanggal_ditemukan)
          )
          .slice(0, 5);

        setLostItemsData(sortedData);
      } else {
        setLostItemsData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSeeMore = () => {
    navigate("/display");
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div>
      <Navbar />

      <section
        className="relative h-[90vh] flex items-center justify-center text-center text-white"
        data-aos="fade-up"
      >
        <img
          src={home}
          alt="Background"
          className="absolute w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-blue-900 opacity-50"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Barangmu hilang atau ketinggalan di UMS Library? <br />
            Atau Bingung dimana letak barangmu tertinggal?
          </h1>
          <p className="mt-4 text-lg md:text-xl text-yellow-300">
            Tenang barang tertinggalmu bisa kamu lihat di website ini!
          </p>
        </div>
      </section>

      <section className="relative py-12 bg-white">
        <div className="ornament ornament-right">
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className="ornament ornament-left">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </section>

      <section className="py-12 bg-white" data-aos="fade-up">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Barang Terbaru</h2>
        </div>

        <div className="px-4">
          <Slider {...sliderSettings}>
            {lostItemsData.map((item) => (
              <Link to={`/detailbarang/${item.id}`} key={item.id}>
                <div key={item.id} className="p-4">
                  <div className="bg-gray-100 p-4 rounded shadow hover:shadow-lg transition-shadow duration-300">
                    <img
                      src={`${item.is_utama}`}
                      alt="foto barang"
                      className="w-full h-56 object-cover mb-2 rounded"
                    />
                    <p className="text-center font-semibold">
                      {item.nama_barang}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        </div>

        <div className="text-center mt-12 mb-8">
          <button
            onClick={handleSeeMore}
            className="bg-blue-600 hover:bg-blue=-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Lihat Selengkapnya
          </button>
        </div>
      </section>

      <section className="relative" data-aos="fade-up" id="faq">
        <div className="bg-yellow-300 pt-16 pb-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <h2 className="text-4xl font-bold mb-4 text-left">
                  Frequently Asked Questions (FAQ)
                </h2>
                <p className="text-lg text-gray-800 text-left">
                  Temukan jawaban dari pertanyaan yang sering diajukan tentang
                  UMS Library
                </p>
              </div>
              <div className="flex-1 flex justify-center">
                <img
                  src={faqImage}
                  alt="FAQ Illustration"
                  className="w-80 md:w-full max-w-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden -mt-10 mb-16">
            {[
              {
                question:
                  "Bagaimana caraku menghubungi pihak perpus jika barangku hilang?",
                answer:
                  "Kamu dapat menghubungi pihak perpustakaan melalui layanan customer service atau langsung datang ke perpustakaan ya.",
              },
              {
                question: "Berapa lama barang akan disimpan di perpustakaan?",
                answer:
                  "Barang akan disimpan selama maksimal 30 hari sebelum ditindaklanjuti sesuai prosedur.",
              },
              {
                question:
                  "Apakah bisa menitipkan barang yang ditemukan di UMS Library?",
                answer:
                  "Tentu saja, kamu bisa menyerahkan barang yang ditemukan ke bagian informasi perpustakaan.",
              },
              {
                question: "Bagaimana cara mengklaim barang yang hilang?",
                answer:
                  "Untuk mengklaim barang yang hilang, kamu perlu menunjukkan bukti kepemilikan seperti foto atau ciri khusus barang kepada petugas perpustakaan.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none"
                >
                  <span className="text-base font-medium">{faq.question}</span>
                  {activeFaq === index ? (
                    <FaChevronUp className="text-blue-600" />
                  ) : (
                    <FaChevronDown className="text-gray-600" />
                  )}
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-4 pt-2 text-gray-700 bg-gray-50 transition-all duration-300">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;

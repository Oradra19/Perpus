import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Ikon menu dan close

const NavbarStay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleFaqClick = (e) => {
    e.preventDefault();
    setMenuOpen(false); // Tutup menu setelah klik (mobile)
    if (location.pathname === '/') {
      const faqSection = document.getElementById('faq');
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/faq');
    }
  };

  return (
    <div className="w-full bg-blue-900 px-6 py-4 z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="UMS Library Logo" className="h-10 w-auto" />
        </div>

        {/* Hamburger menu (mobile) */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex space-x-10">
          <Link to="/" className="text-white hover:text-yellow-300 hover:font-bold transition text-lg font-light">
            Home
          </Link>
          <a
            href="#faq"
            onClick={handleFaqClick}
            className="text-white hover:text-yellow-300 hover:font-bold transition text-lg font-light"
          >
            FAQ
          </a>
          <Link
            to="/display"
            className="text-white hover:text-yellow-300 hover:font-bold transition text-lg font-light"
          >
            Display Barang
          </Link>
          <a
            href="https://library.ums.ac.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-yellow-300 hover:font-bold transition text-lg font-light"
          >
            Kontak Kami
          </a>
        </div>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="flex flex-col md:hidden space-y-4 mt-4">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-white hover:text-yellow-300 transition text-base font-light"
          >
            Home
          </Link>
          <a
            href="#faq"
            onClick={handleFaqClick}
            className="text-white hover:text-yellow-300 transition text-base font-light"
          >
            FAQ
          </a>
          <Link
            to="/display"
            onClick={() => setMenuOpen(false)}
            className="text-white hover:text-yellow-300 transition text-base font-light"
          >
            Display Barang
          </Link>
          <a
            href="https://library.ums.ac.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-yellow-300 transition text-base font-light"
          >
            Kontak Kami
          </a>
        </div>
      )}
    </div>
  );
};

export default NavbarStay;

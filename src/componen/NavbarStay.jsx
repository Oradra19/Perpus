import React from 'react';
import logo from '../assets/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NavbarStay = () => {
  const location = useLocation();
  const navigate = useNavigate(); 

  const handleFaqClick = (e) => {
    e.preventDefault();
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
    <div className="w-full flex items-center justify-between px-8 py-4 bg-blue-900">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="UMS Library Logo" className="h-10 w-auto" />
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-10">
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
  );
};

export default NavbarStay;

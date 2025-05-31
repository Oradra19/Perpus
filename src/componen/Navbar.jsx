import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import logo from '../assets/logo.png'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleFaqClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const faqSection = document.getElementById('faq');
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#faq');
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-blue-900 shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="w-full flex items-center justify-between px-8 py-4" data-aos="fade-down">
        <div className="flex items-center">
          <img src={logo} alt="UMS Library Logo" className="h-10 w-auto" /> 
        </div>
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
          <Link to="/display" className="text-white hover:text-yellow-300 hover:font-bold transition text-lg font-light">
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
    </nav>
  );
};

export default Navbar;

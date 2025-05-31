import React from 'react';
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import logofooter from '../assets/logo.png'; 

const Footer = () => {
  return (
    <footer className="bg-[#24348b] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between items-start">
        <div className="flex items-start space-x-4">
          <img src={logofooter} alt="UMS Library" className="w-[460px] h-auto" /> 
        </div>
        <div className="text-sm mt-8 md:mt-0">
          <p>Jl. A. Yani Tromol Pos I Pabelan Surakarta 57102.</p>
          <p>Telepon 0271-717417 ext. 3206 & 3249</p>
          <p>NPP: <span className="font-bold">3311122D000002</span></p>
          <p className="mt-2">Call Center dan Layanan Keluhan :</p>
          <p className="font-bold">0813 2685 9003</p>
        </div>
      </div>

      <div className="bg-[#fbb040] text-[#24348b] text-center text-sm py-4 flex flex-col md:flex-row justify-between items-center px-4">
        <p>© All rights reserved by UMS Library and Digital Services Center - 2024™</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#"><FaTwitter size={24} /></a>
          <a href="#"><FaFacebookF size={24} /></a>
          <a href="#"><FaInstagram size={24} /></a>
          <a href="#"><FaYoutube size={24} /></a>
          <a href="#"><FaTiktok size={24} /></a>
          <a href="#"><MdEmail size={24} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";
import logo from "../../Assests/animations/logo-removebg-preview.png";

const Footer = () => {
  return (
    <div className="bg-[#000] text-white ">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:px-8 px-5 py-8 sm:text-center">
        <ul className="px-5 text-center sm:text-start flex sm:block flex-col items-center">
          <img
            src={logo}
            alt=""
            style={{ filter: "brightness(0) invert(1)" }}
           className="h-[100px]"
          />
          <br />
          <p className="text-xs">The home and elements needed to create beautiful products.</p>
          <div className="flex items-center mt-[10px]">
            <AiFillFacebook size={20} className="cursor-pointer" />
            <AiOutlineTwitter
              size={20}
              style={{ marginLeft: "10px", cursor: "pointer" }}
            />
            <AiFillInstagram
              size={20}
              style={{ marginLeft: "10px", cursor: "pointer" }}
            />
            <AiFillYoutube
              size={20}
              style={{ marginLeft: "10px", cursor: "pointer" }}
            />
          </div>
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold text-sm">Company</h1>
          {footerProductLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-xs cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center pt-2 text-gray-400 text-xs pb-4"
      >
        <span>© 2024 FabreeKart. All rights reserved.</span>
        <span>Terms · Privacy Policy</span>
      </div>
    </div>
  );
};

export default Footer;

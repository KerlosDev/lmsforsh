import React from 'react'
import { FaFacebook } from "react-icons/fa6";
import { BsWhatsapp } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";
import { FaFileCode } from "react-icons/fa";
import Link from 'next/link';

const Footer = () => {
  return (
    <div className=' cursor-default bg-slate-900 p-10 rounded-t-2xl '>
      <div className=' flex justify-center'>

        <div>
          <div className=' flex justify-center gap-8 text-slate-500 max-sm:text-4xl text-5xl'>
            <FaFacebook />
            <BsWhatsapp />
            <FaYoutube />
            <FaTelegram />

          </div>

          <h3 className=' place-items-center flex justify-center w-full font-anton  max-sm:text-xl text-3xl m-auto text-slate-600 mt-10'>
            <span className=' mx-3'>
              <FaFileCode />
            </span>
            Developed By
          
            <a className=' hover:scale-125 transition-transform hover:ml-1 hover:bg-slate-500 rounded-xl p-1 px-2 hover:text-slate-800' href='https://www.facebook.com/kerlosDev/'>
              Kerlos Hany
            </a></h3>


        </div>

      </div>
    </div>
  )
}

export default Footer
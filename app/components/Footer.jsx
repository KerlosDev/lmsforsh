import React from 'react'
import { FaFacebook } from "react-icons/fa6";
import { BsWhatsapp } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";
import { FaFileCode } from "react-icons/fa";
import Link from 'next/link';

const Footer = () => {
    return (

        <footer className="bg-gray-900 cursor-default text-gray-300">
            <div className="container mx-auto ">

                <div className="mt-10   border-t-2 border-gray-700 py-3 text-center">
                    <p className=" font-anton  text-lg md:text-2xl">


                        Devloped By &nbsp;
                        <a href="https://www.kerlos.site">
                            <span className=' hover:scale-105 text-red-600'>
                                Kerlos Hany
                                &nbsp;
                            </span>
                        </a>
                        <Link href='/'>

                            <span className=' bg-chbg text-slate-100  px-2 rounded-xl bg-cover font-arabicUI2 '>
                                منصة شهد هاني
                            </span>
                        </Link>


                    </p>
                </div>


            </div>
        </footer>


    )
}

export default Footer
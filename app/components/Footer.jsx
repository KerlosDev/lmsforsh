import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaYoutube, FaTelegram, FaDiscord } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";
import { GiChemicalTank } from "react-icons/gi";

const Footer = () => {
    const links = [
        {
            title: "روابط سريعة", items: [
                { name: "الرئيسية", href: "/" },
                { name: "كورساتك", href: "/courses" }, 
            ]
        },
        {
            title: "معلومات التواصل", items: [

                { name: "واتساب", href: "tel:+201080506463" },
            ]
        },
    ];

    const socials = [
        { icon: <FaFacebook size={20} />, href: "#", label: "Facebook" },
        { icon: <FaYoutube size={20} />, href: "#", label: "Youtube" },
        { icon: <FaTelegram size={20} />, href: "#", label: "Telegram" },
        { icon: <BsWhatsapp size={20} />, href: "#", label: "WhatsApp" }, 
    ];

    return (
        <footer dir="rtl" className="bg-gradient-to-b font-arabicUI3 from-slate-900  to-slate-950">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <GiChemicalTank className="text-3xl text-teal-500" />
                            <span className="text-2xl text-white font-arabicUI2">
                                منصة شهد هاني
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm">
                            المنصة الأولى لتعليم الكيمياء بطريقة مبسطة وممتعة
                        </p>
                    </div>

                    {/* Quick Links */}
                    {links.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <h3 className="text-white font-arabicUI2 text-lg">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.items.map((item, index) => (
                                    <li key={index}>
                                        <Link href={item.href}
                                            className="text-gray-400 hover:text-teal-400 transition-colors">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Social Media */}
                    <div className="space-y-4">
                        <h3 className="text-white font-arabicUI2 text-lg">تابعنا</h3>
                        <div className="flex gap-4">
                            {socials.map((social, idx) => (
                                <a key={idx}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="p-2 bg-slate-800 rounded-lg hover:bg-blue-500 
                                             text-gray-400 hover:text-white transition-all">
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p   dir='rtl' className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} منصة شهد هاني - جميع الحقوق محفوظة
                    </p>
                    <a href="https://kerlos.site/"
                        className="relative group px-4 py-2 rounded-xl overflow-hidden">
                        <span className="relative z-10 text-sm font-medium bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 
                            bg-clip-text text-transparent  bg-[length:400%]  animate-flow">
                            Developed with ❤️ by Kerlos Hany
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 via-cyan-400/10 to-blue-400/10 
                              opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
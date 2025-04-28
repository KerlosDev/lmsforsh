'use client';
import React from 'react';
import { SignIn } from '@clerk/nextjs';
import { IoMdFlask } from "react-icons/io";
import { GiMolecule } from "react-icons/gi";
import { FaAtom } from "react-icons/fa";

const Page = () => {
    return (
        <div dir='rtl' className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4">
            {/* Floating molecules animation */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 text-white/10 text-7xl animate-float">
                    <FaAtom />
                </div>
                <div className="absolute bottom-40 right-20 text-white/10 text-8xl animate-spin-slow">
                    <GiMolecule />
                </div>
                <div className="absolute top-1/2 left-1/3 text-white/10 text-6xl animate-bounce-slow">
                    <IoMdFlask />
                </div>
                {/* Gradient orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse-delayed"></div>
            </div>

            {/* Main container */}
            <div className="relative w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 p-8">
                {/* Left side - Content */}
                <div className="w-full lg:w-1/2 text-center lg:text-right space-y-6">
                    <div className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-2xl
                         bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 
                         transform hover:scale-105 transition-all duration-500">
                        <IoMdFlask className="text-3xl text-blue-300" />
                        <span className="font-arabicUI2 text-xl text-blue-300">منصة والتر وايت</span>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-arabicUI2 font-bold text-white leading-tight">
                        مرحباً بك في منصة
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                            تعلم الكيمياء
                        </span>
                    </h1>

                    <p dir="rtl" className="text-lg lg:text-xl font-arabicUI2 text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
                        فالمنصة دي كان هدفي اخلي الكيمياء بالنسبالك لعبة مش مجرد ماده هتاخدها وبعد متخلص ثانوية عامه
                        <span className="text-blue-300"> ترميها لا بالعكس </span>
                        انت هتبقي عايز تكمل فيها لان احنا خليناها عادة مش مجرد ماده ❤️
                    </p>
                </div>

                {/* Right side - Sign In */}
                <div className="w-full lg:w-1/2 flex flex-col justify-start -mt-8 lg:-mt-16">
                    <div className="backdrop-blur-xl  rounded-3xl  
                                       transition-all duration-500 overflow-hidden">
                        <div className="-mr-6 -ml-6 lg:-mr-8" dir="ltr">
                            <SignIn appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: " shadow-none",
                                    footer: "hidden"
                                }
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
import React from 'react';
import { FaLightbulb } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";

const Hero = () => {
    return (
        <div className="select-none relative flex flex-col-reverse lg:flex-row lg:justify-between items-center lg:items-start p-4">
            {/* Background Image */}
            <img
                className="absolute -top-96 rotate-45 -z-20 -left-80 w-[2000px] max-lg:hidden"
                src='/dna.svg'
                alt="Background DNA"
            />

            {/* Image on the Right */}
            <div className="flex justify-center lg:justify-end w-full lg:w-auto mb-6 lg:mb-0">
                <img
                    src="/imageAhmed.png"
                    width={600}
                    height={200}
                    className="drop-shadow-2xl hidden lg:block"
                    alt="Ahmed Image"
                />
            </div>

            {/* Content Section */}
            <div className="text-center lg:text-right w-full lg:w-1/2 font-arabicUI3">
                {/* Main Heading */}
                <h2 className="leading-normal text-4xl lg:text-6xl text-red-500 flex justify-center lg:justify-end items-center mb-4 lg:mb-10">
                    .. شهد هاني
                    <span className="text-slate-950 dark:text-slate-400 ml-2">
                        <span className="text-4xl">/</span> د
                    </span>
                </h2>

                {/* Responsive Image for Smaller Screens */}
                <img
                    src="/imageAhmed.png"
                    width={300}
                    height={100}
                    className="drop-shadow-2xl lg:hidden mx-auto mb-6"
                    alt="Ahmed Image"
                />

                {/* Secondary Heading */}
                <div>
                    <h1 className="text-3xl lg:text-5xl dark:text-slate-400 flex justify-center lg:justify-end items-center mb-4">
                        <span className="text-4xl lg:text-7xl text-red-500 mr-2 lg:mr-3">2025</span>
                        يرحب بدفعه
                    </h1>

                    <h1 className="text-3xl lg:text-5xl dark:text-slate-400 leading-relaxed">
                        لشرح منهج{' '}
                        <span className="text-red-600 hover:scale-90 duration-300">الاحياء</span>{' '}
                        <span className="text-slate-800 dark:text-yellow-400">والجيولوجيا</span>
                    </h1>
                </div>

                {/* Motivational Quote */}
                <h3 className="text-3xl lg:text-5xl text-yellow-500 hover:scale-110 duration-300 font-rakkas flex justify-center lg:justify-end items-center my-10">
                    <FaLightbulb className="mr-2" />
                    ❝ لو طريقك صعب اعرف ان النهاية حلوة ❞
                </h3>

                {/* Promotional Section */}
                <div className="flex justify-center lg:justify-end">
                    <div className="shadow-2xl shadow-yellow-400 rounded-xl bg-yellow-400 p-4">
                        <h2 className="text-xl lg:text-4xl text-slate-950 flex items-center">
                            <GiTakeMyMoney className="text-2xl lg:text-5xl mr-2" />
                            خصم علي كورس التكاثر الان
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;

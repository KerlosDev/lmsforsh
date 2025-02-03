import React from 'react';
import { FaBook } from "react-icons/fa";
import { FaStopwatch20 } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";

const Content = () => {
    return (
        <div className=" m-10 font-arabicUI3 text-center cursor-default">
            <div className="bg-gradient-to-br  p-7 bg-yellowui  rounded-2xl shadow-xl shadow-yellowui/50 grid gap-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 items-center max-md:w-fit max-md:scale-90">
                {/* Weekly Exams */}
                <div className="transform transition-transform duration-300 hover:scale-105 bg-black rounded-lg outline-dashed outline-black outline-offset-4 flex justify-center items-center p-5 h-auto md:h-36 w-full">
                    <h4 className="text-3xl md:text-4xl  gap-3 flex items-center text-yellowui">
                        <FaBook className="text-6xl  md:text-7xl" />
                        امتحانات اسبوعيه
                    </h4>
                </div>

                {/* Unlimited Views */}
                <div className="transform transition-transform duration-300 hover:scale-105 bg-black rounded-lg outline-dashed outline-black outline-offset-4 flex justify-center items-center p-5 h-auto md:h-36 w-full">
                    <h4 className="text-3xl md:text-4xl max-sm:text-2xl gap-3 flex items-center text-yellowui">
                        <FaStopwatch20 className="text-7xl md:text-8xl" />
                        عدد المشاهدات مفتوح
                    </h4>
                </div>

                {/* No Deletion */}
                <div className="transform transition-transform duration-300 hover:scale-105 bg-black rounded-lg outline-dashed outline-black outline-offset-4 flex justify-center items-center p-5 h-auto md:h-36 w-full">
                    <h4 className="text-3xl md:text-4xl gap-3 max-sm:text-xl flex items-center text-yellowui">
                        <MdDeleteForever className="text-7xl md:text-8xl" />
                        لا يتم حذف المحتوي بعد وقت محدد
                    </h4>
                </div>
            </div>
        </div>
    );
};

export default Content;

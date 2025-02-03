'use client'
import "../globals.css";

import React, { useEffect, useState } from 'react'
import { FaBookmark } from "react-icons/fa";
import GlobalApi from '../api/GlobalApi';
import Link from 'next/link';
import { FaPlay } from "react-icons/fa";


const Courses = () => {


    const [datacourse, setdatacourse] = useState([])


    useEffect(() => {
        getallcoures()
    }, [])



    const getallcoures = () => {
        GlobalApi.getAllCourseList().then(res => {
            setdatacourse(res.courses)
        })
    }


    return (
        <div className="flex justify-start m-10  max-sm:m-5 bg-chbg cursor-default select-none bg-cover my-10  rounded-xl p-5">
            <div>
                {/* Header Section */}
                <div className="flex justify-end max-sm:justify-start my-16">
                    <h3 className="text-6xl max-sm:text-3xl text-right max-md:text-5xl flex text-white">
                        <FaBookmark className="mx-4" />
                        الكورسات
                    </h3>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 rtl-grid container">
                    {datacourse.map((item, index) => (
                        <div
                            key={index}
                            className="hover:brightness-95  duration-500 hover:scale-110 h-fit max-sm:m-0  bg-gradient-to-br shadow-2xl p-5 m-5 rounded-2xl 
                        backdrop-blur-3xl outline-white   shadow-white/30 outline-dashed outline-2 bg-white/5"
                        >
                            {/* Course Name */}
                            <Link href={`/Courses/${item?.nicknameforcourse}`}>
                                <h3 className="text-3xl max-md:text-5xl max-sm:text-lg leading-normal text-right text-white">
                                    {item?.nameofcourse}
                                </h3>
                            </Link>

                            {/* Course Description */}
                            <p className="whitespace-pre-line  max-sm:text-sm   drop-shadow-2xl leading-relaxed text-lg max-md:text-xl text-right mt-6 text-white/80 font-arabicUI3">
                                {item?.description}
                            </p>

                            {/* View Course Button */}
                            <Link href={`/Courses/${item?.nicknameforcourse}`}>
                                <div
                                    className="shadow-xl max-sm:text-lg font-arabicUI2 w-fit text-4xl max-lg:text-3xl m-auto flex justify-center p-3 my-8 bg-white/10 rounded-xl text-white 
                                hover:bg-black/40 hover:scale-110 duration-500 outline-dashed outline-2 outline-offset-4"
                                >
                                    مشاهده الكورس
                                    <FaPlay className="scale-90 mr-2" />
                                </div>

                                {/* Price or Free */}
                                {!item.isfree ? (
                                    <h1 className="text-5xl max-sm:text-3xl max-sm:p-0 rounded-lg drop-shadow-2xl text-white justify-center flex p-4 m-auto font-arabicUI3">
                                        <span>{item.price}</span> جنيه
                                    </h1>
                                ) : (
                                    <h1 className="text-5xl rounded-lg drop-shadow-2xl text-white justify-center flex p-4 m-auto font-arabicUI3">
                                        مجانا
                                    </h1>
                                )}
                            </Link>
                        </div>
                    ))}
                 
                </div>
            </div>
        </div>
    )
}

export default Courses
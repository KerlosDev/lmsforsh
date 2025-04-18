'use client'
import "../globals.css";
import React, { useEffect, useState } from 'react'
import { FaBookmark, FaPlay, FaAtom, FaFlask, FaMicroscope } from "react-icons/fa";
import { GiMolecule, GiChemicalDrop, GiTakeMyMoney } from "react-icons/gi";
import { IoMdFlask } from "react-icons/io";
import GlobalApi from '../api/GlobalApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from "@clerk/nextjs";

const Courses = () => {
    const router = useRouter();
    const { isSignedIn, userId } = useAuth();
    const [datacourse, setdatacourse] = useState([])

    useEffect(() => {
        getallcoures()
    }, [])

    const getallcoures = () => {
        GlobalApi.getAllCourseList().then(res => {
            setdatacourse(res.courses)
        })
    }

    const handleSubscribe = async (nickname) => {
        if (!isSignedIn || !userId) {
            router.push('/sign-up');
            return;
        }

        const course = datacourse.find(c => c.nicknameforcourse === nickname);
        
        if (course?.isfree) {
            try {
                const userInfo = {
                    email: userId,
                    fullName: userId // You might want to get actual user name from Clerk
                };
                
            
                
                // Redirect to course page after successful enrollment
                router.push(`/Courses/${nickname}`);
            } catch (error) {
                console.error('Error enrolling in free course:', error);
                // You might want to show an error message to the user
            }
        } else {
            router.push(`/payment/${nickname}`);
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-tl from-blue-50 via-white to-slate-50 
                        dark:from-blue-950 dark:via-slate-900 dark:to-slate-950 py-8 sm:py-16 px-4">
            {/* Enhanced Chemistry Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Existing floating elements */}
                <div className="absolute top-20 right-10 w-32 h-32 bg-blue-500/5 backdrop-blur-3xl rounded-full 
                              flex items-center justify-center animate-float">
                    <GiMolecule className="text-5xl text-blue-500/30 animate-spin-slow" />
                </div>
                <div className="absolute bottom-40 left-20 w-40 h-40 bg-red-500/5 backdrop-blur-3xl rounded-full 
                              flex items-center justify-center animate-float-delayed">
                    <FaFlask className="text-6xl text-red-500/30 animate-bounce" />
                </div>
                <div className="absolute inset-0 opacity-5 bg-[url('/chemistry-pattern.png')] bg-repeat"></div>

                {/* New Chemistry Elements */}
                <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-purple-500/5 backdrop-blur-3xl rounded-full 
                              flex items-center justify-center animate-float-slow">
                    <div className="relative">
                        <IoMdFlask className="text-4xl text-purple-500/40 animate-pulse" />
                        <div className="absolute -inset-1 bg-purple-500/20 blur-xl rounded-full"></div>
                    </div>
                </div>

                <div className="absolute top-2/3 left-1/3 w-28 h-28 bg-green-500/5 backdrop-blur-3xl rounded-full 
                              flex items-center justify-center animate-bounce-slow">
                    <div className="relative">
                        <GiMolecule className="text-5xl text-green-500/40 animate-spin-slow" />
                        <div className="absolute -inset-1 bg-green-500/20 blur-xl rounded-full"></div>
                    </div>
                </div>

                {/* DNA Helix Pattern */}
                <div className="absolute left-0 top-1/4 w-1 h-64 bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-blue-500/20 
                              rounded-full animate-pulse"></div>
                <div className="absolute right-0 top-1/2 w-1 h-64 bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-blue-500/20 
                              rounded-full animate-pulse-delay"></div>

                {/* Floating Bubbles */}
                <div className="absolute bottom-10 left-10 flex space-x-2">
                    <div className="w-2 h-2 bg-blue-500/30 rounded-full animate-float-slow"></div>
                    <div className="w-3 h-3 bg-purple-500/30 rounded-full animate-float-delayed"></div>
                    <div className="w-2 h-2 bg-green-500/30 rounded-full animate-float"></div>
                </div>

                {/* Chemistry Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('/chemistry-pattern.png')] bg-repeat opacity-5 
                              mix-blend-overlay animate-slide"></div>

                {/* Gradient Mesh */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 
                              backdrop-blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-16">
                    <div className="inline-flex items-center gap-2 sm:gap-4 px-4 sm:px-8 py-2 sm:py-4 bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl rounded-2xl
                                  border border-blue-500/20 mb-6">
                        <h1 className="text-3xl sm:text-5xl font-arabicUI2 text-slate-800 dark:text-white">الكورسات</h1>
                        <FaAtom className="text-3xl sm:text-4xl text-blue-500 animate-spin-slow" />
                    </div>
                    <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-arabicUI3 mt-4">
                        اختر الكورس المناسب وابدأ رحلة تعلم الكيمياء
                    </p>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 rtl-grid">
                    {datacourse
                        .filter(course => !course.isDraft) // Only show non-draft courses
                        .map((item, index) => (

                        <div key={index}
                            className="group relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl overflow-hidden
                                      border border-blue-500/20 hover:border-blue-400 transition-all duration-500
                                      hover:transform hover:scale-105 hover:shadow-xl">
                            {/* Price Tag - Ribbon Style */}
                            <div className={`absolute -left-12 top-4 -rotate-45 z-20 py-1 w-40 text-center
                                ${item.isfree ?
                                    'bg-green-500 text-white shadow-green-500/20' :
                                    'bg-yellow-500 text-slate-700  shadow-yellow-500/20'}
                                font-arabicUI2 text-lg shadow-lg`}>
                                {item.isfree ? 'مجاناً' : `${item.price} جنيه`}
                            </div>
                            <div className="relative h-48 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <img
                                    src={item.imageUrl || "/chbg.jpg"}
                                    alt={item.nameofcourse}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />

                                {/* Price Tag - Floating Style */}
                                <div className={`absolute top-4 right-4 z-20 px-4 py-1.5 rounded-full
                                    ${item.isfree ?
                                        'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                                        'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-800'}
                                    font-arabicUI2 text-sm backdrop-blur-md shadow-lg
                                    transform group-hover:scale-105 transition-transform duration-300`}>
                                    المراجعة النهائية
                                </div>

                                {/* Course Title - Overlay */}

                            </div>

                            {/* Course Header with Gradient */}
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-500/10 to-transparent" />

                            {/* Chemistry Icon */}
                            <div className="absolute top-4 left-4">
                                <GiChemicalDrop className="text-3xl text-blue-500 animate-bounce" />
                            </div>

                            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                {/* Course Title */}
                                <Link href={`/Courses/${item?.nicknameforcourse}`}>
                                    <h2 className="text-xl sm:text-2xl font-arabicUI2 text-slate-800 dark:text-white group-hover:text-blue-500
                                                 transition-colors mb-4">
                                        {item?.nameofcourse}
                                        <FaMicroscope className="inline-block mr-2 text-blue-500" />
                                    </h2>
                                </Link>

                                {/* Course Description */}
                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-arabicUI3 line-clamp-2 sm:line-clamp-3">
                                    {item?.description}
                                </p>

                                {/* Course Features */}
                                <div className="grid grid-cols-3 gap-2 my-4">
                                    <div className="flex flex-col items-center p-2 bg-blue-500/5 rounded-lg">
                                        <FaFlask className="text-blue-500 mb-1" />
                                        <span className="text-xs text-slate-600 dark:text-slate-300">تجارب عملية</span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 bg-red-500/5 rounded-lg">
                                        <GiMolecule className="text-red-500 mb-1" />
                                        <span className="text-xs text-slate-600 dark:text-slate-300">شرح تفاعلي</span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 bg-yellow-500/5 rounded-lg">
                                        <FaAtom className="text-yellow-500 mb-1" />
                                        <span className="text-xs text-slate-600 dark:text-slate-300">اختبارات</span>
                                    </div>
                                </div>

                                {/* Course Stats */}
                                <div className="flex flex-col gap-2">
                                    {/* Course Timeline */}
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex items-center gap-2 py-1.5 px-3 bg-gradient-to-r from-blue-50/80 to-transparent 
                                                    dark:from-blue-900/20 dark:to-transparent rounded-lg border-r-2 border-blue-500/50">
                                            <div className="flex items-center gap-2 min-w-[140px]">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm text-slate-600 dark:text-slate-300 font-arabicUI3">تاريخ الإنشاء:</span>
                                            </div>
                                            <span className="text-sm text-blue-600 dark:text-blue-400 font-arabicUI2 ml-auto">
                                                {item.dataofcourse ? new Intl.DateTimeFormat('ar-EG', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }).format(new Date(item.dataofcourse)) : 'غير محدد'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 py-1.5 px-3 bg-gradient-to-r from-emerald-50/80 to-transparent 
                                                    dark:from-emerald-900/20 dark:to-transparent rounded-lg border-r-2 border-emerald-500/50">
                                            <div className="flex items-center gap-2 min-w-[140px]">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                <span className="text-sm text-slate-600 dark:text-slate-300 font-arabicUI3">آخر تحديث:</span>
                                            </div>
                                            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-arabicUI2 ml-auto">
                                                {item.updatedAt ? new Intl.DateTimeFormat('ar-EG', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }).format(new Date(item.updatedAt)) : 'غير محدد'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons Container */}
                                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                    {/* View Course Button - Takes 2/3 width */}
                                    <Link href={`/Courses/${item?.nicknameforcourse}`} className="flex-[2]">
                                        <button className="w-full h-full relative group">
                                            {/* Neumorphic base */}
                                            <div className="absolute inset-0 border-2 group-hover:border-none border-blue-400 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 
                                                          dark:from-slate-800 dark:to-slate-900 shadow-[6px_6px_12px_rgba(0,0,0,0.15),-6px_-6px_12px_rgba(255,255,255,0.8)] 
                                                          dark:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(30,41,59,0.5)]
                                                          transform group-hover:scale-[0.98] group-active:scale-95 transition-all duration-300"></div>

                                            {/* Gradient overlay */}
                                            <div className="absolute inset-[2px] rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 
                                                          dark:from-blue-400/10 dark:to-indigo-400/10 opacity-0 group-hover:opacity-100 
                                                          transition-opacity duration-300 backdrop-blur-sm"></div>

                                            {/* Content container */}
                                            <div className="relative flex items-center justify-center gap-3 px-6 py-3.5">
                                                <span className="font-arabicUI2 text-lg text-slate-700 dark:text-slate-200 
                                                             group-hover:text-blue-600  dark:group-hover:text-blue-400 
                                                             transition-colors duration-300">
                                                    مشاهدة الكورس
                                                </span>
                                                <div className="relative">
                                                    <FaPlay className="text-sm text-blue-500 dark:text-blue-400 
                                                                    group-hover:text-blue-600 dark:group-hover:text-blue-300 
                                                                    transform group-hover:-translate-y-0.5 group-hover:scale-110 
                                                                    transition-all duration-300" />
                                                    <div className="absolute inset-0 blur-sm bg-blue-400/30 dark:bg-blue-300/30 
                                                                opacity-0 group-hover:opacity-100 scale-150 transition-all duration-300"></div>
                                                </div>
                                            </div>
                                        </button>
                                    </Link>

                                    {/* Subscribe Button - Takes 1/3 width */}
                                    {!item.isfree && (
                                        <button onClick={() => handleSubscribe(item?.nicknameforcourse)}
                                            className="flex-1 relative group">
                                            {/* Neumorphic base */}
                                            <div className="absolute border-2 group-hover:border-none border-green-400 inset-0 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 
                                                          dark:from-slate-800 dark:to-slate-900 shadow-[6px_6px_12px_rgba(0,0,0,0.15),-6px_-6px_12px_rgba(255,255,255,0.8)] 
                                                          dark:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(30,41,59,0.5)]
                                                          transform group-hover:scale-[0.98] group-active:scale-95 transition-all duration-300"></div>

                                            {/* Gradient overlay */}
                                            <div className="absolute inset-[2px] rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 
                                                          dark:from-emerald-400/10 dark:to-teal-400/10 opacity-0 group-hover:opacity-100 
                                                          transition-opacity duration-300 backdrop-blur-sm"></div>

                                            {/* Content container */}
                                            <div className="relative flex items-center justify-center gap-3 px-6 py-3.5">
                                                <span className="font-arabicUI2 text-lg text-slate-700 dark:text-slate-200 
                                                             group-hover:text-emerald-600 dark:group-hover:text-emerald-400 
                                                             transition-colors duration-300">
                                                    اشترك الآن
                                                </span>
                                                <div className="relative">
                                                    <GiTakeMyMoney className="text-xl text-emerald-500 dark:text-emerald-400 
                                                                          group-hover:text-emerald-600 dark:group-hover:text-emerald-300 
                                                                          transform group-hover:-translate-y-1 group-hover:scale-110 
                                                                          transition-all duration-300" />
                                                    <div className="absolute inset-0 blur-sm bg-emerald-400/30 dark:bg-emerald-300/30 
                                                                opacity-0 group-hover:opacity-100 scale-150 transition-all duration-300"></div>
                                                </div>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Courses;
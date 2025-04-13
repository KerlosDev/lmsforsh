'use client'
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FaLock, FaUnlock, FaGraduationCap, FaPlay } from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import GlobalApi from '../api/GlobalApi';
import { toast } from 'react-toastify';

const EnrollmentSection = ({ courseInfo, isCourseFound }) => {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [enrolled, setEnrolled] = useState(isCourseFound);

    const handleFreeEnrollment = async () => {
        if (!user) {
            toast.error('يرجى تسجيل الدخول أولاً');
            return;
        }

        setLoading(true);
        try {
            const result = await GlobalApi.autoEnrollFree(
                courseInfo.nicknameforcourse,
                user.primaryEmailAddress.emailAddress
            );

            if (result?.createUserEnroll?.id) {
                setEnrolled(true);
                toast.success('تم التسجيل في الكورس بنجاح');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('حدث خطأ في التسجيل');
        } finally {
            setLoading(false);
        }
    };

    if (courseInfo.isfree) {
        return (
            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
                <div className="space-y-6">
                    <div className="text-center">
                        <span className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full">
                            <FaUnlock className="text-green-400" />
                            <span className="text-green-400 font-medium">كورس مجاني</span>
                        </span>
                    </div>
                    {!user ? (
                        <Link href="/sign-in" className="block">
                            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 
                                transition flex items-center justify-center gap-2">
                                <span>تسجيل دخول للمشاهدة</span>
                                <FaLock />
                            </button>
                        </Link>
                    ) : enrolled ? (
                        <div className="text-center">
                            <button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg p-4 
                                transition flex items-center justify-center gap-2">
                                <span>شاهد المحتوى</span>
                                <FaPlay className="text-sm" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleFreeEnrollment}
                            disabled={loading}
                            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 
                                text-white rounded-lg p-4 transition flex items-center justify-center gap-2"
                        >
                            <span>{loading ? 'جاري التسجيل...' : 'ابدأ التعلم مجاناً'}</span>
                            <FaGraduationCap />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
            <div className="space-y-6">
                {user ? (
                    isCourseFound ? (
                        <div className="space-y-4 text-center">
                            <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full">
                                <BsLightningChargeFill className="text-green-400" />
                                <span className="text-green-400 font-medium">تم تفعيل الكورس</span>
                            </div>
                            <button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg p-4 
                                             transition flex items-center justify-center gap-2">
                                <span>شاهد المحتوى</span>
                                <FaPlay className="text-sm" />
                            </button>
                        </div>
                    ) : (
                        <Link href={`/payment/${courseInfo.nicknameforcourse}`} className="block">
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h3 className="text-3xl font-bold text-white mb-1">{courseInfo.price} جنيه</h3>
                                    <p className="text-gray-400">اشتراك لمرة واحدة</p>
                                </div>
                                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-4 
                                                 transition flex items-center justify-center gap-2">
                                    <span>اشترك الآن</span>
                                    <BsLightningChargeFill />
                                </button>
                            </div>
                        </Link>
                    )
                ) : (
                    <Link href="/sign-in" className="block">
                        <div className="space-y-4">
                            <div className="text-center">
                                <h3 className="text-3xl font-bold text-white mb-1">{courseInfo.price} جنيه</h3>
                                <p className="text-gray-400">سجل دخول للاشتراك</p>
                            </div>
                            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-4 
                                             transition flex items-center justify-center gap-2">
                                <span>تسجيل دخول</span>
                                <FaLock />
                            </button>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default EnrollmentSection;
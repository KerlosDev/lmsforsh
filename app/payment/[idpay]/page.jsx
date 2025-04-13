'use client'
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'

import { HiHeart } from "react-icons/hi";
import { ToastContainer, toast } from 'react-toastify';
import { GiMolecule } from "react-icons/gi";
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import GlobalApi from '../../api/GlobalApi';

const Page = ({ params }) => {
    const { idpay } = React.use(params);
    const [courseInfo, setCourseInfo] = useState(null);
    const [number, setNumber] = useState('');
    const [loading, setLoading] = useState(false); // State for loading status
    const [showmodel, setshowmodel] = useState(false)
    const [error, setError] = useState(null);
    const handlenumber = (e) => {
        setNumber(e.target.value);
    };
    const getallcoures = async () => {
        setLoading(true); // Start loading when fetching course data
        setError(null);
        try {
            const res = await GlobalApi.getcourseinfo(idpay);
            if (!res.course) {
                setError('الكورس غير موجود');
                return;
            }
            setCourseInfo(res.course);
        } catch (error) {
            console.error("Error fetching course info:", error);
            setError('حدث خطأ في تحميل بيانات الكورس');
        } finally {
            setLoading(false); // Stop loading after data fetch
        }
    };

    useEffect(() => {
        if (idpay) {
            getallcoures();
        }
    }, [idpay]);

    const { user } = useUser();

    useEffect(() => {
        if (user) {
            console.log(user.username);
        }
    }, [user]);

    const handleclicknum = async () => {
        if (!user || number.length < 10) return;

        setLoading(true);
        try {
            // First save the enrollment
            const enrollResponse = await GlobalApi.sendEnrollData(
                courseInfo?.nicknameforcourse,
                user?.primaryEmailAddress?.emailAddress,
                number
            );

            // Then save the activation request
            await GlobalApi.saveNewActivation({
                enrollmentId: enrollResponse.createUserEnroll.id,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userName: user?.firstName,
                phoneNumber: number,
                courseName: courseInfo?.nameofcourse,
                courseId: courseInfo?.nicknameforcourse,
                price: courseInfo?.price
            });

            setshowmodel(true);
        } catch (error) {
            console.error("Error processing payment:", error);
            toast.error("حدث خطأ أثناء معالجة الطلب");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleclicknum(); // Trigger the button click when Enter is pressed
        }
    };

    return (
        <div className="min-h-screen bg-[#0A1121] text-white font-arabicUI3">
            {/* Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/chemistry-pattern.png')] opacity-5" />
                <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-500/20 to-transparent blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-indigo-500/20 to-transparent blur-[120px]" />
            </div>

            <div className="relative container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full" />
                        <h1 className="text-3xl md:text-4xl font-bold">إتمام عملية الشراء</h1>
                        <p className="text-blue-400">خطوة واحدة تفصلك عن بداية رحلتك العلمية</p>
                    </div>

                    {error ? (
                        <div className="text-center p-8 bg-red-500/10 rounded-xl border border-red-500/20">
                            <h2 className="text-xl text-red-400 mb-4">{error}</h2>
                            <Link href="/">
                                <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl">
                                    العودة للصفحة الرئيسية
                                </button>
                            </Link>
                        </div>
                    ) : loading ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
                        </div>
                    ) : courseInfo ? (
                        <div className="grid md:grid-cols-5 gap-8">
                            {/* Left Section: Course Details */}

                            {/* Left Section: Course Details */}
                            <div dir='rtl' className="md:col-span-2 space-y-6">
                                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                                <GiMolecule className="text-2xl" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium">{courseInfo.nameofcourse}</h3>
                                                <p className="text-blue-400 text-sm">مع أ/ شهد هاني</p>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-blue-400">سعر الكورس</span>
                                                <span className="text-2xl font-bold">{courseInfo.price} جنيه</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* User Info */}
                                <div dir='rtl' className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-lg font-medium mb-4">معلومات المشترك</h3>
                                    {user ? (
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                                <span className="text-blue-400">الاسم</span>
                                                <span>{user.firstName || 'غير محدد'}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                                <span className="text-blue-400">البريد الإلكتروني</span>
                                                <span className="text-sm">{user.primaryEmailAddress?.emailAddress || 'غير محدد'}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            جاري تحميل معلومات المستخدم...
                                        </div>
                                    )}
                                </div>
                            </div>


                            {/* Payment Form Section */}
                            <div className="md:col-span-3">
                                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                    {!showmodel ? (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <h3 className="text-xl font-medium text-center">طريقة الدفع</h3>
                                                <div className="bg-gradient-to-r from-[#FF5A5F] to-[#FF8C8F] p-6 rounded-xl text-center space-y-3">
                                                    {/*                                                     <img src="/vod.png" alt="Vodafone Cash" className="h-16 mx-auto" />
 */}                                                    <div className="space-y-2">
                                                        <p className="text-xl">حول على رقم فودافون كاش</p>
                                                        <p className="text-4xl font-bold tracking-wider">01004365906</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="block text-sm text-blue-400">أدخل رقم الموبايل الذي حولت منه</label>
                                                <input
                                                    type="number"
                                                    value={number}
                                                    placeholder="01XXXXXXXXX"
                                                    onChange={handlenumber}
                                                    onKeyDown={handleKeyPress}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                                                         text-center focus:outline-none focus:border-blue-500 transition-colors"
                                                />

                                                <button
                                                    disabled={number.length < 10 || loading}
                                                    onClick={handleclicknum}
                                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 
                                                         hover:from-blue-600 hover:to-indigo-600 
                                                         disabled:from-gray-600 disabled:to-gray-700
                                                         text-white rounded-xl py-4 transition-all duration-300
                                                         flex items-center justify-center gap-2"
                                                >
                                                    {loading ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                                            <span>جاري التحقق...</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span>تأكيد عملية الدفع</span>
                                                            <HiHeart className="text-xl" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-6 py-8">
                                            <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto flex items-center justify-center">
                                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-medium text-green-400">تم استلام طلبك بنجاح</h3>
                                                <p className="text-blue-400">سيتم تفعيل الكورس خلال 24 ساعة</p>
                                            </div>
                                            <Link href="/">
                                                <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all duration-300">
                                                    العودة للصفحة الرئيسية
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;

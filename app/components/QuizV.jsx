'use client'
import React, { useEffect, useState } from 'react'
import GlobalApi from '../api/GlobalApi'
import { useUser } from '@clerk/nextjs'
import { FaMicroscope, FaTrophy, FaMedal, FaChartPie } from 'react-icons/fa';
import { GiChemicalDrop } from 'react-icons/gi';
import { BsLightningCharge, BsTrophy } from "react-icons/bs";
import { RiMedalLine } from "react-icons/ri";
import { IoTimeOutline } from "react-icons/io5";
import { MdOutlineScore } from "react-icons/md";

const QuizV = () => {

    const { user } = useUser()
    const email = user?.primaryEmailAddress?.emailAddress;
    const [quiz, setQuiz] = useState([])

    useEffect(() => {
        if (email) {
            quizdata(email);
        }
    }, [email]); // Add email dependency

    const quizdata = async (userEmail) => {
        if (!userEmail) return;

        try {
            const res = await GlobalApi.getQuizJsonResult(userEmail);
            if (res && res.quizresults) {
                const formattedQuizzes = res.quizresults.map(quiz => {
                    let jsonData = {};
                    try {
                        jsonData = JSON.parse(quiz.jsonReslut || '{}');
                    } catch (e) {
                        console.error('Error parsing JSON result:', e);
                    }

                    return {
                        ...quiz,
                        detailedResults: jsonData,
                        quizGrade: quiz.quizGrade || jsonData.score || 0,
                        numofqus: quiz.numofqus || jsonData.totalQuestions || 0,
                        nameofquiz: quiz.nameofquiz || jsonData.quizTitle || 'اختبار غير معروف',
                        submittedAt: jsonData.submittedAt || quiz.createdAt
                    };
                });

                setQuiz(formattedQuizzes);
            }
        } catch (error) {
            console.error('Error fetching quiz data:', error);
            setQuiz([]);
        }
    };

    const getScoreGrade = (score) => {
        if (score >= 90) return { label: 'ممتاز', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
        if (score >= 75) return { label: 'جيد جداً', color: 'text-blue-500', bg: 'bg-blue-500/10' };
        if (score >= 65) return { label: 'جيد', color: 'text-green-500', bg: 'bg-green-500/10' };
        return { label: 'يحتاج تحسين', color: 'text-purple-500', bg: 'bg-purple-500/10' };
    };

    // Function to format date
    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return 'تاريخ غير متوفر';
        }
    };

    // Calculate average score safely
    const calculateAverageScore = () => {
        if (!quiz.length) return 0;
        try {
            return Math.round(
                quiz.reduce((acc, curr) =>
                    acc + ((curr?.quizGrade || 0) / (curr?.numofqus || 1) * 100), 0
                ) / quiz.length
            );
        } catch (error) {
            console.error('Error calculating average:', error);
            return 0;
        }
    };

    return (
        <div className="h-fit bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl 
                      border border-blue-200 dark:border-blue-800 shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="relative">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-pink-500/5" />

                <div className="relative px-4 sm:px-6 py-6 sm:py-8">
                    <div className="flex flex-col space-y-6">
                        {/* User Info & Title - Responsive */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start 
                                      justify-between gap-4 sm:gap-0">
                            <div className="space-y-1 text-center sm:text-right">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 
                                                  rounded-xl border border-blue-500/20">
                                        <FaChartPie className="text-2xl text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-arabicUI2 bg-gradient-to-r from-blue-600 
                                                     to-purple-600 bg-clip-text text-transparent">
                                            سجل الاختبارات
                                        </h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-arabicUI3">
                                            مرحباً, {user?.fullName || 'الطالب'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats Badge - Responsive */}
                            <div className="flex items-center gap-3 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500/5 
                                          to-purple-500/5 rounded-xl border border-blue-200 dark:border-blue-800 
                                          w-full sm:w-auto justify-center sm:justify-start">
                                <div className="flex flex-col items-end">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">متوسط الدرجات</p>
                                    <p className="text-base sm:text-lg font-arabicUI2 text-blue-600 dark:text-blue-400">
                                        {calculateAverageScore()}%
                                    </p>
                                </div>
                                <div className="h-8 w-[1px] bg-gradient-to-b from-blue-500/20 to-purple-500/20" />
                                <div className="flex flex-col items-end">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">عدد الاختبارات</p>
                                    <p className="text-base sm:text-lg font-arabicUI2 text-purple-600 dark:text-purple-400">
                                        {quiz.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-6">
                {[
                    {
                        label: 'عدد الاختبارات',
                        value: quiz.length,
                        icon: BsTrophy,
                        bgColor: 'bg-blue-50 dark:bg-blue-900/30',
                        textColor: 'text-blue-600 dark:text-blue-400',
                        iconColor: 'text-blue-500',
                        borderColor: 'border-blue-900/20 dark:border-blue-800/50'
                    },
                    {
                        label: 'متوسط الدرجات',
                        value: `${calculateAverageScore()}%`,
                        icon: MdOutlineScore,
                        bgColor: 'bg-green-50 dark:bg-green-900/30',
                        textColor: 'text-green-600 dark:text-green-400',
                        iconColor: 'text-green-500',
                        borderColor: 'border-green-900/20 dark:border-green-800/50'
                    },
                    {
                        label: 'آخر اختبار',
                        value: quiz[0]?.quizGrade ?
                            `${Math.round((quiz[0].quizGrade / quiz[0].numofqus) * 100)}%` : '-',
                        icon: FaMedal,
                        bgColor: 'bg-purple-50 dark:bg-purple-900/30',
                        textColor: 'text-purple-600 dark:text-purple-400',
                        iconColor: 'text-purple-500',
                        borderColor: 'border-purple-900/20 dark:border-purple-800/50'
                    }
                ].map((stat, index) => (
                    <div key={index}
                        className={`${stat.bgColor} p-4 rounded-xl border ${stat.borderColor}
                                   hover:border-opacity-75 transition-colors duration-300`}>
                        <div className="flex items-center gap-2 mb-2">
                            <stat.icon className={stat.iconColor + " text-lg"} />
                            <span className="text-xs font-arabicUI3 text-slate-600 dark:text-slate-400">
                                {stat.label}
                            </span>
                        </div>
                        <p className={`text-xl font-arabicUI2 ${stat.textColor}`}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quiz Results List - Responsive */}
            <div className="p-4 sm:p-6 space-y-4">
                {quiz.length > 0 ? (
                    quiz.slice().reverse().map((item, index) => {
                        const score = (item?.quizGrade / item?.numofqus) * 100;
                        const grade = getScoreGrade(score);

                        return (
                            <div key={index}
                                className="group relative bg-white dark:bg-slate-900 rounded-xl p-3 sm:p-4
                                           border border-slate-200 dark:border-slate-700
                                           hover:border-blue-500/50 transition-all duration-300
                                           hover:shadow-lg hover:shadow-blue-500/10">
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                                    {/* Quiz Info - Responsive */}
                                    <div className="sm:col-span-4 text-center sm:text-right">
                                        <h3 className="font-arabicUI2 text-sm sm:text-base text-slate-800 
                                                     dark:text-white mb-1 line-clamp-1">
                                            {item?.nameofquiz || 'اختبار غير معروف'}
                                        </h3>
                                        <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-500">
                                            <IoTimeOutline className="text-xs" />
                                            <span className="font-arabicUI3 text-xs">
                                                {formatDate(new Date())}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Score Circle - Responsive */}
                                    <div className="sm:col-span-4 flex justify-center">
                                        <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                                <circle className="text-slate-200 dark:text-slate-700 stroke-current"
                                                    strokeWidth="10" fill="none" r="45" cx="50" cy="50" />
                                                <circle className={`${score >= 90 ? 'text-yellow-500' :
                                                    score >= 75 ? 'text-blue-500' :
                                                        'text-purple-500'} stroke-current`}
                                                    strokeWidth="10" strokeLinecap="round" fill="none"
                                                    r="45" cx="50" cy="50"
                                                    style={{
                                                        strokeDasharray: `${2 * Math.PI * 45}`,
                                                        strokeDashoffset: `${2 * Math.PI * 45 * (1 - score / 100)}`,
                                                        transition: 'stroke-dashoffset 1s ease-in-out',
                                                    }} />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-base sm:text-lg font-arabicUI2 text-slate-900 dark:text-white">
                                                    {Math.round(score)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Results - Responsive */}
                                    <div className="sm:col-span-4 flex flex-col sm:flex-row justify-center sm:justify-end 
                                                  items-center gap-2 sm:gap-4">
                                        <div className="text-center">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">الإجابات</p>
                                            <p className="text-sm font-arabicUI2 text-green-600">
                                                {item?.quizGrade}/{item?.numofqus}
                                            </p>
                                        </div>
                                        <div className={`${grade.bg} px-3 py-1 rounded-2xl`}>
                                            <span className={`text-xs sm:text-sm font-arabicUI3 ${grade.color}`}>
                                                {grade.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Add detailed results section if available */}
                                {item.detailedResults?.detailedAnswers && (
                                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                        <h4 className="text-sm font-arabicUI3 text-slate-600 dark:text-slate-300 mb-2">
                                            تفاصيل الإجابات
                                        </h4>
                                        <div className="space-y-2">
                                            {item.detailedResults.detailedAnswers.map((answer, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <span className={`text-sm ${answer.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                                        {answer.isCorrect ? '✓' : '✗'}
                                                    </span>
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                                        {answer.question}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center p-6 sm:p-8">
                        <div className="inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/30 
                                      rounded-full mb-4">
                            <FaChartPie className="text-xl sm:text-2xl text-blue-500" />
                        </div>
                        <h4 className="text-base sm:text-lg font-arabicUI3 text-slate-600 dark:text-slate-400">
                            لم يتم إجراء أي اختبارات بعد
                        </h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizV;
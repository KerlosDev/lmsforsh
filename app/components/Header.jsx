'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { UserButton, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { PiStudentBold } from "react-icons/pi";
import { FaBookBookmark } from "react-icons/fa6";
import { GiMolecule, GiChemicalDrop } from "react-icons/gi";
import { FaAtom } from "react-icons/fa";
import { RiMenu4Fill } from "react-icons/ri";
import { IoClose, IoNotifications } from "react-icons/io5";
import GlobalApi from '../api/GlobalApi';
import NotificationButton from './NotificationButton';

const Header = () => {
    const { user } = useUser()
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastReadTime, setLastReadTime] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('lastReadTime') || '0';
        }
        return '0';
    });
    const [showMobileNotifications, setShowMobileNotifications] = useState(false);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Fetch notifications every 5 minutes
            const interval = setInterval(fetchNotifications, 300000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const response = await GlobalApi.getNotifications();
            console.log('Notifications response:', response); // Debug log

            if (response?.data?.notifications || response?.notifications) {
                // Handle both possible response structures
                const notificationsData = response?.data?.notifications || response?.notifications;
                const notifArray = notificationsData.map(n => ({
                    ...n,
                    isRead: new Date(n.updatedAt) <= new Date(lastReadTime)
                }));
                console.log('Processed notifications:', notifArray); // Debug log
                setNotifications(notifArray);

                // Count unread notifications
                const unread = notifArray.filter(n =>
                    new Date(n.updatedAt) > new Date(lastReadTime)
                ).length;
                setUnreadCount(unread);
            } else {
                console.log('No notifications found in response'); // Debug log
                setNotifications([]);
                setUnreadCount(0);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setNotifications([]);
            setUnreadCount(0);
        }
    };

    const handleNotificationOpen = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) {
            const now = new Date().toISOString();
            setLastReadTime(now);
            localStorage.setItem('lastReadTime', now);
            setUnreadCount(0);
        }
    };

    const handleMobileNotificationClick = () => {
        setShowMobileNotifications(!showMobileNotifications);
        if (!showMobileNotifications) {
            const now = new Date().toISOString();
            setLastReadTime(now);
            localStorage.setItem('lastReadTime', now);
            setUnreadCount(0);
        }
    };

    const handleSignUp = () => {
        router.push("/sign-up")
    }
    const handleSignIn = () => {
        router.push("/sign-in")
    }

    const handleCoursesClick = () => {
        router.push("/subscriptions")
        setIsMobileMenuOpen(false)
    }

    return (
        <header dir='rtl' className="sticky top-0 z-[100] bg-gradient-to-b from-white/80 to-white/60 dark:from-slate-900/80 dark:to-slate-900/60 
                          backdrop-blur-xl border-b border-blue-500/10 dark:border-blue-500/5">
            {/* Chemistry-themed background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-2 right-1/4 opacity-20">
                    <GiMolecule className="text-3xl text-blue-500 animate-spin-slow" />
                </div>
                <div className="absolute -bottom-2 left-1/3 opacity-20">
                    <FaAtom className="text-2xl text-yellow-500 animate-pulse" />
                </div>
                <div className="absolute top-1/2 right-1/2 transform -translate-y-1/2 opacity-20">
                    <GiChemicalDrop className="text-2xl text-red-500 animate-bounce" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-2 sm:px-4 relative">
                <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
                    {/* Logo with enhanced chemistry animation */}
                    <Link href='/' className='shrink-0 group'>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="relative">
                                <div className="relative z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12
                                              bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl
                                              transform group-hover:scale-110 transition-all duration-500">
                                    <FaBookBookmark className="text-2xl sm:text-3xl text-white" />
                                    <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-xl 
                                                  opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                </div>
                                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl blur-xl 
                                              opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
                            </div>
                            <div className="flex flex-col">
                                <h2 className="font-arabicUI text-lg sm:text-2xl font-bold 
                                             bg-clip-text text-transparent bg-gradient-to-r 
                                             from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600
                                             transition-all duration-300">
                                    شهد هاني
                                </h2>
                                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-arabicUI2">
                                    منصة تعلم الكيمياء
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Menu - Hidden on Mobile */}
                    <div className="hidden md:flex items-center gap-1.5 sm:gap-2 md:gap-4">
                        {user ? (
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className="hidden sm:flex items-center">
                                    <Link href="/subscriptions"
                                        className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg 
                                                 text-slate-600 dark:text-slate-300 text-sm">
                                        <PiStudentBold className="text-lg sm:text-xl" />
                                        <span className="font-arabicUI">كورساتي</span>
                                    </Link>
                                </div>
                                <NotificationButton />
                                <div className="p-1 sm:p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                    <UserButton afterSignOutUrl="/" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <button
                                    onClick={handleSignIn}
                                    className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm 
                                             text-slate-600 dark:text-slate-300 font-arabicUI 
                                             hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg 
                                             transition-all duration-300 relative group"
                                >
                                    <span className="relative z-10">تسجيل الدخول</span>
                                    <div className="absolute inset-0 bg-blue-500/5 rounded-lg scale-0 
                                                  group-hover:scale-100 transition-transform duration-300"></div>
                                </button>
                                <button
                                    onClick={handleSignUp}
                                    className="relative overflow-hidden px-2 py-1.5 sm:px-3 sm:py-2 
                                             bg-gradient-to-r from-blue-500 to-blue-600 
                                             text-white text-xs sm:text-sm font-arabicUI rounded-lg
                                             transition-all duration-300 hover:shadow-lg
                                             hover:shadow-blue-500/25"
                                >
                                    <div className="absolute inset-0 bg-white/20 rounded-lg scale-0 
                                                  hover:scale-100 transition-transform duration-300"></div>
                                    <span className="hidden xs:inline relative z-10">انشاء حساب</span>
                                    <span className="xs:hidden relative z-10">حساب جديد</span>
                                </button>
                            </div>
                        )}
                        <div className="hidden md:block">
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        {isMobileMenuOpen ?
                            <IoClose className="text-2xl" /> :
                            <RiMenu4Fill className="text-2xl" />
                        }
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay - Fixed */}
            <div className={`fixed inset-0 z-[200] ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300
                        ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Menu Panel */}
                <div className={`absolute right-0 top-0 h-[100dvh] w-72 bg-white dark:bg-slate-900 shadow-xl 
                                transform transition-transform duration-300 ease-in-out overflow-y-auto
                                ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col p-4 gap-3">
                        {/* Menu Header */}
                        <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-arabicUI font-semibold text-slate-800 dark:text-white">القائمة</h3>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                            >
                                <IoClose className="text-2xl text-slate-600 dark:text-slate-300" />
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleCoursesClick}
                                className="flex items-center gap-2 px-4 py-3 text-slate-600 dark:text-slate-300 
                                         hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl font-arabicUI
                                         transition-colors duration-200 w-full text-right"
                            >
                                <PiStudentBold className="text-xl text-blue-500" />
                                <span>كورساتي</span>
                            </button>

                            {/* Auth Section */}
                            {user ? (
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={handleMobileNotificationClick}
                                        className="flex items-center justify-between w-full px-4 py-3 text-slate-600 
                                                 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 
                                                 rounded-xl font-arabicUI transition-colors duration-200"
                                    >
                                        <span>الاشعارات</span>
                                        <div className="relative">
                                            <IoNotifications className="text-xl text-blue-500" />
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 
                                                               text-white text-xs flex items-center justify-center 
                                                               rounded-full">{unreadCount}</span>
                                            )}
                                        </div>
                                    </button>

                                    {/* Mobile Notifications Popup */}
                                    {showMobileNotifications && (
                                        <div className="fixed inset-0 z-[300] flex items-center justify-center px-4"
                                            onClick={(e) => e.stopPropagation()}>
                                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                                                onClick={() => setShowMobileNotifications(false)}></div>
                                            <div className="relative w-full max-w-md max-h-[80vh] bg-white dark:bg-slate-800 
                                                          rounded-xl shadow-xl overflow-hidden scale-100 opacity-100
                                                          animate-in fade-in zoom-in duration-200">
                                                <div className="flex items-center justify-between p-4 border-b 
                                                              border-slate-200 dark:border-slate-700">
                                                    <h3 className="font-arabicUI font-semibold text-slate-800 dark:text-white">الاشعارات</h3>
                                                    <button onClick={() => setShowMobileNotifications(false)}
                                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                                        <IoClose className="text-xl text-slate-600 dark:text-slate-300" />
                                                    </button>
                                                </div>
                                                <div className="overflow-y-auto p-4 max-h-[60vh]">
                                                    {notifications.length > 0 ? (
                                                        notifications.map((notification) => (
                                                            <div key={notification.id}
                                                                className="p-3 mb-2 rounded-lg bg-slate-50 
                                                                          dark:bg-slate-700/50 text-slate-800 dark:text-slate-200">
                                                                <p className="font-arabicUI">{notification.message}</p>
                                                                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                                                                    {new Date(notification.updatedAt).toLocaleString('ar-EG')}
                                                                </span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-center text-slate-500 dark:text-slate-400 font-arabicUI py-8">
                                                            لا توجد اشعارات
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="px-4 py-2">
                                        <UserButton afterSignOutUrl="/" />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <button
                                        onClick={() => { handleSignIn(); setIsMobileMenuOpen(false); }}
                                        className="w-full px-4 py-3 text-slate-600 dark:text-slate-300 
                                                 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl 
                                                 font-arabicUI text-right"
                                    >
                                        تسجيل الدخول
                                    </button>
                                    <button
                                        onClick={() => { handleSignUp(); setIsMobileMenuOpen(false); }}
                                        className="w-full px-4 py-3 bg-blue-600 text-white font-arabicUI
                                                 hover:bg-blue-700 rounded-xl text-center"
                                    >
                                        انشاء حساب
                                    </button>
                                </div>
                            )}

                            {/* Theme Toggle */}
                            <div className="px-4 pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;

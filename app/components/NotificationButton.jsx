'use client'
import { useState, useEffect, useRef } from 'react'
import { IoNotifications } from "react-icons/io5";
import { GiMolecule } from "react-icons/gi";
import GlobalApi from '../api/GlobalApi';

const NotificationButton = () => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastReadTime, setLastReadTime] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('lastReadTime') || '0';
        }
        return '0';
    });

    const notificationRef = useRef(null);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 300000);

        // Add click outside listener
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            clearInterval(interval);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await GlobalApi.getNotifications();
            if (response?.notifications) {
                const notifArray = response.notifications.map(n => ({
                    id: n.id,
                    message: n.message,
                    updatedAt: n.updatedAt,
                    isRead: new Date(n.updatedAt) <= new Date(lastReadTime)
                }));
                setNotifications(notifArray);
                const unread = notifArray.filter(n =>
                    new Date(n.updatedAt) > new Date(lastReadTime)
                ).length;
                setUnreadCount(unread);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
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

    return (
        <div className="relative" ref={notificationRef}>
            <button
                onClick={handleNotificationOpen}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-300"
            >
                <IoNotifications className={`text-xl ${unreadCount > 0 ? 'text-blue-500' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs
                                   rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div className="absolute left-0 mt-2 w-80 max-h-[70vh] overflow-y-auto
                               bg-white dark:bg-slate-800 rounded-xl shadow-xl
                               border border-blue-500/10 dark:border-blue-500/5
                               transform opacity-100 scale-100 transition-all duration-300
                               z-50 custom-scrollbar">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700
                                  bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                        <h3 className="text-2xl font-arabicUI2 font-semibold
                                     text-slate-800 dark:text-white flex items-center gap-2">
                            <IoNotifications className="text-xl text-blue-400" />
                            الإشعارات
                        </h3>
                    </div>

                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {notifications && notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 transition-colors duration-200
                                              ${!notification.isRead
                                            ? 'bg-blue-50 dark:bg-blue-900/20'
                                            : 'bg-transparent'}`}
                                >
                                    <div className="flex gap-3 items-start">
                                        <div className={`mt-1 p-2 rounded-lg
                                                      ${!notification.isRead
                                                ? 'bg-blue-100 dark:bg-blue-800'
                                                : 'bg-slate-100 dark:bg-slate-700'}`}>
                                            <GiMolecule className={`text-xl
                                                               ${!notification.isRead
                                                    ? 'text-blue-600 dark:text-blue-300'
                                                    : 'text-slate-600 dark:text-slate-300'}`}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-arabicUI2
                                                       ${!notification.isRead
                                                    ? 'text-slate-900 dark:text-white font-semibold'
                                                    : 'text-slate-600 dark:text-slate-300'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                {new Date(notification.updatedAt).toLocaleString('ar-EG')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-slate-500 dark:text-slate-400 font-arabicUI">
                                    لا توجد إشعارات جديدة
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationButton;

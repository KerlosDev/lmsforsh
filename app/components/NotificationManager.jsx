'use client';
import { useState, useEffect } from 'react';
import GlobalApi from '../api/GlobalApi';
import { toast } from 'react-toastify';
import { FaTrash, FaEdit, FaBell } from 'react-icons/fa';

const NotificationManager = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newNotification, setNewNotification] = useState({
        message: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await GlobalApi.getNotifications();
            setNotifications(response?.notifications || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('فشل في تحميل الإشعارات');
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await GlobalApi.updateNotification(editingId, {
                    message: newNotification.message || ''
                });
                toast.success('تم تحديث الإشعار بنجاح');
            } else {
                await GlobalApi.createNotification({
                    message: newNotification.message || ''
                });
                toast.success('تم إرسال الإشعار بنجاح');
            }
            resetForm();
            fetchNotifications();
        } catch (error) {
            console.error('Notification error:', error);
            toast.error('حدث خطأ أثناء إرسال الإشعار');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الإشعار؟')) {
            try {
                setLoading(true);
                const response = await GlobalApi.deleteNotification(id);

                if (response?.deleteNotifiction?.id) {
                    toast.success('تم حذف الإشعار بنجاح');
                    await fetchNotifications();
                } else {
                    throw new Error('Failed to delete notification');
                }
            } catch (error) {
                console.error('Delete error:', error);
                toast.error('فشل في حذف الإشعار');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEdit = (notification) => {
        setNewNotification({
            message: notification.message || ''
        });
        setEditingId(notification.id);
    };

    const resetForm = () => {
        setNewNotification({
            message: ''
        });
        setEditingId(null);
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 md:p-6 mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-arabicUI3 text-white mb-4 md:mb-6 flex items-center gap-2">
                    <FaBell className="text-blue-400" />
                    {editingId ? 'تعديل الإشعار' : 'إرسال إشعار جديد'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={newNotification.message}
                        onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                        placeholder="محتوى الإشعار"
                        className="w-full p-3 rounded-lg bg-slate-700/50 text-white h-24 md:h-32 text-sm md:text-base"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full py-2 md:py-3 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                    >
                        {editingId ? 'تحديث الإشعار' : 'إرسال الإشعار'}
                    </button>
                </form>
            </div>

            <div className="space-y-3 md:space-y-4">
                {loading ? (
                    <div className="text-center p-4 text-white">جاري التحميل...</div>
                ) : notifications?.length > 0 ? (
                    notifications.map((notification) => (
                        <div key={notification.id}
                            className="bg-slate-800/30 p-3 md:p-4 rounded-lg flex flex-col md:flex-row 
                                      md:items-start md:justify-between gap-3 md:gap-4">
                            <div className="flex-1">
                                <p className="text-sm md:text-base text-slate-300">{notification.message}</p>
                                <span className="text-xs md:text-sm mt-2 text-slate-400 block">
                                    {new Date(notification.updatedAt).toLocaleDateString('ar-EG')}
                                </span>
                            </div>

                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => handleEdit(notification)}
                                    className="p-1.5 md:p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg"
                                >
                                    <FaEdit className="text-sm md:text-base" />
                                </button>
                              
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-4 text-slate-400">
                        لا توجد إشعارات
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationManager;

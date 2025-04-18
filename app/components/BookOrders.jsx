'use client';
import React, { useState, useEffect } from 'react';
import GlobalApi from '../api/GlobalApi';
import { BsCheck2Circle, BsClockHistory, BsXCircle } from 'react-icons/bs';
import { toast } from 'react-toastify';

export default function BookOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, cancelled: 0 });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const result = await GlobalApi.getBookOrders();
            const parsedOrders = JSON.parse(result.bookOrder.books || '[]');
            setOrders(parsedOrders);
            updateStats(parsedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('حدث خطأ أثناء تحميل الطلبات');
        } finally {
            setLoading(false);
        }
    };

    const updateStats = (orders) => {
        const newStats = orders.reduce((acc, order) => ({
            total: acc.total + 1,
            pending: acc.pending + (order.status === 'pending' ? 1 : 0),
            completed: acc.completed + (order.status === 'completed' ? 1 : 0),
            cancelled: acc.cancelled + (order.status === 'cancelled' ? 1 : 0),
        }), { total: 0, pending: 0, completed: 0, cancelled: 0 });
        setStats(newStats);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const updatedOrders = orders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            );
            await GlobalApi.updateBookOrders(updatedOrders);
            setOrders(updatedOrders);
            updateStats(updatedOrders);
            toast.success('تم تحديث حالة الطلب بنجاح');
        } catch (error) {
            toast.error('حدث خطأ أثناء تحديث حالة الطلب');
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'completed':
                return <BsCheck2Circle className="text-green-500 text-xl" />;
            case 'pending':
                return <BsClockHistory className="text-yellow-500 text-xl" />;
            case 'cancelled':
                return <BsXCircle className="text-red-500 text-xl" />;
            default:
                return null;
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        return order.status === filter;
    });

    return (
        <div className="p-6 space-y-6">
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                    <h3 className="text-white/70 font-arabicUI3 mb-2">إجمالي الطلبات</h3>
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="bg-yellow-500/10 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/20">
                    <h3 className="text-yellow-400 font-arabicUI3 mb-2">قيد الانتظار</h3>
                    <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
                </div>
                <div className="bg-green-500/10 backdrop-blur-lg rounded-xl p-6 border border-green-500/20">
                    <h3 className="text-green-400 font-arabicUI3 mb-2">مكتملة</h3>
                    <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
                </div>
                <div className="bg-red-500/10 backdrop-blur-lg rounded-xl p-6 border border-red-500/20">
                    <h3 className="text-red-400 font-arabicUI3 mb-2">ملغاة</h3>
                    <p className="text-3xl font-bold text-red-500">{stats.cancelled}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                {['all', 'pending', 'completed', 'cancelled'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg font-arabicUI3 transition-all ${
                            filter === status 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                    >
                        {status === 'all' ? 'الكل' : 
                         status === 'pending' ? 'قيد الانتظار' :
                         status === 'completed' ? 'مكتملة' : 'ملغاة'}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="text-center text-white/70">جاري التحميل...</div>
            ) : (
                <div className="grid gap-4">
                    {filteredOrders.map((order) => (
                        <div key={order.id} 
                             className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20
                                        transition-all hover:bg-white/20">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(order.status)}
                                        <h3 className="text-xl font-arabicUI2 text-white">{order.name}</h3>
                                    </div>
                                    <p className="text-white/70">{order.phone}</p>
                                    <p className="text-white/70">{order.governorate} - {order.address}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-400">{order.bookName}</span>
                                        <span className="text-white/50">|</span>
                                        <span className="text-green-400">{order.price} جنيه</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20
                                                 hover:bg-white/20 transition-all"
                                    >
                                        <option value="pending">قيد الانتظار</option>
                                        <option value="completed">تم التسليم</option>
                                        <option value="cancelled">ملغي</option>
                                    </select>
                                    <span className="text-sm text-white/50 text-center">
                                        {new Date(order.orderDate).toLocaleDateString('ar-EG')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

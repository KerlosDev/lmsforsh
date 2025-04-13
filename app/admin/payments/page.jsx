'use client'
import { useEffect, useState } from 'react';
import GlobalApi from '../../api/GlobalApi';

export default function PaymentLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPaymentLogs();
    }, []);

    const fetchPaymentLogs = async () => {
        try {
            const result = await GlobalApi.getPaymentLogs();
            setLogs(result.userEnrolls);
            console.log(result)
        } catch (error) {
            console.error('Error fetching payment logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-[#0A1121] text-white p-8" dir="rtl">
            <div className="max-w-7xl font-arabicUI3 mx-auto">
                <h1 className="text-3xl font-arabicUI3 mb-8">سجلات الدفع - فودافون كاش</h1>
                
                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
                    </div>
                ) : (
                    <div className="bg-white/5 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-blue-500/10">
                                    <tr>
                                        <th className="px-6 py-4 text-right">التاريخ</th>
                                        <th className="px-6 py-4 text-right">البريد الإلكتروني</th>
                                        <th className="px-6 py-4 text-right">رقم الهاتف</th>
                                        <th className="px-6 py-4 text-right">الكورس</th>
                                        <th className="px-6 py-4 text-right">السعر</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">{formatDate(log.createdAt)}</td>
                                            <td className="px-6 py-4">{log.userEmail}</td>
                                            <td className="px-6 py-4 font-mono">{log.phonenumber}</td>
                                            <td className="px-6 py-4">{log.course.nameofcourse}</td>
                                            <td className="px-6 py-4">{log.course.price} جنيه</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';
import React, { useEffect, useState } from 'react';
import GlobalApi from '../api/GlobalApi';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ExamResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        try {
            const data = await GlobalApi.getQuizResults();
            const parsedResults = data?.results || [];
            setResults(parsedResults);
            setLoading(false);
        } catch (error) {
            console.error('Error loading results:', error);
            setLoading(false);
        }
    };

    const chartData = {
        labels: [...new Set(results.map(r => r.userName))],
        datasets: [{
            label: 'متوسط الدرجات',
            data: [...new Set(results.map(r => r.userName))].map(name => {
                const userResults = results.filter(r => r.userName === name);
                return (userResults.reduce((acc, curr) => acc + curr.percentage, 0) / userResults.length).toFixed(2);
            }),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            borderColor: 'rgb(53, 162, 235)',
            borderWidth: 1,
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        family: 'arabicUI3'
                    }
                }
            },
            title: {
                display: true,
                text: 'متوسط درجات الطلاب',
                font: {
                    family: 'arabicUI3',
                    size: 16
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <Bar data={chartData} options={chartOptions} />
                </div>

                {/* Stats Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-arabicUI3 text-white mb-4">إحصائيات الاختبارات</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-xl">
                            <p className="text-white/70 text-sm mb-1">عدد الطلاب</p>
                            <p className="text-2xl text-white">{new Set(results.map(r => r.userName)).size}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl">
                            <p className="text-white/70 text-sm mb-1">عدد الاختبارات</p>
                            <p className="text-2xl text-white">{results.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Table */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-arabicUI3 text-white mb-4">تفاصيل النتائج</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-white/70 border-b border-white/10">
                                <th className="p-3 text-right">اسم الطالب</th>
                                <th className="p-3 text-right">الاختبار</th>
                                <th className="p-3 text-right">النتيجة</th>
                                <th className="p-3 text-right">التاريخ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, index) => (
                                <tr key={index} className="text-white border-b border-white/5 hover:bg-white/5">
                                    <td className="p-3">{result.userName}</td>
                                    <td className="p-3">{result.quizTitle}</td>
                                    <td className="p-3">{result.percentage.toFixed(1)}%</td>
                                    <td className="p-3">{new Date(result.submittedAt).toLocaleDateString('ar-EG')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExamResults;

'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AnalyticsGraph = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.name),
        datasets: [
            {
                label: 'اجمالي المشتركين',
                data: data.map(item => item.total),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1
            },
            {
                label: 'المشتركين المفعلين',
                data: data.map(item => item.active),
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: 'white',
                    font: { family: 'arabicUI3' }
                },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
                ticks: {
                    color: 'white',
                    font: { family: 'arabicUI3' }
                },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white',
                    font: { family: 'arabicUI3' }
                }
            },
            tooltip: {
                rtl: true,
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        const dataset = context.dataset.label;
                        return `${dataset}: ${value}`;
                    }
                }
            }
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white/80 font-arabicUI3 text-xl mb-4">احصائيات الكورسات</h3>
            <div className="h-[400px]">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default AnalyticsGraph;

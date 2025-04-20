'use client';
import { useEffect, useRef, useState } from 'react';
import GlobalApi from '../api/GlobalApi';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import { FaUser, FaEye, FaClock, FaList, FaTimes, FaWhatsapp, FaDownload, FaFilePdf, FaImage } from "react-icons/fa";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const LessonAnalytics = () => {
    const [stats, setStats] = useState({
        totalViews: 0,
        uniqueStudents: 0,
        mostViewedLesson: '',
        mostActiveStudent: ''
    });
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });
    const [studentList, setStudentList] = useState([]);
    const [sortBy, setSortBy] = useState('views'); // 'views' or 'recent'
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showLessonsModal, setShowLessonsModal] = useState(false);
    const [whatsappNumbers, setWhatsappNumbers] = useState({});
    const [studentChartData, setStudentChartData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'details'
    const [quizResults, setQuizResults] = useState([]);
    const reportRef = useRef(null);
    useEffect(() => {
        fetchLessonData();
        fetchWhatsappNumbers();
    }, []);

    const fetchLessonData = async () => {
        try {
            const result = await GlobalApi.getStudentHistory();
            const history = JSON.parse(result.historyOfStudent?.historyy || '[]');
            processData(history);
        } catch (error) {
            console.error('Error fetching lesson data:', error);
        }
    };

    const fetchWhatsappNumbers = async () => {
        try {
            const result = await GlobalApi.getWhatsAppData();
            if (result?.whatsappdata?.whatsappnumber) {
                // Parse the WhatsApp data
                const data = JSON.parse(result.whatsappdata.whatsappnumber);
                const userEmail = data.userEmail;
                // Create an object with the user's WhatsApp numbers
                setWhatsappNumbers({
                    [userEmail]: {
                        studentWhatsApp: data.studentWhatsApp,
                        parentWhatsApp: data.parentWhatsApp
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching WhatsApp numbers:', error);
        }
    };

    const processData = (data) => {
        // Count views per lesson
        const lessonViews = data.reduce((acc, item) => {
            const key = `${item.chapterTitle} - ${item.lessonTitle}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        // Count total views per student
        const studentViews = data.reduce((acc, item) => {
            acc[item.userEmail] = (acc[item.userEmail] || 0) + 1;
            return acc;
        }, {});

        // Process student data with per-lesson view counts
        const studentData = data.reduce((acc, item) => {
            const lessonKey = `${item.chapterTitle} - ${item.lessonTitle}`;

            if (!acc[item.userEmail]) {
                acc[item.userEmail] = {
                    email: item.userEmail,
                    totalViews: 0,
                    lastViewed: '',
                    lessonViews: {}, // Track views per lesson
                    lessons: new Set()
                };
            }

            // Increment total views
            acc[item.userEmail].totalViews++;

            // Increment lesson-specific views
            acc[item.userEmail].lessonViews[lessonKey] =
                (acc[item.userEmail].lessonViews[lessonKey] || 0) + 1;

            acc[item.userEmail].lessons.add(lessonKey);
            acc[item.userEmail].lastViewed = item.timestamp;
            return acc;
        }, {});

        const studentList = Object.values(studentData).map(student => ({
            ...student,
            views: student.totalViews,
            uniqueLessons: student.lessons.size,
            lessons: Array.from(student.lessons),
            lessonViews: student.lessonViews
        }));

        // Prepare chart data
        const labels = Object.keys(lessonViews);
        const viewCounts = Object.values(lessonViews);

        setChartData({
            labels,
            datasets: [
                {
                    label: 'عدد المشاهدات',
                    data: viewCounts,
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 1,
                    borderRadius: 4,
                }
            ]
        });

        setStudentList(studentList);

        // Calculate stats
        setStats({
            totalViews: data.length,
            uniqueStudents: new Set(data.map(item => item.userEmail)).size,
            mostViewedLesson: Object.entries(lessonViews).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A',
            mostActiveStudent: Object.entries(studentViews).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
        });
    };

    const sortStudents = (students) => {
        return [...students].sort((a, b) => {
            if (sortBy === 'views') {
                return b.views - a.views;
            }
            return new Date(b.lastViewed) - new Date(a.lastViewed);
        });
    };

    const exportAsImage = async () => {
        try {
            const element = reportRef.current;
            const canvas = await html2canvas(element, {
                backgroundColor: '#0A1121',
                scale: 2
            });

            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `تقرير-${selectedStudent ? selectedStudent.email : 'الطلاب'}.png`;
            link.click();
        } catch (error) {
            console.error('Error exporting image:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getWhatsAppLink = (number) => {
        if (!number) return '#';
        return `https://wa.me/${number.startsWith('0') ? '2' + number : number}`;
    };

    const prepareStudentChartData = (student) => {
        // Sort lessons by date
        const sortedLessons = Array.from(student.lessons).map(lesson => ({
            name: lesson,
            views: student.lessonViews[lesson],
            // Assuming we have timestamp data for each view
            dates: student.viewDates?.[lesson] || []
        }));

        return {
            labels: sortedLessons.map(l => l.name),
            datasets: [{
                label: 'عدد المشاهدات',
                data: sortedLessons.map(l => l.views),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1
            }]
        };
    };

    const fetchQuizResults = async (email) => {
        try {
            const results = await GlobalApi.getQuizJsonResult(email);
            setQuizResults(results.quizresults || []);
        } catch (error) {
            console.error('Error fetching quiz results:', error);
        }
    };

    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        setActiveTab('details');
        fetchQuizResults(student.email);
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white',
                    font: {
                        family: 'arabicUI3'
                    }
                }
            },
            tooltip: {
                backgroundColor: '#1a1a1a',
                titleColor: 'white',
                bodyColor: 'white',
                bodyFont: {
                    family: 'arabicUI3'
                },
                titleFont: {
                    family: 'arabicUI3'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'white',
                    font: {
                        family: 'arabicUI3'
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            y: {
                ticks: {
                    color: 'white',
                    font: {
                        family: 'arabicUI3'
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        }
    };

    return (
        <div ref={reportRef} className="p-6 space-y-6">
            {/* Tabs Navigation */}
            <div className="flex justify-end gap-4">
                <button
                    onClick={exportAsImage}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors text-white"
                >
                    <FaImage />
                    <span>تصدير كصورة</span>
                </button>

            </div>
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-3 rounded-xl font-arabicUI3 transition-colors
                        ${activeTab === 'overview'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                >
                    نظرة عامة
                </button>
                {selectedStudent && (
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`px-6 py-3 rounded-xl font-arabicUI3 transition-colors
                            ${activeTab === 'details'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                    >
                        تفاصيل الطالب
                    </button>
                )}
            </div>

            {activeTab === 'overview' ? (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-white/80 font-arabicUI3 text-lg mb-2">إجمالي المشاهدات</h3>
                            <p className="text-4xl font-bold text-white">{stats.totalViews}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-white/80 font-arabicUI3 text-lg mb-2">عدد الطلاب</h3>
                            <p className="text-4xl font-bold text-white">{stats.uniqueStudents}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-white/80 font-arabicUI3 text-lg mb-2">الدرس الأكثر مشاهدة</h3>
                            <p className="text-xl font-bold text-white">{stats.mostViewedLesson}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-white/80 font-arabicUI3 text-lg mb-2">الطالب الأكثر نشاطاً</h3>
                            <p className="text-lg font-bold text-white">{stats.mostActiveStudent}</p>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <h3 className="text-white font-arabicUI3 text-xl mb-6">مشاهدات الدروس</h3>
                        <div className="h-[400px]">
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Student List Section */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white font-arabicUI3 text-xl">قائمة الطلاب</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSortBy('views')}
                                    className={`px-4 py-2 rounded-lg font-arabicUI3 transition-colors
                                        ${sortBy === 'views'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                                >
                                    ترتيب حسب المشاهدات
                                </button>
                                <button
                                    onClick={() => setSortBy('recent')}
                                    className={`px-4 py-2 rounded-lg font-arabicUI3 transition-colors
                                        ${sortBy === 'recent'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                                >
                                    ترتيب حسب آخر نشاط
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-white/10">
                                    <tr className="text-white/70">
                                        <th className="py-3 px-4 text-right">الطالب</th>
                                        <th className="py-3 px-4 text-center">رقم الطالب</th>
                                        <th className="py-3 px-4 text-center">رقم ولي الأمر</th>
                                        <th className="py-3 px-4 text-center">عدد المشاهدات</th>
                                        <th className="py-3 px-4 text-center">الدروس المشاهدة</th>
                                        <th className="py-3 px-4 text-center">آخر نشاط</th>
                                        <th className="py-3 px-4 text-center">تفاصيل</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {sortStudents(studentList).map((student, index) => (
                                        <tr key={student.email} className="text-white/90 hover:bg-white/5">
                                            {/* Email cell */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                        <FaUser className="text-blue-400" />
                                                    </div>
                                                    <div className="font-medium">{student.email}</div>
                                                </div>
                                            </td>

                                            {/* Student WhatsApp cell */}
                                            <td className="py-4 px-4 text-center">
                                                {whatsappNumbers[student.email]?.studentWhatsApp ? (
                                                    <a
                                                        href={getWhatsAppLink(whatsappNumbers[student.email].studentWhatsApp)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors group"
                                                    >
                                                        <FaWhatsapp className="text-green-400 text-xl group-hover:text-green-300" />
                                                        <span className="text-sm text-white/70">{whatsappNumbers[student.email].studentWhatsApp}</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-white/30">لا يوجد</span>
                                                )}
                                            </td>

                                            {/* Parent WhatsApp cell */}
                                            <td className="py-4 px-4 text-center">
                                                {whatsappNumbers[student.email]?.parentWhatsApp ? (
                                                    <a
                                                        href={getWhatsAppLink(whatsappNumbers[student.email].parentWhatsApp)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors group"
                                                    >
                                                        <FaWhatsapp className="text-green-400 text-xl group-hover:text-green-300" />
                                                        <span className="text-sm text-white/70">{whatsappNumbers[student.email].parentWhatsApp}</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-white/30">لا يوجد</span>
                                                )}
                                            </td>

                                            {/* ...rest of existing cells... */}
                                            <td className="py-4 px-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <FaEye className="text-blue-400" />
                                                    <span>{student.views}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {student.uniqueLessons} درس
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <FaClock className="text-blue-400" />
                                                    <span>{formatDate(student.lastViewed)}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <button
                                                    onClick={() => handleStudentSelect(student)}
                                                    className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                                                >
                                                    <FaList className="text-blue-400" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                selectedStudent && (
                    <div className="space-y-6">
                        {/* Student Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h4 className="text-blue-400 mb-4">معلومات الطالب</h4>
                                <div className="space-y-3">
                                    <p className="text-white">{selectedStudent.email}</p>
                                    {/* WhatsApp Numbers */}
                                    {whatsappNumbers[selectedStudent.email]?.studentWhatsApp && (
                                        <a href={getWhatsAppLink(whatsappNumbers[selectedStudent.email].studentWhatsApp)}
                                            className="flex items-center gap-2 text-white/70 hover:text-white"
                                            target="_blank" rel="noopener noreferrer">
                                            <FaWhatsapp className="text-green-400" />
                                            <span>رقم الطالب: {whatsappNumbers[selectedStudent.email].studentWhatsApp}</span>
                                        </a>
                                    )}
                                    {whatsappNumbers[selectedStudent.email]?.parentWhatsApp && (
                                        <a href={getWhatsAppLink(whatsappNumbers[selectedStudent.email].parentWhatsApp)}
                                            className="flex items-center gap-2 text-white/70 hover:text-white"
                                            target="_blank" rel="noopener noreferrer">
                                            <FaWhatsapp className="text-green-400" />
                                            <span>رقم ولي الأمر: {whatsappNumbers[selectedStudent.email].parentWhatsApp}</span>
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h4 className="text-blue-400 mb-4">إحصائيات المشاهدة</h4>
                                <div className="space-y-3">
                                    <p className="text-white/70">إجمالي المشاهدات: {selectedStudent.totalViews}</p>
                                    <p className="text-white/70">عدد الدروس: {selectedStudent.uniqueLessons}</p>
                                    <p className="text-white/70">آخر نشاط: {formatDate(selectedStudent.lastViewed)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Analytics Chart */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h4 className="text-blue-400 mb-4">تحليل المشاهدات</h4>
                            <div className="h-[400px]">
                                <Bar
                                    data={prepareStudentChartData(selectedStudent)}
                                    options={{
                                        ...chartOptions,
                                        indexAxis: 'y',
                                        maintainAspectRatio: false,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Lessons List */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h4 className="text-blue-400 mb-4">تفاصيل الدروس</h4>
                            <div className="space-y-4">
                                {Array.from(selectedStudent.lessons)
                                    .sort((a, b) => selectedStudent.lessonViews[b] - selectedStudent.lessonViews[a])
                                    .map((lesson, index) => (
                                        <div key={index}
                                            className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-white/90 font-arabicUI3">{lesson}</p>
                                                <p className="text-sm text-white/50">
                                                    آخر مشاهدة: {formatDate(selectedStudent.lastViewed)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaEye className="text-blue-400" />
                                                <span className="text-white/70">
                                                    {selectedStudent.lessonViews[lesson]} مشاهدة
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Quiz Results Card */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h4 className="text-blue-400 mb-4">نتائج الاختبارات</h4>
                            <div className="space-y-4">
                                {quizResults.length > 0 ? (
                                    quizResults.map((result, index) => (
                                        <div key={index}
                                            className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-white/90 font-arabicUI3">
                                                    {result.nameofquiz || 'اختبار'}
                                                </p>
                                                <p className="text-sm text-white/50">
                                                    عدد الأسئلة: {result.numofqus || 0}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className={`px-3 py-1 rounded-full ${(result.quizGrade / result.numofqus) * 100 >= 50
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {result.quizGrade} / {result.numofqus}
                                                </div>
                                                <p className="text-sm text-white/50">
                                                    {new Date(result.submittedAt).toLocaleDateString('ar-EG')}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-white/50">لا توجد نتائج اختبارات</p>
                                )}
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default LessonAnalytics;

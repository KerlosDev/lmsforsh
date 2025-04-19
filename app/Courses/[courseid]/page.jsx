'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import GlobalApi from '../../api/GlobalApi';
import { FaLock, FaPlay } from "react-icons/fa";
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { FaChalkboardTeacher } from "react-icons/fa";
import { BiSolidPencil } from "react-icons/bi";
import Head from 'next/head';

const CoursePageSkeleton = dynamic(() => import('../../components/CoursePageSkeleton'));

// Dynamic import for EnrollmentSection with loading fallback
const EnrollmentSection = dynamic(
    () => import('../../components/EnrollmentSection'),
    {
        loading: () => <div className="w-full md:w-96 h-48 bg-white/5 animate-pulse rounded-xl"></div>,
        ssr: false
    }
);

// Dynamic import for UserInfoCard
const UserInfoCard = dynamic(
    () => import('../../components/UserInfoCard'),
    {
        loading: () => <div className="h-20 bg-white/5 animate-pulse rounded-xl mb-4"></div>,
        ssr: false
    }
);

const CoursePage = () => {
    const params = useParams();
    const { courseid } = params;
    const { user, isLoaded } = useUser(); // Add isLoaded from useUser
    const [courseInfo, setCourseInfo] = useState([]);
    const [courseVideoChapters, setcourseVideoChapters] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeIndex2, setActiveIndex2] = useState(100);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [exams, setExams] = useState([]); // Add exams state

    const getallcoures = async () => {
        setLoading(true);
        try {
            const res = await GlobalApi.getcourseinfo(courseid);
            if (!res?.course) {
                console.error("Course not found");
                return;
            }
            setCourseInfo(res.course);

            // Fetch chapters from JSON storage
            const chaptersData = await GlobalApi.getChaptersData();
            const filteredChapters = chaptersData.chapters
                .filter(ch => ch.courseNickname === courseid)
                .sort((a, b) => a.order - b.order)
                .map(ch => ({
                    nameofchapter: ch.title,
                    linkOfVideo: ch.linkOfVideo,
                    order: ch.order
                }));

            // Fetch exams from JSON storage
            const examOrderData = await GlobalApi.getExamOrder();
            const courseExams = examOrderData.examOrders
                .filter(ex => ex.courseNickname === courseid)
                .sort((a, b) => a.order - b.order);

            // Fetch full exam details for each exam ID
            const allExams = await GlobalApi.getAllExams();
            const examDetails = courseExams.map(orderExam => {
                const fullExam = allExams.exams.find(e => e.id === orderExam.examId);
                return {
                    ...fullExam,
                    order: orderExam.order
                };
            }).filter(Boolean); // Remove any null values

            setcourseVideoChapters(filteredChapters);
            setExams(examDetails);
        } catch (error) {
            console.error("Error fetching course:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initializePage = async () => {
            if (courseid) {
                try {
                    await getallcoures();
                    if (user?.primaryEmailAddress?.emailAddress) {
                        const hasAccess = await GlobalApi.checkUserEnrollment(
                            user.primaryEmailAddress.emailAddress,
                            courseid
                        );
                        setIsEnrolled(hasAccess);
                    }
                } catch (error) {
                    console.error("Error initializing page:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        initializePage();
    }, [courseid, user]);

    useEffect(() => {
        // Update the document title when courseInfo changes
        if (courseInfo.nameofcourse) {
            document.title = `${courseInfo.nameofcourse} - منصة شهد هاني `;
        }
    }, [courseInfo]);

    const handlechapterClick = (index) => {
        setActiveIndex(index);
        setActiveIndex2(100);
    };

    const handlechapterClick2 = (index) => {
        setActiveIndex2(index);
        setActiveIndex(1000);
    };

    // Add this array for fixed positions
    const fixedPositions = [
        { top: '10%', left: '5%', delay: '0s' },
        { top: '20%', left: '80%', delay: '1s' },
        { top: '40%', left: '15%', delay: '2s' },
        { top: '60%', left: '90%', delay: '1.5s' },
        { top: '80%', left: '25%', delay: '0.5s' },
        { top: '30%', left: '40%', delay: '2.5s' },
        { top: '70%', left: '60%', delay: '1.8s' },
        { top: '90%', left: '10%', delay: '0.8s' },
        { top: '15%', left: '70%', delay: '2.2s' },
        { top: '45%', left: '30%', delay: '1.2s' }
    ];

    // Show locked content if no user or not enrolled
    const isContentLocked = !user || !isEnrolled;

    if (loading) {
        return (
            <>
                <Head>
                    <title>جاري التحميل... - شهد هاني</title>
                </Head>
                <div dir='rtl' className="min-h-screen bg-[#0A1121] text-white font-arabicUI3">
                    <div className="fixed inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />
                        <div className="absolute h-full w-full bg-[url('/grid.svg')] opacity-[0.02]" />
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 py-8">
                        <CoursePageSkeleton />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{courseInfo.nameofcourse ? `${courseInfo.nameofcourse} - منصة شهد هاني ` : 'منصة شهد هاني '}</title>
            </Head>
            <div dir='rtl' className="min-h-screen bg-[#0A1121] text-white font-arabicUI3">
                {/* Animated Background */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />
                    <div className="absolute h-full w-full bg-[url('/grid.svg')] opacity-[0.02]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-8">
                    {/* Add UserInfoCard at the top */}


                    {/* Course Header */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Course Info */}
                            <div className="flex-1 space-y-4">
                                <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full">
                                    <FaChalkboardTeacher className="text-blue-400" />
                                    <span className="text-blue-400">كورس كيمياء</span>
                                </div>
                                <h1 className="text-4xl font-bold text-white">{courseInfo.nameofcourse}🧪</h1>
                                <p className="text-gray-400 text-lg">{courseInfo.description}</p>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <img src="/prof.jpg"
                                            className="w-10 h-10 rounded-full border-2 border-blue-500" />
                                        <div>
                                            <p className="text-white">أ/ {courseInfo.instructor}</p>
                                            <p className="text-sm text-gray-400">دكتورة الكيمياء</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enrollment Card */}
                            <div className="w-full md:w-96">
                                <EnrollmentSection courseInfo={courseInfo} isCourseFound={isEnrolled} />
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Video Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900">
                                {courseVideoChapters[activeIndex]?.linkOfVideo && !isContentLocked ? (
                                    <iframe
                                        className="w-full h-full"
                                        src={courseVideoChapters[activeIndex]?.linkOfVideo.replace("watch?v=", "embed/")}
                                        allowFullScreen
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <FaLock className="text-4xl text-gray-600 mx-auto mb-4" />
                                            <p className="text-gray-400">
                                                {!user ? "قم بتسجيل الدخول للوصول إلى المحتوى" :
                                                    !isEnrolled ? "اشترك في الكورس للوصول إلى المحتوى" :
                                                        "اختر درساً للمشاهدة"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Chapter Info */}
                            <div className="bg-gray-800/50 rounded-xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4">
                                    {courseVideoChapters[activeIndex]?.nameofchapter}
                                </h2>
                                <p className="text-gray-400">
                                    {courseVideoChapters[activeIndex]?.description}
                                </p>
                            </div>
                        </div>

                        {/* Chapters List */}
                        <div className="bg-gray-800/50 rounded-xl h-fit">
                            <div className="p-4 border-b border-gray-700">
                                <h3 className="text-lg font-medium text-white">محتويات الكورس</h3>
                            </div>
                            <div className="divide-y divide-gray-700 max-h-[400px] overflow-y-auto">
                                {courseVideoChapters.map((chapter, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlechapterClick(index)}
                                        className={`w-full p-4 flex items-center gap-4 hover:bg-gray-700/50 transition
                                        ${activeIndex === index ? 'bg-blue-500/20' : ''}`}
                                        disabled={!isEnrolled}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                                        ${activeIndex === index ? 'bg-blue-500' : 'bg-gray-700'}`}>
                                            {isEnrolled ? <FaPlay className="text-white" /> : <FaLock className="text-gray-400" />}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-medium">{chapter.nameofchapter} 🧪</p>
                                            <p className="text-sm text-gray-400">{chapter.duration || '50:00'} دقيقة</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Quiz Section */}
                            <div className="border-t border-gray-700">
                                <div className="p-4 border-b border-gray-700">
                                    <h3 className="text-lg font-medium text-white">الاختبارات</h3>
                                </div>
                                <div className="divide-y divide-gray-700">
                                    {exams?.map((quiz, index) => (
                                        <Link
                                            href={isEnrolled ? `/quiz/${quiz.id}` : '#'}
                                            key={index}
                                            className={`w-full p-4 flex items-center gap-4 hover:bg-gray-700/50 transition
                                            ${activeIndex2 === index ? 'bg-blue-500/20' : ''}
                                            ${!isEnrolled ? 'pointer-events-none opacity-50' : ''}`}
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                                            ${activeIndex2 === index ? 'bg-blue-500' : 'bg-gray-700'}`}>
                                                {isEnrolled ? <BiSolidPencil className="text-white" /> : <FaLock className="text-gray-400" />}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-medium">{quiz.title} 🧪</p>
                                                <p className="text-sm text-gray-400">اختبار تفاعلي</p>
                                            </div>
                                        </Link>
                                    ))}
                                    {exams?.length === 0 && (
                                        <div className="p-4 text-center text-gray-400">
                                            لا يوجد اختبارات متاحة حالياً
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Show login prompt if no user */}
                {!user && !loading && (
                    <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                        <h2 className="text-2xl font-bold mb-4">يرجى تسجيل الدخول</h2>
                        <p className="text-gray-400 mb-4">قم بتسجيل الدخول للوصول إلى محتوى الكورس</p>
                        <Link href="/sign-in">
                            <button className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl">
                                تسجيل الدخول
                            </button>
                        </Link>
                    </div>
                )}

                {!isEnrolled && !loading && (
                    <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                        <h2 className="text-2xl font-bold mb-4">لم يتم تفعيل الكورس بعد</h2>
                        <p className="text-gray-400 mb-4">يرجى الانتظار حتى يتم تفعيل اشتراكك</p>
                        <Link href={`/payment/${courseInfo.nicknameforcourse}`}>
                            <button className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl">
                                الذهاب لصفحة الدفع
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default CoursePage;
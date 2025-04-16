'use client';
import React, { useState, useEffect } from 'react';
import GlobalApi from '../api/GlobalApi';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaBook, FaVideo, FaQuestionCircle, FaArrowUp, FaArrowDown, FaCopy, FaArchive } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CourseSkeleton from './CourseSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

const CourseManager = () => {
    const [courses, setCourses] = useState([]);
    const [editingCourse, setEditingCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({
        nameofcourse: '',        // Single line text, String, Title
        description: '',         // Multi line text, String
        // Enumeration, colorCard, Required
        price: '',              // Number, Int
        isfree: false,          // Boolean
        dataofcourse: '',       // Date
        nicknameforcourse: '',  // Slug, String, Unique
        chapterMood: {          // Basic chapter, Multiple values
            nameofchapter: '',
            linkOfVideo: ''
        },
        exam: {                 // exam, Multiple values, One-way reference
            title: '',
            jsonexam: ''
        }
    });
    const [chapters, setChapters] = useState([{ nameofchapter: '', linkOfVideo: '' }]);
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [showExamModal, setShowExamModal] = useState(false);
    const [editingChapters, setEditingChapters] = useState([]);
    const [editingExam, setEditingExam] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [courseChapters, setCourseChapters] = useState({});
    const [selectedExams, setSelectedExams] = useState([]); // New state for multiple exams
    const [courseExams, setCourseExams] = useState({});
    const [examOrder, setExamOrder] = useState([]); // Add this state

    useEffect(() => {
        fetchCourses();
        fetchExams();
        fetchAllChapters();
        fetchExamOrders();
    }, []);

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const result = await GlobalApi.getAllCourseList();
            console.log(result)
            setCourses(result.courses || []);
        } catch (error) {
            toast.error('Failed to fetch courses');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchExams = async () => {
        try {
            const result = await GlobalApi.getAllExams();
            setExams(result.exams || []);
        } catch (error) {
            toast.error('Failed to fetch exams');
        }
    };

    const fetchAllChapters = async () => {
        try {
            const result = await GlobalApi.getChaptersData();
            console.log('Fetched chapters:', result); // Debug log
            const chaptersMap = {};
            result.chapters.forEach(chapter => {
                if (!chaptersMap[chapter.courseNickname]) {
                    chaptersMap[chapter.courseNickname] = [];
                }
                chaptersMap[chapter.courseNickname].push({
                    nameofchapter: chapter.title,
                    linkOfVideo: chapter.linkOfVideo,
                    order: chapter.order
                });
            });

            // Sort chapters by order
            Object.keys(chaptersMap).forEach(nickname => {
                chaptersMap[nickname].sort((a, b) => a.order - b.order);
            });

            setCourseChapters(chaptersMap);
        } catch (error) {
            console.error('Error fetching chapters:', error);
        }
    };

    const fetchExamOrders = async () => {
        try {
            const result = await GlobalApi.getExamOrder();
            console.log('Exam orders:', result);
            setExamOrder(result.examOrders || []);
        } catch (error) {
            console.error('Error fetching exam orders:', error);
        }
    };

    const handleEdit = async (course) => {
        try {
            console.log('Original course data:', course);
            // Get chapters from JSON storage for this course
            const result = await GlobalApi.getChaptersData();
            const courseChapters = result.chapters
                .filter(ch => ch.courseNickname === course.nicknameforcourse)
                .sort((a, b) => a.order - b.order)
                .map(ch => ({
                    nameofchapter: ch.title,
                    linkOfVideo: ch.linkOfVideo,
                    order: ch.order
                }));

            const editData = {
                ...course,
                description: course.description || '',
                exam: course.exam?.[0] || null
            };

            console.log('Setting editingCourse:', editData);
            console.log('Setting editingChapters:', courseChapters);

            // Get exam orders for this course
            const examOrderData = await GlobalApi.getExamOrder();
            const courseExams = examOrderData.examOrders
                .filter(ex => ex.courseNickname === course.nicknameforcourse)
                .sort((a, b) => a.order - b.order);

            // Get full exam details
            const allExams = await GlobalApi.getAllExams();
            const selectedExams = courseExams.map(orderExam => {
                const fullExam = allExams.exams.find(e => e.id === orderExam.examId);
                return {
                    ...fullExam,
                    order: orderExam.order
                };
            }).filter(Boolean);

            setEditingCourse(editData);
            setEditingChapters(courseChapters.length > 0 ?
                courseChapters :
                [{ nameofchapter: '', linkOfVideo: '' }]
            );
            setSelectedExams(selectedExams); // Update selected exams with order
        } catch (error) {
            console.error('Error in handleEdit:', error);
            setEditingChapters([{ nameofchapter: '', linkOfVideo: '' }]);
            toast.error('Error loading course data');
        }
    };

    const handleSave = async () => {
        try {
            console.log('Current editingCourse state:', editingCourse);

            if (!editingCourse.nameofcourse || !editingCourse.nicknameforcourse) {
                toast.error('Please fill in the course title and nickname');
                return;
            }

            const updatedCourse = {
                nameofcourse: editingCourse.nameofcourse,
                description: editingCourse.description || '',
                price: Number(editingCourse.price) || 0,
                isfree: Boolean(editingCourse.isfree),
                nicknameforcourse: editingCourse.nicknameforcourse,
                chapters: editingChapters, // Include chapters in the update
                exams: selectedExams
            };

            console.log('Sending update with:', updatedCourse);

            const result = await GlobalApi.updateCourse(editingCourse.id, updatedCourse);
            console.log('Update result:', result);

            if (result?.updateCourse?.id) {
                // Update both chapters and exams
                await Promise.all([
                    GlobalApi.updateCourseChapters(editingCourse.nicknameforcourse, editingChapters),
                    GlobalApi.updateCourseExams(editingCourse.nicknameforcourse, selectedExams)
                ]);

                toast.success('تم تحديث الكورس بنجاح');
                setEditingCourse(null);
                setEditingChapters([]); // Reset chapters
                setSelectedExams([]); // Reset exams

                // Show loading state while refreshing
                setIsLoading(true);
                await fetchCourses();
                await fetchAllChapters(); // Refresh chapters data
                await fetchExamOrders(); // Refresh exam orders
            } else {
                throw new Error('Failed to update course');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.message || 'فشل تحديث الكورس');
        }
    };

    const handleAddCourse = async () => {
        try {
            if (!newCourse.nameofcourse || !newCourse.nicknameforcourse) {
                toast.error('Please fill in all required fields');
                return;
            }

            const courseData = {
                nameofcourse: newCourse.nameofcourse,
                description: newCourse.description || '',
                price: Number(newCourse.price) || 0,
                isfree: newCourse.isfree,
                dataofcourse: newCourse.dataofcourse || new Date().toISOString(),
                nicknameforcourse: newCourse.nicknameforcourse,
                chapters: chapters.filter(ch => ch.nameofchapter && ch.linkOfVideo), // Only include non-empty chapters
                selectedExam: selectedExam,
                exams: selectedExams, // Update to use multiple exams
            };

            const result = await GlobalApi.createCourse(courseData);

            if (result?.createCourse?.id) {
                toast.success('Course added successfully');
                setIsModalOpen(false);
                resetForm();
                fetchCourses();
            } else {
                throw new Error('Failed to create course');
            }
        } catch (error) {
            console.error('Error adding course:', error);
            toast.error(error.message || 'Failed to add course');
        }
    };

    const resetForm = () => {
        setNewCourse({
            nameofcourse: '',
            description: '',
            price: '',
            isfree: false,
            dataofcourse: '',
            nicknameforcourse: '',
            chapterMood: { nameofchapter: '', linkOfVideo: '' },
            exam: { title: '', jsonexam: '' }
        });
        setChapters([{ nameofchapter: '', linkOfVideo: '' }]);
        setSelectedExam(null);
    };

    const addChapter = () => {
        setChapters([...chapters, { nameofchapter: '', linkOfVideo: '' }]);
    };

    const removeChapter = (index) => {
        const newChapters = chapters.filter((_, i) => i !== index);
        setChapters(newChapters);
    };

    const updateChapter = (index, field, value) => {
        const newChapters = chapters.map((chapter, i) => {
            if (i === index) {
                return { ...chapter, [field]: value };
            }
            return chapter;
        });
        setChapters(newChapters);
    };

    const moveChapter = (index, direction) => {
        const newChapters = [...editingChapters];
        if (direction === 'up' && index > 0) {
            [newChapters[index], newChapters[index - 1]] = [newChapters[index - 1], newChapters[index]];
            // Update order property
            newChapters[index].order = index + 1;
            newChapters[index - 1].order = index;
        } else if (direction === 'down' && index < newChapters.length - 1) {
            [newChapters[index], newChapters[index + 1]] = [newChapters[index + 1], newChapters[index]];
            // Update order property
            newChapters[index].order = index + 1;
            newChapters[index + 1].order = index + 2;
        }
        setEditingChapters(newChapters);
    };

    const moveExam = (index, direction) => {
        const newExams = [...selectedExams];
        if (direction === 'up' && index > 0) {
            [newExams[index], newExams[index - 1]] = [newExams[index - 1], newExams[index]];
            newExams[index].order = index;
            newExams[index - 1].order = index - 1;
        } else if (direction === 'down' && index < newExams.length - 1) {
            [newExams[index], newExams[index + 1]] = [newExams[index + 1], newExams[index]];
            newExams[index].order = index;
            newExams[index + 1].order = index + 1;
        }
        setSelectedExams(newExams);
    };

    const handleExamSelection = (examId) => {
        const exam = exams.find(ex => ex.id === examId);
        if (!exam) return;

        setSelectedExams(prev => {
            const isAlreadySelected = prev.some(e => e.id === exam.id);
            if (isAlreadySelected) {
                return prev.filter(e => e.id !== exam.id);
            }
            return [...prev, exam];
        });
    };

    const renderEditForm = (course) => (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
            <div className="bg-gray-900 rounded-2xl w-full max-w-7xl border border-white/10 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gray-900 p-4 sm:p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">تعديل الكورس</h3>
                    <button
                        onClick={() => setEditingCourse(null)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg"
                    >
                        <FaTimes className="text-white" />
                    </button>
                </div>

                <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Basic Info Column */}
                        <div className="lg:col-span-4 space-y-4">
                            <h4 className="text-lg font-semibold text-white mb-4">المعلومات الأساسية</h4>
                            <input
                                type="text"
                                value={editingCourse.nameofcourse}
                                onChange={(e) => setEditingCourse({
                                    ...editingCourse,
                                    nameofcourse: e.target.value
                                })}
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                                placeholder="اسم الكورس"
                            />
                            <input
                                type="text"
                                value={editingCourse.nicknameforcourse}
                                onChange={(e) => setEditingCourse({
                                    ...editingCourse,
                                    nicknameforcourse: e.target.value
                                })}
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                                placeholder="كود الكورس"
                            />
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    value={editingCourse.price}
                                    onChange={(e) => setEditingCourse({
                                        ...editingCourse,
                                        price: e.target.value
                                    })}
                                    className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                                    placeholder="السعر"
                                />
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editingCourse.isfree}
                                        onChange={(e) => setEditingCourse({
                                            ...editingCourse,
                                            isfree: e.target.checked
                                        })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 
                                        peer-checked:after:translate-x-full after:content-[''] after:absolute 
                                        after:top-[2px] after:left-[2px] after:bg-white after:rounded-full 
                                        after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                                    </div>
                                    <span className="mr-3 text-sm font-medium text-white">مجاني</span>
                                </label>
                            </div>
                            <textarea
                                value={editingCourse.description}
                                onChange={(e) => setEditingCourse({
                                    ...editingCourse,
                                    description: e.target.value
                                })}
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white h-32"
                                placeholder="وصف الكورس"
                            />
                        </div>

                        {/* Chapters Column */}
                        <div className="lg:col-span-4 lg:border-x border-white/10 lg:px-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-white">الفصول</h4>
                                <button
                                    onClick={() => setEditingChapters([...editingChapters, { nameofchapter: '', linkOfVideo: '' }])}
                                    className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                {editingChapters.map((chapter, index) => (
                                    <div key={index} className="relative bg-white/5 p-4 rounded-lg">
                                        <div className="flex gap-2 mb-2">
                                            <button
                                                onClick={() => moveChapter(index, 'up')}
                                                disabled={index === 0}
                                                className={`p-1 rounded ${index === 0 ? 'text-gray-500' : 'text-blue-400 hover:bg-blue-500/20'}`}
                                            >
                                                <FaArrowUp size={14} />
                                            </button>
                                            <button
                                                onClick={() => moveChapter(index, 'down')}
                                                disabled={index === editingChapters.length - 1}
                                                className={`p-1 rounded ${index === editingChapters.length - 1 ? 'text-gray-500' : 'text-blue-400 hover:bg-blue-500/20'}`}
                                            >
                                                <FaArrowDown size={14} />
                                            </button>
                                            <span className="text-gray-400 text-sm">Chapter {index + 1}</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={chapter.nameofchapter}
                                            onChange={(e) => {
                                                const newChapters = [...editingChapters];
                                                newChapters[index].nameofchapter = e.target.value;
                                                setEditingChapters(newChapters);
                                            }}
                                            className="w-full p-2 bg-white/5 border border-white/10 rounded mb-2 text-white"
                                            placeholder="اسم الفصل"
                                        />
                                        <input
                                            type="text"
                                            value={chapter.linkOfVideo}
                                            onChange={(e) => {
                                                const newChapters = [...editingChapters];
                                                newChapters[index].linkOfVideo = e.target.value;
                                                setEditingChapters(newChapters);
                                            }}
                                            className="w-full p-2 bg-white/5 border border-white/10 rounded text-white"
                                            placeholder="رابط الفيديو"
                                        />
                                        <button
                                            onClick={() => {
                                                const newChapters = editingChapters.filter((_, i) => i !== index);
                                                setEditingChapters(newChapters);
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Exam Column */}
                        <div className="lg:col-span-4">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-white">الامتحانات</h4>
                            </div>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {selectedExams.map((exam, index) => (
                                    <div key={exam.id} className="relative bg-white/5 p-4 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white">{exam.title}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => moveExam(index, 'up')}
                                                    disabled={index === 0}
                                                    className={`p-1 rounded ${index === 0 ? 'text-gray-500' : 'text-blue-400 hover:bg-blue-500/20'}`}
                                                >
                                                    <FaArrowUp size={14} />
                                                </button>
                                                <button
                                                    onClick={() => moveExam(index, 'down')}
                                                    disabled={index === selectedExams.length - 1}
                                                    className={`p-1 rounded ${index === selectedExams.length - 1 ? 'text-gray-500' : 'text-blue-400 hover:bg-blue-500/20'}`}
                                                >
                                                    <FaArrowDown size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleExamSelection(exam.id)}
                                                    className="p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4">
                                    <h5 className="text-white mb-2">Available Exams</h5>
                                    {exams
                                        .filter(exam => !selectedExams.some(selected => selected.id === exam.id))
                                        .map(exam => (
                                            <div
                                                key={exam.id}
                                                onClick={() => handleExamSelection(exam.id)}
                                                className="p-3 bg-white/5 border border-white/10 rounded-lg text-white cursor-pointer hover:bg-white/10 mb-2"
                                            >
                                                {exam.title}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                    <button
                        onClick={() => setEditingCourse(null)}
                        className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
                    >
                        حفظ التغييرات
                    </button>
                </div>
            </div>
        </div>
    );

    // Add error boundary
    if (!courses) {
        return <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
            <p className="text-white">Loading courses...</p>
        </div>;
    }

    const renderCourseChapters = (course) => {
        const chapters = courseChapters[course.nicknameforcourse] || [];
        const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);
        return (
            <div className="flex items-center gap-3 text-gray-300">
                <FaVideo className="text-green-400" />
                <span>{sortedChapters.length} chapters</span>
            </div>
        );
    };

    const renderCourseExams = (course) => (
        <div className="flex items-center gap-3 text-gray-300">
            <FaQuestionCircle className="text-yellow-400" />
            <span>
                {course.exams?.length > 0
                    ? `${course.exams.length} Exams`
                    : 'No exams'
                }
            </span>
        </div>
    );

    // Add new features for course management
    const duplicateCourse = async (course) => {
        try {
            const newCourse = {
                ...course,
                nameofcourse: `نسخة من ${course.nameofcourse}`,
                nicknameforcourse: `${course.nicknameforcourse}-copy-${Date.now()}`,
                chapters: courseChapters[course.nicknameforcourse] || [],
                exams: examOrder.filter(ex => ex.courseNickname === course.nicknameforcourse)
            };

            const result = await GlobalApi.createCourse(newCourse);
            if (result?.createCourse?.id) {
                toast.success('تم نسخ الكورس بنجاح');
                fetchCourses();
            }
        } catch (error) {
            toast.error('فشل نسخ الكورس');
        }
    };

     

    // Add this to your course card rendering
    const renderCourseActions = (course) => (
        <div className="flex gap-2">
            <button
                onClick={() => handleEdit(course)}
                className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20"
            >
                <FaEdit />
            </button>
            <button
                onClick={() => duplicateCourse(course)}
                className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20"
                title="نسخ الكورس"
            >
                <FaCopy />
            </button>
             
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-3 sm:p-6">
            {/* Dashboard Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        إدارة الكورسات
                    </h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 
                        text-white rounded-lg transition-all shadow-lg hover:shadow-indigo-500/20"
                    >
                        <FaPlus className="text-sm" /> إضافة كورس جديد
                    </button>
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        // Show skeletons while loading
                        [...Array(6)].map((_, index) => (
                            <motion.div
                                key={`skeleton-${index}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <CourseSkeleton />
                            </motion.div>
                        ))
                    ) : (
                        courses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                {/* Your existing course card content */}
                                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow-xl 
                                    border border-white/10 hover:border-white/20 transition-all">
                                    {/* ...existing course card content... */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">
                                                {course.nameofcourse}
                                            </h3>
                                            <p className="text-gray-400 text-sm">
                                                {course.nicknameforcourse}
                                            </p>
                                        </div>
                                        {renderCourseActions(course)}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <FaBook className="text-indigo-400" />
                                            <span>{course.description || 'No description'}</span>
                                        </div>
                                        {renderCourseChapters(course)}
                                        {renderCourseExams(course)}
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <span className="text-2xl font-bold text-white">
                                            {course.price} جنيه
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm ${course.isfree ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {course.isfree ? 'مجاني' : 'مدفوع'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Edit Modal */}
            {editingCourse && renderEditForm()}

            {/* Add Course Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
                    <div className="bg-gray-900 rounded-2xl w-full max-w-7xl border border-white/10 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gray-900 p-4 sm:p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-xl sm:text-2xl font-bold text-white">إضافة كورس جديد</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg"
                            >
                                <FaTimes className="text-white" />
                            </button>
                        </div>

                        <div className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {/* Left Column - Basic Info */}
                                <div className="lg:col-span-4 space-y-4">
                                    <h4 className="text-lg font-semibold text-white mb-4">المعلومات الأساسية</h4>
                                    <input
                                        type="text"
                                        placeholder="اسم الكورس"
                                        value={newCourse.nameofcourse}
                                        onChange={(e) => setNewCourse({ ...newCourse, nameofcourse: e.target.value })}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                                    />
                                    <input
                                        type="text"
                                        placeholder="كود الكورس"
                                        value={newCourse.nicknameforcourse}
                                        onChange={(e) => setNewCourse({ ...newCourse, nicknameforcourse: e.target.value })}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                                    />
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            placeholder="السعر"
                                            value={newCourse.price}
                                            onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                                            className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                                        />
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newCourse.isfree}
                                                onChange={(e) => setNewCourse({ ...newCourse, isfree: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 
                                                peer-checked:after:translate-x-full after:content-[''] after:absolute 
                                                after:top-[2px] after:left-[2px] after:bg-white after:rounded-full 
                                                after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="mr-3 text-sm font-medium text-white">مجاني</span>
                                        </label>
                                    </div>
                                    <textarea
                                        placeholder="وصف الكورس"
                                        value={newCourse.description}
                                        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white h-32"
                                    />
                                </div>

                                {/* Middle Column - Chapters */}
                                <div className="lg:col-span-4 lg:border-x border-white/10 lg:px-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-semibold text-white">الفصول</h4>
                                        <button
                                            onClick={addChapter}
                                            className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30"
                                        >
                                            <FaPlus /> إضافة فصل
                                        </button>
                                    </div>
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                        {chapters.map((chapter, index) => (
                                            <div key={index} className="relative bg-white/5 p-4 rounded-lg">
                                                <input
                                                    type="text"
                                                    placeholder="اسم الفصل"
                                                    value={chapter.nameofchapter}
                                                    onChange={(e) => updateChapter(index, 'nameofchapter', e.target.value)}
                                                    className="w-full p-2 bg-white/5 border border-white/10 rounded mb-2 text-white"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="رابط الفيديو"
                                                    value={chapter.linkOfVideo}
                                                    onChange={(e) => updateChapter(index, 'linkOfVideo', e.target.value)}
                                                    className="w-full p-2 bg-white/5 border border-white/10 rounded text-white"
                                                />
                                                {chapters.length > 1 && (
                                                    <button
                                                        onClick={() => removeChapter(index)}
                                                        className="absolute top-2 right-2 p-1 bg-red-500/20 text-red-400 
                                                        rounded hover:bg-red-500/30"
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Column - Exam */}
                                <div className="lg:col-span-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-semibold text-white">الامتحانات</h4>
                                        <button
                                            onClick={() => setShowExamModal(true)}
                                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                                        >
                                            <FaPlus /> إنشاء امتحان جديد
                                        </button>
                                    </div>
                                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                        {exams.map(exam => (
                                            <label key={exam.id} className="flex items-center space-x-3 p-3 bg-white/5 
                                                border border-white/10 rounded-lg text-white cursor-pointer hover:bg-white/10">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedExams.some(e => e.id === exam.id)}
                                                    onChange={() => handleExamSelection(exam.id)}
                                                    className="form-checkbox h-5 w-5 text-indigo-600"
                                                />
                                                <span>{exam.title}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full sm:w-auto px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white 
                                rounded-lg transition-all"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleAddCourse}
                                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 
                                text-white rounded-lg transition-all"
                            >
                                إضافة الكورس
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseManager;

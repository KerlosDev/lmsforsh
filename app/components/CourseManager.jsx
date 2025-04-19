'use client';
import React, { useState, useEffect } from 'react';
import GlobalApi from '../api/GlobalApi';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaBook, FaVideo, FaQuestionCircle, FaArrowUp, FaArrowDown, FaCopy, FaArchive, FaBookmark, FaDownload, FaUpload, FaCloudUploadAlt } from 'react-icons/fa';
import { HiOutlineChartBar, HiOutlineClock, HiOutlineUserGroup } from 'react-icons/hi';
import { toast } from 'react-toastify';
import CourseSkeleton from './CourseSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

const CourseManager = () => {
    // Add new state for sorting
    const [sortBy, setSortBy] = useState('newest');

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
        isDraft: false,  // Add this line
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
    const [filterState, setFilterState] = useState('all'); // 'all', 'published', 'draft'

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
                exam: course.exam?.[0] || null,
                isDraft: course.isDraft || false // Ensure isDraft is included with default value
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
                isDraft: Boolean(editingCourse.isDraft), // Ensure isDraft is included
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
                isDraft: newCourse.isDraft, // Add this line
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
            isDraft: false, // Add this line
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

    // Update the filteredCourses function to include sorting
    const filteredCourses = () => {
        let filtered = [...courses]; // Create a copy to avoid mutating original array

        // Apply filters
        switch (filterState) {
            case 'published':
                filtered = filtered.filter(course => !course.isDraft);
                break;
            case 'draft':
                filtered = filtered.filter(course => course.isDraft);
                break;
            default:
                break;
        }

        // Apply sorting
        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.dataofcourse) - new Date(a.dataofcourse));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.dataofcourse) - new Date(b.dataofcourse));
                break;
            case 'name':
                filtered.sort((a, b) => a.nameofcourse.localeCompare(b.nameofcourse));
                break;
            default:
                break;
        }

        return filtered;
    };

    const handleDownloadJson = async () => {
        try {
            const coursesData = {
                courses: courses,
                chapters: courseChapters,
                exams: examOrder
            };
            const jsonData = JSON.stringify(coursesData, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `courses-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success('تم تحميل النسخة الاحتياطية بنجاح');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('حدث خطأ أثناء تحميل الملف');
        }
    };

    const handleUploadJson = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const jsonData = JSON.parse(text);

            // Validate data structure
            if (!jsonData.courses || !Array.isArray(jsonData.courses)) {
                throw new Error('Invalid JSON format: missing courses array');
            }

            // Update state with new data
            setCourses(jsonData.courses);
            if (jsonData.chapters) {
                setCourseChapters(jsonData.chapters);
            }
            if (jsonData.exams) {
                setExamOrder(jsonData.exams);
            }

            // Save to backend
            await GlobalApi.updateAllCourses(jsonData);
            
            toast.success('تم تحديث البيانات بنجاح');
            await fetchCourses(); // Refresh data
            await fetchAllChapters();
            await fetchExamOrders();
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('حدث خطأ في تنسيق الملف أو تحميله');
        }
        
        // Reset file input
        event.target.value = '';
    };

    const renderEditForm = (course) => (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-7xl 
                border border-white/10 shadow-2xl my-4 max-h-[85vh] overflow-y-auto relative">
                {/* Header - Make it more compact */}
                <div className="sticky top-0 backdrop-blur-xl bg-gray-900/80 p-4 border-b border-white/10 
                    flex justify-between items-center z-10">
                    <h3 className="text-xl font-arabicUI3 text-white flex items-center gap-3">
                        <FaEdit className="text-blue-400" />
                        تعديل الكورس
                    </h3>
                    <button
                        onClick={() => setEditingCourse(null)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <FaTimes className="text-white" />
                    </button>
                </div>

                {/* Form Content - Reduce padding */}
                <div className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        
                        {/* Rest of the form structure remains the same */}
                        <div className="lg:col-span-4 space-y-4">
                            <h4 className="text-lg font-arabicUI3 text-white/90 flex items-center gap-2 mb-6">
                                <FaBook className="text-blue-400" />
                                المعلومات الأساسية
                            </h4>
                            {/* Add draft toggle before other inputs */}
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/10 
                                to-yellow-600/10 rounded-xl border border-yellow-500/20">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-yellow-500/20">
                                        <FaArchive className="text-yellow-400 text-lg" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">وضع المسودة</h4>
                                        <p className="text-gray-400 text-sm">الكورس غير مرئي للطلاب</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editingCourse.isDraft}
                                        onChange={(e) => setEditingCourse({
                                            ...editingCourse,
                                            isDraft: e.target.checked
                                        })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none 
                                        rounded-full peer peer-checked:after:translate-x-full 
                                        after:content-[''] after:absolute after:top-0.5 after:left-[4px] 
                                        after:bg-white after:rounded-full after:h-6 after:w-6 
                                        after:transition-all peer-checked:bg-yellow-500">
                                    </div>
                                </label>
                            </div>
                            {/* Continue with existing inputs */}
                            <input
                                type="text"
                                value={editingCourse.nameofcourse}
                                onChange={(e) => setEditingCourse({
                                    ...editingCourse,
                                    nameofcourse: e.target.value
                                })}
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white
                                    focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                placeholder="اسم الكورس"
                            />
                            <input
                                type="text"
                                value={editingCourse.nicknameforcourse}
                                onChange={(e) => setEditingCourse({
                                    ...editingCourse,
                                    nicknameforcourse: e.target.value
                                })}
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white
                                    focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                placeholder="كود الكورس"
                            />
                            <div className="flex flex-col gap-4">
                                {/* Free course toggle - Full width */}
                                <div className="flex items-center justify-between p-4 w-full bg-gradient-to-r from-blue-500/10 
                                    to-blue-600/10 rounded-xl border border-blue-500/20">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-500/20">
                                            <FaBookmark className="text-blue-400 text-lg" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium">كورس مجاني</h4>
                                            <p className="text-gray-400 text-sm">يمكن للطلاب الوصول مجاناً</p>
                                        </div>
                                    </div>
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
                                        <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none 
                                            rounded-full peer peer-checked:after:translate-x-full 
                                            after:content-[''] after:absolute after:top-0.5 after:left-[4px] 
                                            after:bg-white after:rounded-full after:h-6 after:w-6 
                                            after:transition-all peer-checked:bg-blue-500">
                                        </div>
                                    </label>
                                </div>

                                {/* Price input on new line - Show only if not free */}
                                {!editingCourse.isfree && (
                                    <div className="relative w-full">
                                        <input
                                            type="number"
                                            value={editingCourse.price}
                                            onChange={(e) => setEditingCourse({
                                                ...editingCourse,
                                                price: e.target.value
                                            })}
                                            className="w-full p-3 pl-16 bg-white/5 border border-white/10 rounded-xl text-white
                                                focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="السعر"
                                        />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            جنيه
                                        </span>
                                    </div>
                                )}
                            </div>
                            <textarea
                                value={editingCourse.description}
                                onChange={(e) => setEditingCourse({
                                    ...editingCourse,
                                    description: e.target.value
                                })}
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white
                                    focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all h-32"
                                placeholder="وصف الكورس"
                            />
                            {/* Add this toggle for draft status */}
                            
                        </div>

                        {/* Chapters Column */}
                        <div className="lg:col-span-4 lg:border-x border-white/10 lg:px-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-arabicUI3 text-white">الفصول</h4>
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
                                <h4 className="text-lg font-arabicUI3 text-white">الامتحانات</h4>
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

                {/* Footer - Make it more compact */}
                <div className="sticky bottom-0 backdrop-blur-xl bg-gray-900/80 p-4 border-t border-white/10 
                    flex justify-end gap-3 z-10">
                    <button
                        onClick={() => setEditingCourse(null)}
                        className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl 
                            transition-all duration-300"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 
                            hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl 
                            transition-all duration-300 flex items-center gap-2"
                    >
                        <FaSave />
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

    const renderCourseStatus = (course) => (
        <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2
                ${course.isDraft ?
                    'bg-yellow-500/10 text-yellow-400 border border-yellow-400/20' :
                    'bg-green-500/10 text-green-400 border border-green-400/20'}`}>
                <span className={`w-2 h-2 rounded-full ${course.isDraft ? 'bg-yellow-400' : 'bg-green-400'} animate-pulse`}></span>
                {course.isDraft ? 'مسودة' : 'منشور'}
            </div>
        </div>
    );

    const renderCourseStats = (course) => (
        <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex flex-col items-center p-2 bg-white/5 rounded-lg">
                <HiOutlineUserGroup className="text-blue-400 text-xl mb-1" />
                <span className="text-xs text-gray-400">0 طالب</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-white/5 rounded-lg">
                <HiOutlineClock className="text-purple-400 text-xl mb-1" />
                <span className="text-xs text-gray-400">
                    {courseChapters[course.nicknameforcourse]?.length || 0} فصول
                </span>
            </div>
            <div className="flex flex-col items-center p-2 bg-white/5 rounded-lg">
                <HiOutlineChartBar className="text-emerald-400 text-xl mb-1" />
                <span className="text-xs text-gray-400">
                    {course.exams?.length || 0} امتحانات
                </span>
            </div>
        </div>
    );

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

    const renderCourseCard = (course) => (
        <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-xl 
    rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2
    hover:shadow-blue-500/30 border border-white/10 hover:border-blue-500/50">
            {/* Course Header Image & Overlay */}
            <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 z-10 
                group-hover:from-black/50 group-hover:to-black/80 transition-all duration-500" />
                <div className="absolute inset-0 bg-grid-white/[0.02] z-10" />
                <img
                    src={course.imageUrl || "/chbg.jpg"}
                    alt={course.nameofcourse}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 transform-gpu"
                />

                {/* Course Status with enhanced hover */}
                <div className="absolute top-4 left-4 z-20 transform group-hover:-translate-x-1 transition-transform duration-300">
                    <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2
                    backdrop-blur-md shadow-lg border transition-colors duration-300
                    ${course.isDraft ?
                            'bg-yellow-500/20 text-yellow-300 border-yellow-400/30 group-hover:bg-yellow-500/30' :
                            'bg-emerald-500/20 text-emerald-300 border-emerald-400/30 group-hover:bg-emerald-500/30'}`}>
                        <span className={`w-2 h-2 rounded-full ${course.isDraft ? 'bg-yellow-400' : 'bg-emerald-400'} animate-pulse`}></span>
                        {course.isDraft ? 'مسودة' : 'منشور'}
                    </div>
                </div>

                {/* Price Badge with enhanced hover */}
                {!course.isfree && (
                    <div className="absolute top-4 right-4 z-20 transform group-hover:translate-x-1 transition-transform duration-300">
                        <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r 
                        from-amber-500/90 to-amber-600/90 text-white shadow-lg backdrop-blur-sm border border-amber-400/30
                        group-hover:from-amber-600/90 group-hover:to-amber-700/90 transition-all duration-300
                        flex items-center gap-2">
                            <FaBookmark className="text-amber-200" size={12} />
                            <span className="font-arabicUI3">{course.price} جنيه</span>
                        </div>
                    </div>
                )}

                {/* Course Stats Overlay with enhanced hover */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between transform translate-y-0 
                group-hover:translate-y-1 transition-transform duration-300">
                    <div className="flex gap-2">
                        <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md
                        text-white border border-white/20 group-hover:bg-white/20 transition-colors duration-300
                        flex items-center gap-2">
                            <FaVideo className="text-blue-400" size={12} />
                            <span>{courseChapters[course.nicknameforcourse]?.length || 0} فصول</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md
                        text-white border border-white/20 group-hover:bg-white/20 transition-colors duration-300
                        flex items-center gap-2">
                            <FaQuestionCircle className="text-purple-400" size={12} />
                            <span>{course.exams?.length || 0} امتحانات</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Content with enhanced hover */}
            <div className="p-6 relative">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 
                opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

                <h3 className="text-xl font-arabicUI3 text-white mb-2 group-hover:text-blue-400 transition-colors 
                duration-300 line-clamp-1">
                    {course.nameofcourse}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-6 font-light group-hover:text-gray-300 
                transition-colors duration-300">
                    {course.description || 'No description available'}
                </p>

                {/* Action Buttons with enhanced hover */}
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => handleEdit(course)}
                        className="flex-1 py-2 px-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 
                        rounded-lg transition-all duration-300 flex items-center justify-center gap-2
                        hover:shadow-lg hover:shadow-blue-500/10 transform hover:-translate-y-0.5"
                    >
                        <FaEdit size={14} />
                        <span>تعديل</span>
                    </button>
                    <button
                        onClick={() => duplicateCourse(course)}
                        className="flex-1 py-2 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 
                        rounded-lg transition-all duration-300 flex items-center justify-center gap-2
                        hover:shadow-lg hover:shadow-emerald-500/10 transform hover:-translate-y-0.5"
                    >
                        <FaCopy size={14} />
                        <span>نسخ</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen font-arabicUI3 bg-gradient-to-br from-gray-900 rounded-xl via-gray-800 to-gray-900 p-6">
            {/* Enhanced Dashboard Header */}
            <div className="max-w-7xl mx-auto mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
                >
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-grid-white/[0.02] -z-1"></div>
                    <div className="absolute inset-y-0 right-0 w-[300px] bg-gradient-to-l from-blue-500/10 via-transparent to-transparent"></div>

                    <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div className="space-y-3">
                            <h1 className="text-4xl font-arabicUI3 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                إدارة الكورسات
                            </h1>
                            <p className="text-lg text-gray-400 max-w-2xl">
                                إدارة وتنظيم الكورسات التعليمية بكل سهولة
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsModalOpen(true)}
                            className="relative group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 
                                rounded-xl text-white font-medium shadow-lg hover:shadow-blue-500/25 
                                transition-all duration-300"
                        >
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 
                                animate-pulse group-hover:opacity-0 transition-opacity"></div>
                            <span className="flex items-center gap-3 text-lg">
                                <FaPlus className="text-blue-200" />
                                <span className="font-arabicUI3">إضافة كورس جديد</span>
                            </span>
                        </motion.button>
                    </div>

                    {/* Enhanced Course Statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                        {[
                            {
                                label: 'إجمالي الكورسات',
                                value: courses.length,
                                icon: FaBook,
                                color: 'from-blue-600/20 to-blue-400/20',
                                iconColor: 'text-blue-400',
                                borderColor: 'border-blue-500/20'
                            },
                            {
                                label: 'الكورسات المنشورة',
                                value: courses.filter(c => !c.isDraft).length,
                                icon: FaVideo,
                                color: 'from-green-600/20 to-green-400/20',
                                iconColor: 'text-green-400',
                                borderColor: 'border-green-500/20'
                            },
                            {
                                label: 'المسودات',
                                value: courses.filter(c => c.isDraft).length,
                                icon: FaEdit,
                                color: 'from-yellow-600/20 to-yellow-400/20',
                                iconColor: 'text-yellow-400',
                                borderColor: 'border-yellow-500/20'
                            },
                            {
                                label: 'الكورسات المجانية',
                                value: courses.filter(c => c.isfree).length,
                                icon: FaBookmark,
                                color: 'from-purple-600/20 to-purple-400/20',
                                iconColor: 'text-purple-400',
                                borderColor: 'border-purple-500/20'
                            }
                        ].map((stat, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={index}
                                className={`relative overflow-hidden bg-gradient-to-br ${stat.color} 
                                    backdrop-blur-xl rounded-xl p-6 border ${stat.borderColor}
                                    hover:shadow-lg hover:shadow-white/5 transition-all duration-300`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg bg-white/5 ${stat.iconColor}`}>
                                        <stat.icon className="text-2xl" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                                        <h3 className="text-3xl font-arabicUI3 text-white mt-1">
                                            {stat.value}
                                        </h3>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 transform translate-x-2 translate-y-2">
                                    <stat.icon className={`text-8xl opacity-10 ${stat.iconColor}`} />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Add this filter bar after the stats section */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-8 gap-4">
                        <div className="flex items-center gap-4 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                            <button
                                onClick={() => setFilterState('all')}
                                className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap
                                    ${filterState === 'all'
                                        ? 'bg-white/10 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                كل الكورسات ({courses.length})
                            </button>
                            <button
                                onClick={() => setFilterState('published')}
                                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap
                                    ${filterState === 'published'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                منشور ({courses.filter(c => !c.isDraft).length})
                            </button>
                            <button
                                onClick={() => setFilterState('draft')}
                                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap
                                    ${filterState === 'draft'
                                        ? 'bg-yellow-500/20 text-yellow-400'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                                مسودة ({courses.filter(c => c.isDraft).length})
                            </button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="whitespace-nowrap">ترتيب حسب:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white
                                    focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            >
                                <option value="newest">الأحدث</option>
                                <option value="oldest">الأقدم</option>
                                <option value="name">الإسم</option>
                            </select>
                        </div>
                    </div>

                 
                </motion.div>

                <div className="flex flex-wrap gap-4 mt-8 border-t border-white/10 pt-8">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
                                rounded-xl text-white flex items-center gap-2"
                        >
                            <FaPlus className="text-blue-200" />
                            <span>إضافة كورس</span>
                        </motion.button>

                        <button  
                            onClick={handleDownloadJson}
                            className="px-6 py-3 bg-gradient-to-r hover:scale-105 from-green-600/20 to-green-700/20 
                                rounded-xl text-green-400 flex items-center gap-2 border border-green-500/20"
                        >
                            <FaDownload />
                            <span>تحميل JSON</span>
                        </button>

                       
                    </div>
                
            </div>
            {/* ... rest of the existing code ... */}
            {/* Course Grid with enhanced animation */}
            <div className="max-w-7xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                        filteredCourses().map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                {renderCourseCard(course)}
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
                    <div className="bg-gray-900 rounded-2xl w-full max-w-7xl border border-white/10 shadow-2xl my-8 max-h-[85vh] overflow-y-auto">

                        <div className="sticky top-0 bg-gray-900 p-4 sm:p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-xl sm:text-2xl font-arabicUI3 text-white">إضافة كورس جديد</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 bg-white/5 hover:bg.white/10 rounded-lg"
                            >
                                <FaTimes className="text-white" />
                            </button>
                        </div>

                        <div className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                                {/* Left Column - Basic Info */}
                                <div className="lg:col-span-4 space-y-4">
                                    <h4 className="text-lg font-arabicUI3 text-white mb-4">المعلومات الأساسية</h4>
                                   
                                   
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/10 
                                to-yellow-600/10 rounded-xl border border-yellow-500/20">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-yellow-500/20">
                                            <FaArchive className="text-yellow-400 text-lg" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium">وضع المسودة</h4>
                                            <p className="text-gray-400 text-sm">الكورس غير مرئي للطلاب</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newCourse.isDraft}
                                            onChange={(e) => setNewCourse({ ...newCourse, isDraft: e.target.checked })}

                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none 
                                        rounded-full peer peer-checked:after:translate-x-full 
                                        after:content-[''] after:absolute after:top-0.5 after:left-[4px] 
                                        after:bg-white after:rounded-full after:h-6 after:w-6 
                                        after:transition-all peer-checked:bg-yellow-500">
                                        </div>
                                    </label>
                                </div>
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
                                    <div className="flex flex-col gap-4">
                                        {/* Free course toggle - Full width */}
                                        <div className="flex items-center justify-between p-4 w-full bg-gradient-to-r from-blue-500/10 
                                            to-blue-600/10 rounded-xl border border-blue-500/20">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-500/20">
                                                    <FaBookmark className="text-blue-400 text-lg" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium">كورس مجاني</h4>
                                                    <p className="text-gray-400 text-sm">يمكن للطلاب الوصول مجاناً</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={newCourse.isfree}
                                                    onChange={(e) => setNewCourse({ ...newCourse, isfree: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none 
                                                    rounded-full peer peer-checked:after:translate-x-full 
                                                    after:content-[''] after:absolute after:top-0.5 after:left-[4px] 
                                                    after:bg-white after:rounded-full after:h-6 after:w-6 
                                                    after:transition-all peer-checked:bg-blue-500">
                                                </div>
                                            </label>
                                        </div>

                                        {/* Price input on new line - Show only if not free */}
                                        {!newCourse.isfree && (
                                            <div className="relative w-full">
                                                <input
                                                    type="number"
                                                    placeholder="السعر"
                                                    value={newCourse.price}
                                                    onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                                                    className="w-full p-3 pl-16 bg-white/5 border border-white/10 rounded-xl text-white
                                                        focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                />
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                    جنيه
                                                </span>
                                            </div>
                                        )}
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
                                        <h4 className="text-lg font-arabicUI3 text-white">الفصول</h4>
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
                                        <h4 className="text-lg font-arabicUI3 text-white">الامتحانات</h4>
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

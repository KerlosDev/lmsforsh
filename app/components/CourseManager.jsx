'use client';
import React, { useState, useEffect } from 'react';
import GlobalApi from '../api/GlobalApi';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import CourseSkeleton from './CourseSkeleton';
import CourseStats from './course-manager/CourseStats';
import CourseFilters from './course-manager/CourseFilters';
import CourseCard from './course-manager/CourseCard';
import CourseEditForm from './course-manager/CourseEditForm';
import CourseAddModal from './course-manager/CourseAddModal';
import CourseActionsToolbar from './course-manager/CourseActionsToolbar';
import DashboardHeader from './course-manager/DashboardHeader';

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

    // Filter and sort courses
    const filteredCourses = () => {
        let filtered = [...courses];

        switch (filterState) {
            case 'published':
                filtered = filtered.filter(course => !course.isDraft);
                break;
            case 'draft':
                filtered = filtered.filter(course => course.isDraft);
                break;
        }

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
    
        setIsLoading(true); // Show loading state
    
        try {
            const text = await file.text();
            const jsonData = JSON.parse(text);
    
            // Validate data structure
            if (!jsonData.courses || !Array.isArray(jsonData.courses)) {
                throw new Error('Invalid JSON format: missing courses array');
            }
    
            // Process each course one by one
            for (const course of jsonData.courses) {
                // Generate unique nickname by appending timestamp
                const timestamp = Date.now();
                const uniqueNickname = `${course.nicknameforcourse}-${timestamp}`;
                
                // Get chapters for this course from the chapters object
                const courseChapters = jsonData.chapters[course.nicknameforcourse] || [];
                
                // Get exams for this course
                const courseExams = jsonData.exams?.filter(exam => 
                    exam.courseNickname === course.nicknameforcourse
                ) || [];
    
                // Prepare course data with unique nickname
                const courseData = {
                    ...course,
                    nicknameforcourse: uniqueNickname, // Use unique nickname
                    isDraft: course.isDraft || false,
                    price: Number(course.price) || 0,
                    isfree: Boolean(course.isfree),
                    dataofcourse: course.dataofcourse || new Date().toISOString().split('T')[0],
                    chapters: courseChapters.map(chapter => ({
                        nameofchapter: chapter.nameofchapter,
                        linkOfVideo: chapter.linkOfVideo,
                        order: chapter.order
                    })),
                    exams: courseExams
                };
    
                // Create the course
                try {
                    const result = await GlobalApi.createCourse(courseData);
                    
                    if (result?.createCourse?.id) {
                        // Update chapters and exams after course creation
                        await Promise.all([
                            GlobalApi.updateCourseChapters(
                                uniqueNickname, // Use unique nickname here too
                                courseData.chapters
                            ),
                            GlobalApi.updateCourseExams(
                                uniqueNickname, // And here
                                courseData.exams
                            )
                        ]);
                    }
                } catch (error) {
                    console.error(`Failed to create course: ${courseData.nameofcourse}`, error);
                    // Continue with next course even if one fails
                    continue;
                }
            }
    
            toast.success('تم تحديث البيانات بنجاح');
            
            // Refresh all data
            await Promise.all([
                fetchCourses(),
                fetchAllChapters(),
                fetchExamOrders(),
                fetchExams()
            ]);
    
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('حدث خطأ في تنسيق الملف أو تحميله');
        } finally {
            setIsLoading(false);
            // Reset file input
            event.target.value = '';
        }
    };

    return (
        <div className="min-h-screen font-arabicUI3 bg-gradient-to-br from-gray-900 rounded-xl via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <DashboardHeader onAddCourse={() => setIsModalOpen(true)} />
                
                <CourseStats courses={courses} />
                
                <CourseActionsToolbar 
                    onDownload={handleDownloadJson}
                    onUpload={handleUploadJson}
                    onAddCourse={() => setIsModalOpen(true)}
                />
                
                <CourseFilters
                    filterState={filterState}
                    setFilterState={setFilterState}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    courses={courses}
                />

                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            [...Array(6)].map((_, index) => (
                                <motion.div key={`skeleton-${index}`}
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
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    index={index}
                                    onEdit={() => handleEdit(course)}
                                    onDuplicate={() => duplicateCourse(course)}
                                    chapters={courseChapters[course.nicknameforcourse]}
                                />
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {editingCourse && (
                <CourseEditForm
                    course={editingCourse}
                    chapters={editingChapters}
                    selectedExams={selectedExams}
                    exams={exams}
                    onClose={() => setEditingCourse(null)}
                    onSave={handleSave}
                    onUpdateChapters={setEditingChapters}
                    onUpdateExams={setSelectedExams}
                />
            )}

            {isModalOpen && (
                <CourseAddModal
                    onClose={() => setIsModalOpen(false)}
                    onAdd={handleAddCourse}
                    chapters={chapters}
                    exams={exams}
                    selectedExams={selectedExams}
                    onUpdateChapters={setChapters}
                    onExamSelect={handleExamSelection}
                    newCourse={newCourse}
                    onUpdateNewCourse={setNewCourse}
                />
            )}
        </div>
    );
};

export default CourseManager;

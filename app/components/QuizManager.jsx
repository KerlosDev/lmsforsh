'use client';
import React, { useState, useEffect } from 'react';
import GlobalApi from '../api/GlobalApi';
import { BiImageAdd, BiTrash, BiShow } from 'react-icons/bi';
import { FaSpinner } from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'react-toastify';

const QuizManager = ({ initialData, onCancel, onComplete, isEditing }) => {
    const [quizData, setQuizData] = useState(initialData || {
        title: '',
        questions: [
            {
                qus: '',
                imageUrl: '',
                opationA: '',
                opationB: '',
                opationC: '',
                opationD: '',
                trueChoisevip: '',
                score: 1
            }
        ]
    });

    const [courses, setCourses] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [questionType, setQuestionType] = useState('multiple'); // or 'truefalse'

    const categories = [
        { id: 'organic', name: 'كيمياء عضوية' },
        { id: 'inorganic', name: 'كيمياء غير عضوية' },
        { id: 'analytical', name: 'كيمياء تحليلية' }
    ];

    useEffect(() => {
        // Fetch courses for dropdown
        GlobalApi.getAllCourseList().then(res => {
            setCourses(res.courses);
        });
    }, []);

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...quizData.questions];
        if (field === 'trueChoisevip' && !value) {
            // Don't update if no value selected
            return;
        }
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            [field]: value
        };
        setQuizData({
            ...quizData,
            questions: updatedQuestions
        });
    };

    const addQuestion = () => {
        setQuizData({
            ...quizData,
            questions: [...quizData.questions, {
                qus: '',
                imageUrl: '',
                opationA: '',
                opationB: '',
                opationC: '',
                opationD: '',
                trueChoisevip: '',
                score: 1
            }]
        });
    };

    const removeQuestion = (index) => {
        const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
        setQuizData({
            ...quizData,
            questions: updatedQuestions
        });
    };

    const validateQuiz = () => {
        if (!quizData.title) {
            toast.error('الرجاء إدخال عنوان الاختبار');
            return false;
        }
       
        if (!quizData.questions.length) {
            toast.error('الرجاء إضافة سؤال واحد على الأقل');
            return false;
        }

        for (let i = 0; i < quizData.questions.length; i++) {
            const q = quizData.questions[i];
            if (!q.qus || !q.trueChoisevip ||
                !q.opationA || !q.opationB ||
                (questionType === 'multiple' && (!q.opationC || !q.opationD))) {
                toast.error(`الرجاء إكمال جميع حقول السؤال ${i + 1}`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateQuiz()) return;

        setIsLoading(true);
        try {
            const formattedQuiz = {
                title: quizData.title, 
                questionType: questionType,
                questions: quizData.questions.map(q => ({
                    ...q,
                    score: q.score || 1 // Default score
                }))
            };

            const jsonString = JSON.stringify(formattedQuiz);

            if (isEditing) {
                await GlobalApi.updateExam(initialData.id, quizData.title, jsonString);
                toast.success('تم تحديث الاختبار بنجاح!');
                onComplete?.();
            } else {
                await GlobalApi.sendquiz(quizData.title, jsonString);
                toast.success('تم إنشاء الاختبار بنجاح!');
                resetForm();
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'حدث خطأ أثناء حفظ الاختبار');
        }
        setIsLoading(false);
    };

    const resetForm = () => {
        setQuizData({
            title: '',
            questions: [{
                qus: '',
                imageUrl: '',
                opationA: '',
                opationB: '',
                opationC: '',
                opationD: '',
                trueChoisevip: '',
                score: 1
            }]
        }); 
        
        setQuestionType('multiple');
    };

    return (
        <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-arabicUI3 text-white">
                    {isEditing ? 'تعديل الاختبار' : 'إضافة اختبار جديد'}
                </h2>
                {isEditing && (
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        رجوع
                    </button>
                )}
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        value={quizData.title}
                        onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                        placeholder="عنوان الاختبار"
                        className="p-3 rounded-lg bg-white/5 border border-white/20 text-white"
                    />
                    
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => setQuestionType('multiple')}
                        className={`px-4 py-2 rounded-lg ${questionType === 'multiple'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/5 text-white/70'
                            }`}
                    >
                        اختيار متعدد
                    </button>
                    <button
                        onClick={() => setQuestionType('truefalse')}
                        className={`px-4 py-2 rounded-lg ${questionType === 'truefalse'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/5 text-white/70'
                            }`}
                    >
                        صح وخطأ
                    </button>
                    <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30"
                    >
                        {previewMode ? 'تعديل' : 'معاينة'} <BiShow className="inline ml-2" />
                    </button>
                </div>

                {quizData.questions.map((question, index) => (
                    <div key={index} className="p-6 bg-white/5 rounded-xl space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl text-white font-arabicUI3">السؤال {index + 1}</h3>
                            <button
                                onClick={() => removeQuestion(index)}
                                className="text-red-500 hover:text-red-400"
                            >
                                <BiTrash size={24} />
                            </button>
                        </div>

                        <input
                            type="text"
                            value={question.qus}
                            onChange={(e) => handleQuestionChange(index, 'qus', e.target.value)}
                            placeholder="نص السؤال"
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            {['A', 'B', 'C', 'D'].map((option) => (
                                questionType === 'multiple' || option === 'A' || option === 'B' ? (
                                    <div key={option} className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={question[`opation${option}`]}
                                            onChange={(e) => handleQuestionChange(index, `opation${option}`, e.target.value)}
                                            placeholder={`الاختيار ${option}`}
                                            className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white"
                                        />
                                        <input
                                            type="radio"
                                            name={`correct-answer-${index}`} // Add name to group radio buttons
                                            checked={question.trueChoisevip === option}
                                            onChange={() => handleQuestionChange(index, 'trueChoisevip', option)}
                                            className="ml-2 cursor-pointer w-4 h-4"
                                            required // Make selection required
                                        />
                                    </div>
                                ) : null
                            ))}
                        </div>

                        <div className="flex items-center space-x-4">
                            <input
                                type="url"
                                value={question.imageUrl || ''}
                                onChange={(e) => handleQuestionChange(index, 'imageUrl', e.target.value)}
                                placeholder="رابط الصورة (اختياري)"
                                className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white"
                            />
                            {question.imageUrl && (
                                <div className="relative w-20 h-20">
                                    <Image
                                        src={question.imageUrl}
                                        alt="Question image"
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {previewMode ? (
                    <div className="space-y-4">
                        <h3 className="text-2xl text-white mb-4">{quizData.title}</h3>
                        {quizData.questions.map((q, i) => (
                            <div key={i} className="bg-white/5 p-4 rounded-lg">
                                <p className="text-white mb-2">س{i + 1}: {q.qus}</p>
                                {q.imageUrl && (
                                    <Image
                                        src={q.imageUrl}
                                        alt="Question image"
                                        width={200}
                                        height={200}
                                        className="mb-2 rounded"
                                    />
                                )}
                                <div className="grid grid-cols-2 gap-2">
                                    {['A', 'B', 'C', 'D'].map(option => (
                                        questionType === 'multiple' || option === 'A' || option === 'B' ? (
                                            <div
                                                key={option}
                                                className={`p-2 rounded ${q.trueChoisevip === option
                                                    ? 'bg-green-500/20 text-green-300'
                                                    : 'bg-white/10 text-white/70'
                                                    }`}
                                            >
                                                {option}: {q[`opation${option}`]}
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}

                <div className="flex justify-between">
                    <button
                        onClick={addQuestion}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        إضافة سؤال
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                    >
                        {isLoading ? 'جاري الحفظ...' : 'حفظ الاختبار'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizManager;

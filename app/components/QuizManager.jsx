'use client';
import React, { useState, useEffect } from 'react';
import GlobalApi from '../api/GlobalApi';
import { BiImageAdd, BiTrash, BiShow } from 'react-icons/bi';
import { FaSpinner, FaArrowUp, FaArrowDown } from 'react-icons/fa';
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

    const moveQuestion = (index, direction) => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= quizData.questions.length) return;
        
        const updatedQuestions = [...quizData.questions];
        [updatedQuestions[index], updatedQuestions[newIndex]] = 
        [updatedQuestions[newIndex], updatedQuestions[index]];
        
        setQuizData({
            ...quizData,
            questions: updatedQuestions
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                <h2 className="text-4xl font-arabicUI3 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    {isEditing ? 'تعديل الاختبار' : 'إضافة اختبار جديد'}
                </h2>
                {isEditing && (
                    <button
                        onClick={onCancel}
                        className="px-6 py-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 flex items-center gap-2"
                    >
                        <span>رجوع</span>
                    </button>
                )}
            </div>

            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input
                        type="text"
                        value={quizData.title}
                        onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                        placeholder="عنوان الاختبار"
                        className="p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 outline-none text-lg"
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => setQuestionType('multiple')}
                        className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                            questionType === 'multiple'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                    >
                        اختيار متعدد
                    </button>
                    <button
                        onClick={() => setQuestionType('truefalse')}
                        className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                            questionType === 'truefalse'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                    >
                        صح وخطأ
                    </button>
                    <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className="px-6 py-3 bg-purple-500/10 text-purple-300 rounded-xl hover:bg-purple-500/20 transition-all duration-300 flex items-center gap-2"
                    >
                        <BiShow className="text-xl" />
                        <span>{previewMode ? 'تعديل' : 'معاينة'}</span>
                    </button>
                </div>

                {quizData.questions.map((question, index) => (
                    <div key={index} className="p-8 bg-white/5 rounded-2xl space-y-6 backdrop-blur-sm border border-white/10 mb-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => moveQuestion(index, 'up')}
                                        disabled={index === 0}
                                        className="p-2 text-blue-400 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <FaArrowUp size={20} />
                                    </button>
                                    <button
                                        onClick={() => moveQuestion(index, 'down')}
                                        disabled={index === quizData.questions.length - 1}
                                        className="p-2 text-blue-400 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <FaArrowDown size={20} />
                                    </button>
                                </div>
                                <h3 className="text-2xl text-white font-arabicUI3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                    السؤال {index + 1}
                                </h3>
                            </div>
                            <button
                                onClick={() => removeQuestion(index)}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                            >
                                <BiTrash size={24} />
                            </button>
                        </div>
                        
                        <input
                            type="text"
                            value={question.qus}
                            onChange={(e) => handleQuestionChange(index, 'qus', e.target.value)}
                            placeholder="نص السؤال"
                            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 outline-none"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {['A', 'B', 'C', 'D'].map((option) => (
                                questionType === 'multiple' || option === 'A' || option === 'B' ? (
                                    <div key={option} className="flex items-center gap-4">
                                        <input
                                            type="text"
                                            value={question[`opation${option}`]}
                                            onChange={(e) => handleQuestionChange(index, `opation${option}`, e.target.value)}
                                            placeholder={`الاختيار ${option}`}
                                            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 outline-none"
                                        />
                                        <input
                                            type="radio"
                                            name={`correct-answer-${index}`}
                                            checked={question.trueChoisevip === option}
                                            onChange={() => handleQuestionChange(index, 'trueChoisevip', option)}
                                            className="w-6 h-6 cursor-pointer accent-blue-500"
                                            required
                                        />
                                    </div>
                                ) : null
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <input
                                type="url"
                                value={question.imageUrl || ''}
                                onChange={(e) => handleQuestionChange(index, 'imageUrl', e.target.value)}
                                placeholder="رابط الصورة (اختياري)"
                                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 outline-none"
                            />
                            {question.imageUrl && (
                                <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                                    <Image
                                        src={question.imageUrl}
                                        alt="Question image"
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-xl"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {previewMode ? (
                    <div className="space-y-6 bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
                        <h3 className="text-3xl text-white mb-6 font-arabicUI3">{quizData.title}</h3>
                        {quizData.questions.map((q, i) => (
                            <div key={i} className="bg-white/5 p-6 rounded-xl space-y-4">
                                <p className="text-xl text-white">س{i + 1}: {q.qus}</p>
                                {q.imageUrl && (
                                    <div className="rounded-xl overflow-hidden max-w-md">
                                        <Image
                                            src={q.imageUrl}
                                            alt="Question image"
                                            width={400}
                                            height={300}
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['A', 'B', 'C', 'D'].map(option => (
                                        questionType === 'multiple' || option === 'A' || option === 'B' ? (
                                            <div
                                                key={option}
                                                className={`p-4 rounded-xl transition-all duration-300 ${
                                                    q.trueChoisevip === option
                                                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                        : 'bg-white/5 text-white/70'
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

                <div className="flex justify-between pt-6 border-t border-white/10">
                    <button
                        onClick={addQuestion}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2"
                    >
                        إضافة سؤال
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                <span>جاري الحفظ...</span>
                            </>
                        ) : (
                            'حفظ الاختبار'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizManager;

'use client'
import React, { useState, useEffect } from 'react';
import GlobalApi from '../api/GlobalApi';

const AddQuiz = () => {
    const [questions, setQuestions] = useState([{ question: '', choices: ['', '', '', ''], correct: 'a', image: '' }]);
    const [showImageInput, setShowImageInput] = useState(false);
    const [formattedData, setFormattedData] = useState('');
    const [examTitle, setExamTitle] = useState(''); // State for exam title

    useEffect(() => {
        const savedQuestions = localStorage.getItem('questions');
        const savedExamTitle = localStorage.getItem('examTitle');
        if (savedQuestions) {
            setQuestions(JSON.parse(savedQuestions));
        }
        if (savedExamTitle) {
            setExamTitle(savedExamTitle);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('questions', JSON.stringify(questions));
        localStorage.setItem('examTitle', examTitle);
    }, [questions, examTitle]);

    const addQuestion = () => {
        setQuestions([...questions, { question: '', choices: ['', '', '', ''], correct: 'a', image: '' }]);
    };

    const handleInputChange = (index, field, value) => {
        const newQuestions = [...questions];
        if (field === 'question') {
            newQuestions[index].question = value;
        } else if (field === 'correct') {
            newQuestions[index].correct = value;
        } else if (field === 'image') {
            newQuestions[index].image = value;
        } else {
            newQuestions[index].choices[field] = value;
        }
        setQuestions(newQuestions);
    };

    const convertToFormat = () => {
        const formatted = JSON.stringify(questions, null, 2);
        setFormattedData(formatted);
    };

    const handleSendExamData = async () => {
        try {
            await GlobalApi.sendExamData(formattedData, examTitle);
            alert('Exam data sent successfully');
        } catch (error) {
            console.error('Error sending exam data:', error);
            alert('Failed to send exam data');
        }
    };

    const clearLocalStorage = () => {
        localStorage.removeItem('questions');
        localStorage.removeItem('examTitle');
        setQuestions([{ question: '', choices: ['', '', '', ''], correct: 'a', image: '' }]);
        setExamTitle('');
        setFormattedData('');
    };

    return (
        <div dir='rtl' className='  bg-yellow-500  bg-paton m-1 p-1  md:m-5 md:p-5 rounded-xl font-arabicUI2'>
            <h4 className=' bg-black text-5xl text-center w-fit flex justify-center mx-auto  text-yellow-500 p-4 rounded-xl my-4'>اضافة امتحان</h4>

            {/* Input for Exam Title */}
            <div className='mb-4'>
                <label className='block text-2xl md:text-3xl font-bold mb-2'>عنوان الامتحان</label>
                <input
                    className='w-full bg-gray-100 text-2xl md:text-3xl p-3 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500'
                    type="text"
                    placeholder="أدخل عنوان الامتحان"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2'>
                {questions.map((q, index) => (
                    <div dir='rtl' key={index} className='w-full max-w-2xl mx-auto bg-white border-2 border-black rounded-xl p-6 my-5 shadow-lg'>
                        {/* Question Section */}
                        <div className='border-4 border-black rounded-xl mb-4'>
                            <h3 className='bg-white p-3 rounded-xl text-2xl md:text-3xl font-bold text-center'>السوال {index + 1}</h3>
                            <input
                                className='w-full bg-gray-100 text-2xl md:text-3xl p-3 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                type="text"
                                placeholder="أدخل السؤال"
                                value={q.question}
                                onChange={(e) => handleInputChange(index, 'question', e.target.value)}
                            />
                        </div>

                        {/* Choices Section */}
                        <div className='space-y-3'>
                            {['a', 'b', 'c', 'd'].map((choice, choiceIndex) => (
                                <div key={choiceIndex} className='flex font-arabicUI3 items-center border-2 border-black rounded-xl'>
                                    <label className='bg-white p-3 rounded-r-xl text-2xl md:text-3xl font-bold w-16 text-center'>
                                        ({choice})
                                    </label>
                                    <input
                                        className='w-full rounded-l-xl bg-gray-100 text-2xl md:text-3xl p-3  focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        type="text"
                                        placeholder={`أدخل الاختيار ${choice}`}
                                        value={q.choices[choiceIndex]}
                                        onChange={(e) => handleInputChange(index, choiceIndex, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Correct Answer Section */}
                        <div className='mt-4 font-arabicUI3'>
                            <label className='block text-2xl md:text-3xl font-bold mb-2'>الاختيار الصحيح</label>
                            <select
                                className='w-full bg-gray-100 text-2xl md:text-3xl p-3 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={q.correct}
                                onChange={(e) => handleInputChange(index, 'correct', e.target.value)}
                            >
                                <option value="a">a</option>
                                <option value="b">b</option>
                                <option value="c">c</option>
                                <option value="d">d</option>
                            </select>
                        </div>

                        {/* Image Input Section */}
                        <div className='mt-4 font-arabicUI3'>
                            <button
                                onClick={() => setShowImageInput(!showImageInput)}
                                className='bg-blue-500 text-white text-xl md:text-2xl p-2 rounded-lg hover:bg-blue-600 transition-colors'
                            >
                                {showImageInput ? 'إخفاء رابط الصورة' : 'إظهار رابط الصورة'}
                            </button>
                            {showImageInput && (
                                <div className='mt-2'>
                                    <label className='block text-2xl md:text-3xl font-bold mb-2'>رابط الصورة</label>
                                    <input
                                        className='w-full bg-gray-100 text-2xl md:text-3xl p-3 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        type="text"
                                        placeholder="أدخل رابط الصورة"
                                        value={q.image}
                                        onChange={(e) => handleInputChange(index, 'image', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col space-y-4 mt-6">
                {/* Add Question Button */}
                <button
                    onClick={addQuestion}
                    className="bg-green-500 text-white text-xl md:text-2xl p-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                إضافة سؤال
            </button>

            {/* Convert to Format Button */}
            <button
                onClick={convertToFormat}
                className="bg-blue-500 text-white text-xl md:text-2xl p-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
                تحويل إلى التنسيق المطلوب
            </button>

            {/* Textarea for Formatted Data */}
            {formattedData && (
                <textarea
                    value={formattedData}
                    readOnly
                    className="mt-5 font-arabicUI3 w-full h-64 p-4 text-2xl bg-gray-100 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            )}

            {/* Send Exam Data Button */}
            <button
                onClick={handleSendExamData}
                className="bg-red-500 text-white text-xl md:text-2xl p-3 rounded-lg hover:bg-red-600 transition-colors"
            >
                إرسال بيانات الامتحان
            </button>

            {/* Clear Local Storage Button */}
            <button
                onClick={clearLocalStorage}
                className="bg-gray-500 text-white text-xl md:text-2xl p-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
                مسح كل البيانات
            </button>
        </div>
        </div >
    );
};

export default AddQuiz;
'use client';
import React, { useState, useEffect } from 'react';
import GlobalApi from '../api/GlobalApi';
import { BiEdit, BiTrash } from 'react-icons/bi';
import QuizManager from './QuizManager';

const ExamList = () => {
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadExams();
    }, []);

    const loadExams = async () => {
        try {
            const data = await GlobalApi.getAllExams();
            setExams(data.exams);
            setLoading(false);
        } catch (error) {
            console.error('Error loading exams:', error);
            setLoading(false);
        }
    };

    const handleEditExam = (exam) => {
        const parsedData = JSON.parse(exam.jsonexam);
        setSelectedExam({
            ...parsedData,
            id: exam.id,
            originalTitle: exam.title
        });
    };

    const handleUpdateComplete = async () => {
        await loadExams();
        setSelectedExam(null);
    };

    if (selectedExam) {
        return (
            <QuizManager
                initialData={selectedExam}
                onCancel={() => setSelectedExam(null)}
                onComplete={handleUpdateComplete}
                isEditing={true}
            />
        );
    }

    return (
        <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl">
            <h2 className="text-3xl font-arabicUI3 text-white mb-6">قائمة الاختبارات</h2>

            <div className="grid gap-4">
                {exams.map((exam) => (
                    <div
                        key={exam.id}
                        className="bg-white/5 p-4 rounded-lg flex justify-between items-center"
                    >
                        <div className="text-white">
                            <h3 className="text-xl font-arabicUI3">{exam.title}</h3>
                            <p className="text-sm text-white/60">
                                {JSON.parse(exam.jsonexam).questions?.length || 0} سؤال
                            </p>
                        </div>
                        <button
                            onClick={() => handleEditExam(exam)}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                        >
                            <BiEdit size={24} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExamList;

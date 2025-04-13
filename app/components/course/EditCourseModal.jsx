import React from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';

const EditCourseModal = ({
    editingCourse,
    editingChapters,
    editingExam,
    exams,
    onClose,
    onSave,
    setEditingCourse,
    setEditingChapters,
    setEditingExam
}) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl w-full max-w-7xl border border-white/10 shadow-2xl">
                {/* ...existing modal content... */}
            </div>
        </div>
    );
};

export default EditCourseModal;

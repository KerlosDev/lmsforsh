import { useState } from 'react';
import { FaTimes, FaEdit, FaArchive, FaBookmark, FaTrash, FaArrowUp, FaArrowDown, FaPlus } from 'react-icons/fa';

const CourseEditForm = ({
    course,
    chapters,
    selectedExams,
    exams,
    onClose,
    onSave,
    onUpdateChapters,
    onUpdateExams
}) => {
    const [editingCourse, setEditingCourse] = useState({ ...course });

    const moveChapter = (index, direction) => {
        const newChapters = [...chapters];
        if (direction === 'up' && index > 0) {
            [newChapters[index], newChapters[index - 1]] = [newChapters[index - 1], newChapters[index]];
            newChapters[index].order = index;
            newChapters[index - 1].order = index - 1;
        } else if (direction === 'down' && index < newChapters.length - 1) {
            [newChapters[index], newChapters[index + 1]] = [newChapters[index + 1], newChapters[index]];
            newChapters[index].order = index;
            newChapters[index + 1].order = index + 1;
        }
        onUpdateChapters(newChapters);
    };

    const handleSubmit = () => {
        onSave({ ...editingCourse, chapters, selectedExams });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl w-full max-w-7xl 
                border border-white/10 shadow-2xl my-4 max-h-[85vh] overflow-y-auto relative">
                
                {/* Header */}
                <div className="sticky top-0 backdrop-blur-xl bg-gray-900/80 p-4 border-b border-white/10 
                    flex justify-between items-center z-10">
                    <h3 className="text-xl font-arabicUI3 text-white flex items-center gap-3">
                        <FaEdit className="text-blue-400" />
                        تعديل الكورس
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <FaTimes className="text-white" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* Basic Info Column */}
                        <div className="lg:col-span-4 space-y-4">
                            {/* Draft Toggle */}
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
                                    <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none rounded-full 
                                        peer peer-checked:after:translate-x-full after:content-[''] 
                                        after:absolute after:top-0.5 after:left-[4px] after:bg-white 
                                        after:rounded-full after:h-6 after:w-6 after:transition-all 
                                        peer-checked:bg-yellow-500">
                                    </div>
                                </label>
                            </div>

                            {/* Basic Fields */}
                            <input
                                type="text"
                                value={editingCourse.nameofcourse}
                                onChange={(e) => setEditingCourse({
                                    ...editingCourse,
                                    nameofcourse: e.target.value
                                })}
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                placeholder="اسم الكورس"
                            />
                            <input
                                type="text"
                                value={editingCourse.nicknameforcourse}
                                onChange={(e) => setEditingCourse({
                                    ...editingCourse,
                                    nicknameforcourse: e.target.value
                                })}
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                placeholder="كود الكورس"
                            />

                            {/* Free Course Toggle */}
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 
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
                                    <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none rounded-full 
                                        peer peer-checked:after:translate-x-full after:content-[''] 
                                        after:absolute after:top-0.5 after:left-[4px] after:bg-white 
                                        after:rounded-full after:h-6 after:w-6 after:transition-all 
                                        peer-checked:bg-blue-500">
                                    </div>
                                </label>
                            </div>

                            {/* Price Input */}
                            {!editingCourse.isfree && (
                                <div className="relative w-full">
                                    <input
                                        type="number"
                                        value={editingCourse.price}
                                        onChange={(e) => setEditingCourse({
                                            ...editingCourse,
                                            price: e.target.value
                                        })}
                                        className="w-full p-3 pl-16 bg-white/5 border border-white/10 rounded-xl text-white"
                                        placeholder="السعر"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        جنيه
                                    </span>
                                </div>
                            )}

                            <textarea
                                value={editingCourse.description}
                                onChange={(e) => setEditingCourse({
                                    ...editingCourse,
                                    description: e.target.value
                                })}
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white h-32"
                                placeholder="وصف الكورس"
                            />
                        </div>

                        {/* Chapters Column */}
                        <div className="lg:col-span-4 lg:border-x border-white/10 lg:px-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-arabicUI3 text-white">الفصول</h4>
                                <button
                                    onClick={() => onUpdateChapters([...chapters, { nameofchapter: '', linkOfVideo: '' }])}
                                    className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                {chapters.map((chapter, index) => (
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
                                                disabled={index === chapters.length - 1}
                                                className={`p-1 rounded ${index === chapters.length - 1 ? 'text-gray-500' : 'text-blue-400 hover:bg-blue-500/20'}`}
                                            >
                                                <FaArrowDown size={14} />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={chapter.nameofchapter}
                                            onChange={(e) => {
                                                const newChapters = [...chapters];
                                                newChapters[index].nameofchapter = e.target.value;
                                                onUpdateChapters(newChapters);
                                            }}
                                            className="w-full p-2 bg-white/5 border border-white/10 rounded mb-2 text-white"
                                            placeholder="اسم الفصل"
                                        />
                                        <input
                                            type="text"
                                            value={chapter.linkOfVideo}
                                            onChange={(e) => {
                                                const newChapters = [...chapters];
                                                newChapters[index].linkOfVideo = e.target.value;
                                                onUpdateChapters(newChapters);
                                            }}
                                            className="w-full p-2 bg-white/5 border border-white/10 rounded text-white"
                                            placeholder="رابط الفيديو"
                                        />
                                        <button
                                            onClick={() => {
                                                const newChapters = chapters.filter((_, i) => i !== index);
                                                onUpdateChapters(newChapters);
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Exams Column */}
                        <div className="lg:col-span-4">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-arabicUI3 text-white">الامتحانات</h4>
                            </div>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {exams.map(exam => (
                                    <label key={exam.id} className="flex items-center space-x-3 p-3 bg-white/5 
                                        border border-white/10 rounded-lg text-white cursor-pointer hover:bg-white/10">
                                        <input
                                            type="checkbox"
                                            checked={selectedExams.some(e => e.id === exam.id)}
                                            onChange={() => {
                                                const newSelectedExams = selectedExams.some(e => e.id === exam.id)
                                                    ? selectedExams.filter(e => e.id !== exam.id)
                                                    : [...selectedExams, exam];
                                                onUpdateExams(newSelectedExams);
                                            }}
                                            className="form-checkbox h-5 w-5 text-indigo-600"
                                        />
                                        <span>{exam.title}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 backdrop-blur-xl bg-gray-900/80 p-4 border-t border-white/10 
                    flex justify-end gap-3 z-10">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl 
                            transition-all duration-300"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 
                            hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl 
                            transition-all duration-300"
                    >
                        حفظ التغييرات
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseEditForm;

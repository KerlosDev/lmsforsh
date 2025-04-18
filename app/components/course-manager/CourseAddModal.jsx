import { FaTimes, FaPlus, FaTrash, FaArchive, FaBookmark } from 'react-icons/fa';

const CourseAddModal = ({ 
    onClose, 
    onAdd, 
    chapters, 
    exams, 
    selectedExams, 
    onUpdateChapters, 
    onExamSelect, 
    newCourse, 
    onUpdateNewCourse 
}) => {
    const addChapter = () => {
        onUpdateChapters([...chapters, { nameofchapter: '', linkOfVideo: '' }]);
    };

    const removeChapter = (index) => {
        onUpdateChapters(chapters.filter((_, i) => i !== index));
    };

    const updateChapter = (index, field, value) => {
        const newChapters = chapters.map((chapter, i) => {
            if (i === index) {
                return { ...chapter, [field]: value };
            }
            return chapter;
        });
        onUpdateChapters(newChapters);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
            <div className="bg-gray-900 rounded-2xl w-full max-w-7xl border border-white/10 shadow-2xl my-8 max-h-[85vh] overflow-y-auto">
                <div className="sticky top-0 bg-gray-900 p-4 sm:p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-xl sm:text-2xl font-arabicUI3 text-white">إضافة كورس جديد</h3>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg">
                        <FaTimes className="text-white" />
                    </button>
                </div>

                <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Basic Info Column */}
                        <div className="lg:col-span-4 space-y-4">
                            <h4 className="text-lg font-arabicUI3 text-white mb-4">المعلومات الأساسية</h4>
                            
                            {/* Draft Mode Toggle */}
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
                                        onChange={(e) => onUpdateNewCourse({ 
                                            ...newCourse, 
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

                            {/* Course Basic Info Inputs */}
                            <input
                                type="text"
                                placeholder="اسم الكورس"
                                value={newCourse.nameofcourse}
                                onChange={(e) => onUpdateNewCourse({ 
                                    ...newCourse, 
                                    nameofcourse: e.target.value 
                                })}
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                            />
                            <input
                                type="text"
                                placeholder="كود الكورس"
                                value={newCourse.nicknameforcourse}
                                onChange={(e) => onUpdateNewCourse({ 
                                    ...newCourse, 
                                    nicknameforcourse: e.target.value 
                                })}
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                            />

                            {/* Free Course Toggle */}
                            <div className="flex items-center justify-between p-4 w-full bg-gradient-to-r 
                                from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20">
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
                                        onChange={(e) => onUpdateNewCourse({ 
                                            ...newCourse, 
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

                            {/* Price Input - Show only if not free */}
                            {!newCourse.isfree && (
                                <div className="relative w-full">
                                    <input
                                        type="number"
                                        placeholder="السعر"
                                        value={newCourse.price}
                                        onChange={(e) => onUpdateNewCourse({ 
                                            ...newCourse, 
                                            price: e.target.value 
                                        })}
                                        className="w-full p-3 pl-16 bg-white/5 border border-white/10 rounded-xl text-white"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        جنيه
                                    </span>
                                </div>
                            )}

                            <textarea
                                placeholder="وصف الكورس"
                                value={newCourse.description}
                                onChange={(e) => onUpdateNewCourse({ 
                                    ...newCourse, 
                                    description: e.target.value 
                                })}
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white h-32"
                            />
                        </div>

                        {/* Chapters Column */}
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
                                            onChange={() => onExamSelect(exam.id)}
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
                        onClick={onClose}
                        className="w-full sm:w-auto px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white 
                            rounded-lg transition-all"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={onAdd}
                        className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 
                            text-white rounded-lg transition-all"
                    >
                        إضافة الكورس
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseAddModal;

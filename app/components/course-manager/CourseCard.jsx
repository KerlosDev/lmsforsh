import { motion } from 'framer-motion';
import { FaEdit, FaCopy, FaVideo, FaQuestionCircle, FaBookmark } from 'react-icons/fa';

const CourseCard = ({ course, index, onEdit, onDuplicate, chapters = [] }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-xl 
                rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2
                hover:shadow-blue-500/30 border border-white/10 hover:border-blue-500/50">
                {/* Course Header Image & Overlay */}
                <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 z-10" />
                    <div className="absolute inset-0 bg-grid-white/[0.02] z-10" />
                    <img
                        src={course.imageUrl || "/chbg.jpg"}
                        alt={course.nameofcourse}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Course Status */}
                    <div className="absolute top-4 left-4 z-20">
                        <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2
                            ${course.isDraft ?
                                'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' :
                                'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'}`}>
                            <span className={`w-2 h-2 rounded-full ${course.isDraft ? 'bg-yellow-400' : 'bg-emerald-400'} animate-pulse`}></span>
                            {course.isDraft ? 'مسودة' : 'منشور'}
                        </div>
                    </div>

                    {/* Price Badge */}
                    {!course.isfree && (
                        <div className="absolute top-4 right-4 z-20">
                            <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r 
                                from-amber-500/90 to-amber-600/90 text-white">
                                <span className="font-arabicUI3">{course.price} جنيه</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Course Content */}
                <div className="p-6 relative">
                    <h3 className="text-xl font-arabicUI3 text-white mb-2 line-clamp-1">
                        {course.nameofcourse}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                        {course.description || 'No description available'}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={onEdit}
                            className="flex-1 py-2 px-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 
                            rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                            <FaEdit size={14} />
                            <span>تعديل</span>
                        </button>
                        <button
                            onClick={onDuplicate}
                            className="flex-1 py-2 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 
                            rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                            <FaCopy size={14} />
                            <span>نسخ</span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseCard;

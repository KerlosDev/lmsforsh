import { motion } from 'framer-motion';
import { FaBook, FaVideo, FaEdit, FaBookmark } from 'react-icons/fa';

const CourseStats = ({ courses = [] }) => {  // Add default empty array
    // Ensure courses is an array
    const courseList = Array.isArray(courses) ? courses : [];
    
    const stats = [
        {
            label: 'إجمالي الكورسات',
            value: courseList.length,
            icon: FaBook,
            color: 'from-blue-600/20 to-blue-400/20',
            iconColor: 'text-blue-400',
            borderColor: 'border-blue-500/20'
        },
        {
            label: 'الكورسات المنشورة',
            value: courseList.filter(c => !c?.isDraft).length,
            icon: FaVideo,
            color: 'from-green-600/20 to-green-400/20',
            iconColor: 'text-green-400',
            borderColor: 'border-green-500/20'
        },
        {
            label: 'المسودات',
            value: courseList.filter(c => c?.isDraft).length,
            icon: FaEdit,
            color: 'from-yellow-600/20 to-yellow-400/20',
            iconColor: 'text-yellow-400',
            borderColor: 'border-yellow-500/20'
        },
        {
            label: 'الكورسات المجانية',
            value: courseList.filter(c => c?.isfree).length,
            icon: FaBookmark,
            color: 'from-purple-600/20 to-purple-400/20',
            iconColor: 'text-purple-400',
            borderColor: 'border-purple-500/20'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index}
                    className={`relative overflow-hidden bg-gradient-to-br ${stat.color} 
                        backdrop-blur-xl rounded-xl p-6 border ${stat.borderColor}`}
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
                </motion.div>
            ))}
        </div>
    );
};

export default CourseStats;

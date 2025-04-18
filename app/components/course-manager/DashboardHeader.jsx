import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';

const DashboardHeader = ({ onAddCourse }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
        >
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-1"></div>
            <div className="absolute inset-y-0 right-0 w-[300px] bg-gradient-to-l from-blue-500/10 via-transparent to-transparent"></div>

            <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-3">
                    <h1 className="text-4xl font-arabicUI3 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        إدارة الكورسات
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl">
                        إدارة وتنظيم الكورسات التعليمية بكل سهولة
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAddCourse}
                    className="relative group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 
                        rounded-xl text-white font-medium shadow-lg hover:shadow-blue-500/25 
                        transition-all duration-300"
                >
                    <span className="flex items-center gap-3 text-lg">
                        <FaPlus className="text-blue-200" />
                        <span className="font-arabicUI3">إضافة كورس جديد</span>
                    </span>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default DashboardHeader;

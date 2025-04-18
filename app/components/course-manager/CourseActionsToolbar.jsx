import { motion } from 'framer-motion';
import { FaPlus, FaDownload, FaCloudUploadAlt } from 'react-icons/fa';

const CourseActionsToolbar = ({ onDownload, onUpload, onAddCourse }) => {
    return (
        <div className="flex flex-wrap gap-4 mt-8 border-t border-white/10 pt-8">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAddCourse}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
                    rounded-xl text-white flex items-center gap-2"
            >
                <FaPlus className="text-blue-200" />
                <span>إضافة كورس</span>
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDownload}
                className="px-6 py-3 bg-gradient-to-r from-green-600/20 to-green-700/20 
                    rounded-xl text-green-400 flex items-center gap-2 border border-green-500/20"
            >
                <FaDownload />
                <span>تحميل JSON</span>
            </motion.button>

            
        </div>
    );
};

export default CourseActionsToolbar;

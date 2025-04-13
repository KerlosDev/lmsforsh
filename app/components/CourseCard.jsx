import { motion } from 'framer-motion';
import { FaFlask, FaAtom, FaDna, FaMicroscope, FaEdit, FaTrash } from 'react-icons/fa';

export const CourseCardSkeleton = () => (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/10">
        <div className="animate-pulse">
            <div className="flex justify-between items-start mb-4">
                <div className="w-2/3">
                    <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
                <div className="flex gap-2">
                    <div className="w-8 h-8 bg-white/10 rounded"></div>
                    <div className="w-8 h-8 bg-white/10 rounded"></div>
                </div>
            </div>
            <div className="space-y-4">
                <div className="h-4 bg-white/10 rounded w-full"></div>
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
            </div>
            <div className="mt-6 flex justify-between">
                <div className="h-6 bg-white/10 rounded w-24"></div>
                <div className="h-6 bg-white/10 rounded w-16"></div>
            </div>
        </div>
    </div>
);

export const CourseCard = ({ course, onEdit, onDelete, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative group"
        >
            {/* ...existing course card code... */}
        </motion.div>
    );
};

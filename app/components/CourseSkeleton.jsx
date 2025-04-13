import { motion } from 'framer-motion';

const CourseSkeleton = () => (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/10">
        <div className="animate-pulse space-y-4">
            <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                    <div className="h-7 bg-white/10 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded-lg w-1/2"></div>
                </div>
                <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-lg bg-white/10"></div>
                    <div className="w-10 h-10 rounded-lg bg-white/10"></div>
                </div>
            </div>
            <div className="space-y-3 pt-4">
                <div className="h-4 bg-white/10 rounded-lg w-full"></div>
                <div className="h-4 bg-white/10 rounded-lg w-5/6"></div>
            </div>
            <div className="flex justify-between items-center pt-4">
                <div className="h-8 bg-white/10 rounded-lg w-24"></div>
                <div className="h-6 bg-white/10 rounded-full w-20"></div>
            </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shine"></div>
    </div>
);

export default CourseSkeleton;

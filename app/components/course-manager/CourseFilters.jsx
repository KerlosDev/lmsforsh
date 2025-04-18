const CourseFilters = ({ 
    filterState = 'all', 
    setFilterState = () => {}, 
    sortBy = 'newest', 
    setSortBy = () => {}, 
    courses = [] 
}) => {
    // Ensure courses is an array
    const courseList = Array.isArray(courses) ? courses : [];

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-8 gap-4">
            <div className="flex items-center gap-4 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                <button
                    onClick={() => setFilterState('all')}
                    className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap
                        ${filterState === 'all'
                            ? 'bg-white/10 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    كل الكورسات ({courseList.length})
                </button>
                <button
                    onClick={() => setFilterState('published')}
                    className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap
                        ${filterState === 'published'
                            ? 'bg-green-500/20 text-green-400'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    منشور ({courseList.filter(c => !c?.isDraft).length})
                </button>
                <button
                    onClick={() => setFilterState('draft')}
                    className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap
                        ${filterState === 'draft'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    مسودة ({courseList.filter(c => c?.isDraft).length})
                </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>ترتيب حسب:</span>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                >
                    <option value="newest">الأحدث</option>
                    <option value="oldest">الأقدم</option>
                    <option value="name">الإسم</option>
                </select>
            </div>
        </div>
    );
};

export default CourseFilters;

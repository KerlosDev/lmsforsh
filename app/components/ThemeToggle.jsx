'use client'
import { useState, useEffect } from 'react';
import { MdWbSunny } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark'); // Default theme is "dark"

  useEffect(() => {
    // Check for saved theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // If no saved preference, default to dark mode
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative group transition-transform duration-300 hover:scale-105"
      aria-label={theme === 'light' ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح'}
    >
      {/* Hover Glow Effect */}
      <div className={`absolute -inset-3 rounded-2xl opacity-0 group-hover:opacity-100 
                           transition-all duration-500 blur-xl
                           ${theme === 'light'
          ? 'bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20'
          : 'bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20'}`}
      />

      {/* Switch Container */}
      <div className={`relative w-16 h-8 rounded-full p-1
                           shadow-lg transition-all duration-300 group-hover:shadow-xl
                           ${theme === 'light'
          ? 'bg-gradient-to-r from-yellow-100 to-orange-100 group-hover:from-yellow-200 group-hover:to-orange-200'
          : 'bg-gradient-to-r from-slate-700 to-slate-800 group-hover:from-slate-600 group-hover:to-slate-700'}`}>

        {/* Track Icons */}
        <div className="absolute inset-1 rounded-full overflow-hidden">
          {/* Light Mode Icon */}
          <div className={`absolute right-1 top-1/2 -translate-y-1/2
                                   transition-all duration-500
                                   ${theme === 'light'
              ? 'opacity-100 text-yellow-400 scale-100'
              : 'opacity-30 scale-90'}`}>
            <MdWbSunny className="text-lg transform transition-transform group-hover:rotate-45" />
          </div>
          {/* Dark Mode Icon */}
          <div className={`absolute left-1 top-1/2 -translate-y-1/2
                                   transition-all duration-500
                                   ${theme === 'light'
              ? 'opacity-30 scale-90'
              : 'opacity-100 text-blue-400 scale-100'}`}>
            <MdDarkMode className="text-lg transform transition-transform group-hover:-rotate-45" />
          </div>
        </div>

        {/* Sliding Thumb */}
        <div className={`absolute top-1 h-6 w-6 rounded-full 
                                transform transition-all duration-500
                                ${theme === 'light'
            ? 'right-1 translate-x-0 bg-gradient-to-br from-yellow-400 to-orange-400'
            : 'right-9 translate-x-0 bg-gradient-to-br from-blue-500 to-blue-600'}`}>
          {/* Thumb Inner Glow */}
          <div className="absolute inset-0.5 rounded-full bg-white/20" />

          {/* Active Icon */}
          <div className="absolute inset-0 flex items-center justify-center text-white">
            {theme === 'light'
              ? <MdWbSunny className="text-sm transform transition-all duration-300 group-hover:rotate-180" />
              : <MdDarkMode className="text-sm transform transition-all duration-300 group-hover:-rotate-180" />}
          </div>
        </div>
      </div>

      {/* Focus Ring */}
      <div className={`absolute -inset-px rounded-full opacity-0 
                           group-focus-visible:opacity-100 transition-opacity duration-300
                           ${theme === 'light'
          ? 'ring-2 ring-yellow-400'
          : 'ring-2 ring-blue-500'}`}
      />
    </button>
  );
}


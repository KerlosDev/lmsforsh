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
      className={`p-2 m-2 font-abril text-4xl `}
      >
          
          {theme === 'light' ? (
          <h3 className=' text-slate-700 outline-dashed  p-3 rounded-full shadow-2xl shadow-slate-500'> <MdDarkMode /></h3>
          ) : (<h3 className=' text-yellow-400 outline-dashed  p-3 rounded-full shadow-2xl shadow-yellow-500'><MdWbSunny /></h3>) }
          

          
      </button>
  );
}


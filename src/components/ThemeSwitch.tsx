import React from 'react';
import { Sun, Moon, Laptop, Palette } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeSwitch() {
  const { theme, colorScheme, setTheme, setColorScheme } = useTheme();

  const colorSchemes = [
    { name: 'blue', class: 'from-blue-500 to-indigo-500' },
    { name: 'purple', class: 'from-purple-500 to-pink-500' },
    { name: 'green', class: 'from-emerald-500 to-teal-500' },
    { name: 'rose', class: 'from-rose-500 to-pink-500' },
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setTheme('light')}
          className={`p-2 rounded-md transition-colors ${
            theme === 'light' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''
          }`}
          title="Light mode"
        >
          <Sun size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`p-2 rounded-md transition-colors ${
            theme === 'dark' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''
          }`}
          title="Dark mode"
        >
          <Moon size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <button
          onClick={() => setTheme('system')}
          className={`p-2 rounded-md transition-colors ${
            theme === 'system' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''
          }`}
          title="System theme"
        >
          <Laptop size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="relative group">
        <button
          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Change color scheme"
        >
          <Palette size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 hidden group-hover:block">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.name}
              onClick={() => setColorScheme(scheme.name as any)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
                colorScheme === scheme.name ? 'bg-gray-50 dark:bg-gray-700' : ''
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${scheme.class}`} />
              <span className="capitalize">{scheme.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
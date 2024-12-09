import { useTheme } from '../../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-full transition-colors duration-200
        ${theme === 'light' 
          ? 'bg-gray-100 hover:bg-gray-200' 
          : 'bg-gray-800 hover:bg-gray-700'}
      `}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <MoonIcon className="w-5 h-5 text-gray-600" />
      ) : (
        <SunIcon className="w-5 h-5 text-gray-300" />
      )}
    </button>
  );
}; 
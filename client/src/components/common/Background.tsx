import { useTheme } from '../../context/ThemeContext';

export const Background = () => {
  const { theme } = useTheme();
  
  return (
    <div 
      className="fixed inset-0 transition-colors duration-200"
      style={{
        backgroundColor: theme === 'light' ? '#F5F5F7' : '#1D1D1F',
      }}
    />
  );
}; 
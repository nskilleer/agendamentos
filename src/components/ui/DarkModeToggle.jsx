import { useTheme } from '../../contexts/ThemeContext';

const DarkModeToggle = ({ className = "" }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`relative mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0 ${className}`}>
      <button
        type="button"
        className="light-dark-toggle leading-none inline-block transition-all relative top-[2px] text-[#fe7a36] hover:text-primary-500"
        onClick={toggleDarkMode}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <i className="material-symbols-outlined !text-[20px] md:!text-[22px]">
          {isDarkMode ? 'light_mode' : 'dark_mode'}
        </i>
      </button>
    </div>
  );
};

export default DarkModeToggle;
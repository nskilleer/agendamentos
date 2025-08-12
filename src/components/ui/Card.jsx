const Card = ({ children, className = "", title, subtitle }) => {
  return (
    <div className={`trezo-card bg-white dark:bg-[#0c1427] rounded-md border border-gray-100 dark:border-[#172036] shadow-sm ${className}`}>
      {(title || subtitle) && (
        <div className="trezo-card-header px-[20px] md:px-[25px] py-[18px] md:py-[20px] border-b border-gray-100 dark:border-[#172036]">
          {title && (
            <h3 className="text-black dark:text-white font-semibold text-lg">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="trezo-card-content p-[20px] md:p-[25px]">
        {children}
      </div>
    </div>
  );
};

export default Card;
const StatCard = ({ title, value, icon, change, changeType = "positive", bgColor = "primary" }) => {
  const bgColorClasses = {
    primary: "bg-primary-500",
    secondary: "bg-secondary-500", 
    success: "bg-success-500",
    warning: "bg-warning-500",
    danger: "bg-danger-500",
    info: "bg-info-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500"
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md border border-gray-100 dark:border-[#172036] shadow-sm">
      <div className="trezo-card-content p-[20px] md:p-[25px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-black dark:text-white font-semibold text-lg mb-[5px]">
              {value}
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {title}
            </p>
            {change && (
              <div className={`flex items-center mt-[5px] ${
                changeType === 'positive' 
                  ? 'text-success-500' 
                  : 'text-danger-500'
              }`}>
                <i className="material-symbols-outlined text-[16px] mr-[5px]">
                  {changeType === 'positive' ? 'trending_up' : 'trending_down'}
                </i>
                <span className="text-sm font-medium">{change}</span>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className={`w-[50px] h-[50px] ${bgColorClasses[bgColor]} rounded-md flex items-center justify-center text-white`}>
              {typeof icon === 'string' ? (
                <i className="material-symbols-outlined text-[24px]">{icon}</i>
              ) : (
                icon
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
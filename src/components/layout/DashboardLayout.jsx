import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  return (
    <div className={`main-content-wrap transition-all ${sidebarActive ? 'active' : ''}`}>
      <Sidebar />
      <div className="main-content transition-all flex flex-col overflow-hidden min-h-screen">
        <Header toggleActive={toggleSidebar} />
        <div className="flex-1 bg-gray-50 dark:bg-[#0a0e19] p-[15px] md:p-[25px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
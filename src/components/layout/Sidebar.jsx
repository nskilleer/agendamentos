import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = user?.userType === 'profissional' ? [
    {
      name: 'Dashboard',
      path: '/dashboard-pro',
      icon: 'dashboard'
    },
    {
      name: 'Agendamentos',
      path: '/agendamentos',
      icon: 'event'
    },
    {
      name: 'Clientes',
      path: '/clientes',
      icon: 'people'
    },
    {
      name: 'Serviços',
      path: '/servicos',
      icon: 'medical_services'
    },
    {
      name: 'Configurações',
      path: '/configuracoes',
      icon: 'settings'
    }
  ] : [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard'
    },
    {
      name: 'Meus Agendamentos',
      path: '/meus-agendamentos',
      icon: 'event'
    },
    {
      name: 'Agendar Serviço',
      path: '/agendar',
      icon: 'add_circle'
    },
    {
      name: 'Perfil',
      path: '/perfil',
      icon: 'person'
    }
  ];

  return (
    <div className="sidebar-area bg-white dark:bg-[#0c1427] fixed z-[7] top-0 h-screen transition-all rounded-r-md">
      <div className="px-[20px] md:px-[25px] py-[20px] md:py-[25px] border-b border-gray-100 dark:border-[#172036]">
        <Link to="/" className="flex items-center gap-[10px]">
          <div className="text-2xl">📅</div>
          <h1 className="text-xl font-bold text-black dark:text-white">
            AgendaFácil
          </h1>
        </Link>
      </div>

      <div className="px-[20px] md:px-[25px] py-[20px] border-b border-gray-100 dark:border-[#172036]">
        <div className="flex items-center gap-[12px]">
          <div className="w-[40px] h-[40px] bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
            {user?.nome?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-black dark:text-white font-medium text-sm">
              {user?.nome}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs capitalize">
              {user?.userType}
            </p>
          </div>
        </div>
      </div>

      <nav className="px-[15px] py-[20px] sidebar-custom-scrollbar overflow-y-auto h-[calc(100vh-200px)]">
        <div className="accordion">
          {menuItems.map((item) => (
            <div key={item.path} className="accordion-item">
              <Link
                to={item.path}
                className={`accordion-button sidemenu-link flex items-center gap-[12px] px-[15px] py-[12px] rounded-md text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? 'active bg-gray-50 dark:bg-[#15203c] text-primary-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15203c]'
                }`}
              >
                <i className="material-symbols-outlined !text-[20px]">
                  {item.icon}
                </i>
                <span>{item.name}</span>
              </Link>
            </div>
          ))}
        </div>
      </nav>
      
      {/* Mobile overlay close area */}
      <div className="burger-menu fixed inset-0 bg-black bg-opacity-50 z-[-1] xl:hidden"></div>
    </div>
  );
};

export default Sidebar;
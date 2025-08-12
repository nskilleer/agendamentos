import DarkModeToggle from '../ui/DarkModeToggle';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ toggleActive }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      id="header"
      className="header-area bg-white dark:bg-[#0c1427] py-[13px] px-[20px] md:px-[25px] fixed top-0 z-[6] rounded-b-md transition-all"
    >
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex items-center justify-center md:justify-normal">
          <div className="relative leading-none top-px ltr:mr-[13px] ltr:md:mr-[18px] ltr:lg:mr-[23px] rtl:ml-[13px] rtl:md:ml-[18px] rtl:lg:ml-[23px]">
            <button
              type="button"
              className="hide-sidebar-toggle transition-all inline-block hover:text-primary-500"
              onClick={toggleActive}
            >
              <i className="material-symbols-outlined !text-[20px]">menu</i>
            </button>
          </div>

          <div className="search-form">
            <div className="relative">
              <input
                type="text"
                className="h-[40px] w-[300px] md:w-[400px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[15px] pr-[45px] text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500 outline-0 transition-all"
                placeholder="Pesquisar..."
              />
              <button className="absolute right-[15px] top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <i className="material-symbols-outlined !text-[20px]">search</i>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center md:justify-normal mt-[13px] md:mt-0">
          <DarkModeToggle />

          <div className="relative mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
            <button
              type="button"
              className="leading-none inline-block transition-all relative top-[2px] hover:text-primary-500"
            >
              <i className="material-symbols-outlined !text-[20px] md:!text-[22px]">notifications</i>
            </button>
          </div>

          <div className="profile-menu relative mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
            <button
              type="button"
              className="profile-menu-toggle flex items-center gap-[10px] transition-all hover:text-primary-500"
            >
              <div className="w-[35px] h-[35px] bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-black dark:text-white font-medium hidden md:block">
                {user?.nome || 'Usuário'}
              </span>
              <i className="material-symbols-outlined !text-[16px] text-gray-500 dark:text-gray-400">keyboard_arrow_down</i>
            </button>

            <div className="profile-menu-dropdown absolute right-0 top-full mt-[10px] w-[200px] bg-white dark:bg-[#172036] border border-gray-100 dark:border-[#172036] rounded-md shadow-3xl opacity-0 invisible transition-all">
              <div className="p-[15px]">
                <div className="border-b border-gray-100 dark:border-[#172036] pb-[15px] mb-[15px]">
                  <p className="text-black dark:text-white font-medium">{user?.nome}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
                </div>
                
                <div className="space-y-[8px]">
                  <button className="w-full text-left px-[12px] py-[8px] rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#0c1427] transition-all flex items-center gap-[8px]">
                    <i className="material-symbols-outlined !text-[18px]">person</i>
                    Meu Perfil
                  </button>
                  <button className="w-full text-left px-[12px] py-[8px] rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#0c1427] transition-all flex items-center gap-[8px]">
                    <i className="material-symbols-outlined !text-[18px]">settings</i>
                    Configurações
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-[12px] py-[8px] rounded-md text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-all flex items-center gap-[8px]"
                  >
                    <i className="material-symbols-outlined !text-[18px]">logout</i>
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DarkModeToggle from '../components/ui/DarkModeToggle';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await login(email, senha);
    
    if (result.success) {
      setMessage('Login bem-sucedido! Redirecionando...');
      setMessageType('success');
      setTimeout(() => {
        navigate(result.redirect?.includes('painelpro') ? '/dashboard-pro' : '/dashboard');
      }, 1000);
    } else {
      setMessage(result.message || 'Erro no login');
      setMessageType('error');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-main-content bg-white dark:bg-[#0a0e19] py-[60px] md:py-[80px] lg:py-[135px]">
      <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
          <div className="xl:ltr:-mr-[25px] xl:rtl:-ml-[25px] 2xl:ltr:-mr-[45px] 2xl:rtl:-ml-[45px] rounded-[25px] order-2 lg:order-1">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-[25px] p-8 h-[804px] flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-6">📅</div>
                <h2 className="text-3xl font-bold mb-4">AgendaFácil</h2>
                <p className="text-xl opacity-90">Gerencie seus agendamentos com facilidade</p>
              </div>
            </div>
          </div>

          <div className="xl:ltr:pl-[90px] xl:rtl:pr-[90px] 2xl:ltr:pl-[120px] 2xl:rtl:pr-[120px] order-1 lg:order-2 relative">
            <div className="absolute top-0 right-0">
              <DarkModeToggle />
            </div>

            <div className="my-[17px] md:my-[25px]">
              <h1 className="!font-semibold !text-[22px] md:!text-xl lg:!text-2xl !mb-[5px] md:!mb-[7px]">
                Bem-vindo de volta ao AgendaFácil!
              </h1>
              <p className="font-medium lg:text-md text-[#445164] dark:text-gray-400">
                Acesse sua conta para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-[15px] relative">
                <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="seuemail@exemplo.com"
                  required
                />
              </div>

              <div className="mb-[15px] relative">
                <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                  Senha
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="Digite sua senha"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="md:text-md block w-full text-center transition-all rounded-md font-medium mt-[20px] md:mt-[25px] py-[12px] px-[25px] text-white bg-primary-500 hover:bg-primary-400 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-[5px]">
                  {loading ? (
                    <>
                      <i className="material-symbols-outlined animate-spin">sync</i>
                      Entrando...
                    </>
                  ) : (
                    <>
                      <i className="material-symbols-outlined">login</i>
                      Entrar
                    </>
                  )}
                </span>
              </button>
            </form>

            <p className="mt-[15px] md:mt-[20px]">
              Não tem uma conta?{' '}
              <Link
                to="/register"
                className="text-primary-500 transition-all font-semibold hover:underline"
              >
                Cadastre-se aqui
              </Link>
            </p>

            {message && (
              <div className={`mt-4 p-4 rounded-md ${
                messageType === 'success' 
                  ? 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 border border-success-200 dark:border-success-800' 
                  : 'bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 border border-danger-200 dark:border-danger-800'
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {messageType === 'success' ? (
                      <i className="material-symbols-outlined text-success-500">check_circle</i>
                    ) : (
                      <i className="material-symbols-outlined text-danger-500">error</i>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
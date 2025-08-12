import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DarkModeToggle from '../components/ui/DarkModeToggle';

function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    userType: 'profissional'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.senha !== formData.confirmarSenha) {
      setMessage('As senhas não coincidem!');
      setMessageType('error');
      return;
    }
    
    setLoading(true);
    setMessage('');

    const { confirmarSenha, ...userData } = formData;
    const result = await register(userData);
    
    if (result.success) {
      setMessage('Cadastro bem-sucedido! Redirecionando...');
      setMessageType('success');
      setTimeout(() => {
        navigate(result.redirect === 'painelpro.html' ? '/dashboard-pro' : '/dashboard');
      }, 1000);
    } else {
      setMessage(result.message || 'Erro no cadastro');
      setMessageType('error');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-main-content bg-white dark:bg-gray-900 py-[60px] md:py-[80px] lg:py-[135px] min-h-screen">
      <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
          <div className="xl:mr-[25px] 2xl:mr-[45px] rounded-[25px] order-2 lg:order-1 hidden lg:block">
            <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-[25px] p-8 h-[804px] flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-6">🚀</div>
                <h2 className="text-3xl font-bold mb-4">Comece Agora!</h2>
                <p className="text-xl opacity-90">Crie sua conta e organize seus agendamentos</p>
              </div>
            </div>
          </div>

          <div className="xl:pl-[90px] 2xl:pl-[120px] order-1 lg:order-2 relative">
            <DarkModeToggle className="absolute top-0 right-0" />
            
            <div className="text-center lg:text-left mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Crie sua conta
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Preencha os dados para começar
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Nome Completo
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="seuemail@exemplo.com"
                />
              </div>

              <div>
                <label htmlFor="userType" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Tipo de Usuário
                </label>
                <select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-[17px] block w-full outline-0 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="profissional">Profissional</option>
                  <option value="cliente">Cliente</option>
                </select>
              </div>

              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Senha
                </label>
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.senha}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Crie uma senha segura"
                />
              </div>

              <div>
                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Confirmar Senha
                </label>
                <input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Confirme sua senha"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-center transition-all rounded-md font-medium mt-[25px] py-[12px] px-[25px] text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Cadastrar
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 leading-6">
              Ao criar sua conta, você concorda com nossos{' '}
              <Link to="#" className="font-medium text-gray-900 dark:text-white hover:text-blue-500 transition-all">
                Termos de Serviço
              </Link>{' '}
              e{' '}
              <Link to="#" className="font-medium text-gray-900 dark:text-white hover:text-blue-500 transition-all">
                Política de Privacidade
              </Link>
            </p>

            <p className="mt-4 text-center">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="text-blue-500 transition-all font-semibold hover:underline"
              >
                Faça login aqui
              </Link>
            </p>

            {message && (
              <div className={`mt-4 p-4 rounded-md ${
                messageType === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {messageType === 'success' ? (
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
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

export default Register;
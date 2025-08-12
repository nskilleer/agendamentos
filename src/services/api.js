import axios from 'axios';

// Função para detectar a URL da API automaticamente
const getApiUrl = () => {
  // Se há uma variável de ambiente específica, usa ela
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Em desenvolvimento, tenta detectar automaticamente
  if (import.meta.env.DEV) {
    // Se estamos em desenvolvimento, usa a porta padrão do backend
    return 'http://localhost:3333/api';
  }

  // Em produção, assume que a API está no mesmo domínio
  return '/api';
};

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para requests - adiciona logs em desenvolvimento
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses - melhora tratamento de erros
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${error.response?.status || 'Network Error'} ${error.config?.url}`);
    }

    // Se for erro 401, redireciona para login (mas não se já estivermos na página de login)
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
    
    // Se for erro de conexão, mostra mensagem amigável
    if (!error.response) {
      console.error('❌ Erro de conexão com o servidor. Verifique se o backend está rodando.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
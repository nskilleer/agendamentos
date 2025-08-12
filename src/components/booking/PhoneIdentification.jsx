import { useState } from 'react';
import api from '../../services/api';

function PhoneIdentification({ onPhoneSubmit }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPhone = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica máscara (xx) xxxxx-xxxx
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    
    return value.slice(0, -1); // Impede mais de 11 dígitos
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhone(e.target.value);
    setPhone(formattedPhone);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      setError('Digite um número de telefone válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/public/appointments/${cleanPhone}`);
      
      if (response.data.success) {
        onPhoneSubmit(phone, response.data.data.appointments);
      } else {
        setError(response.data.message || 'Erro ao buscar agendamentos');
      }
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      if (error.response?.status === 404) {
        // Nenhum agendamento encontrado - permite continuar
        onPhoneSubmit(phone, []);
      } else {
        setError('Erro ao conectar com o servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1d29] rounded-[25px] p-8 shadow-sm">
      {/* Ícone e Título */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">📱</div>
        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
          Identifique-se pelo Telefone
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Digite seu número de telefone para ver seus agendamentos ou fazer um novo
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <div className="mb-6">
          <label 
            htmlFor="phone" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Número de Telefone
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="(00) 00000-0000"
            className="w-full px-4 py-3 border border-gray-300 dark:border-[#2d3648] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-[#0a0e19] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg text-center"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || phone.replace(/\D/g, '').length < 10}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors text-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Buscando...
            </div>
          ) : (
            'Continuar'
          )}
        </button>
      </form>

      {/* Informações */}
      <div className="mt-8 text-center">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 max-w-md mx-auto">
          <div className="text-blue-600 dark:text-blue-400 text-sm">
            <p className="font-medium mb-1">💡 Primeira vez aqui?</p>
            <p>Não se preocupe! Você pode fazer um agendamento mesmo sem ter cadastro.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhoneIdentification;
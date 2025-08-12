import { useState, useEffect } from 'react';
import api from '../../services/api';

function BookingFlow({ clientPhone, onBackToMenu, onBookingComplete }) {
  const [currentStep, setCurrentStep] = useState(1); // 1: service, 2: datetime, 3: confirmation
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [clientName, setClientName] = useState('');
  const [observations, setObservations] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (selectedService && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedService, selectedDate]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/public/services');
      if (response.data.success) {
        setServices(response.data.data.services);
      }
    } catch (error) {
      setError('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      setLoading(true);
      const response = await api.get('/public/available-slots', {
        params: {
          serviceId: selectedService.id,
          data: selectedDate
        }
      });
      
      if (response.data.success) {
        setAvailableSlots(response.data.data.availableSlots);
      }
    } catch (error) {
      setError('Erro ao carregar horários disponíveis');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedSlot(null);
    setCurrentStep(2);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleProceedToConfirmation = () => {
    if (!selectedSlot || !clientName.trim()) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    setCurrentStep(3);
  };

  const handleBookingSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      const bookingData = {
        serviceId: selectedService.id,
        data: selectedDate,
        horario: selectedSlot.time,
        nomeCliente: clientName.trim(),
        telefoneCliente: clientPhone.replace(/\D/g, ''),
        observacoes: observations.trim()
      };

      const response = await api.post('/public/appointments', bookingData);
      
      if (response.data.success) {
        // Sucesso - mostrar confirmação
        alert('🎉 Agendamento realizado com sucesso!\\n\\nDetalhes do seu agendamento:\\n' +
          `Serviço: ${selectedService.nome}\\n` +
          `Data: ${new Date(selectedDate).toLocaleDateString('pt-BR')}\\n` +
          `Horário: ${selectedSlot.time}\\n` +
          `Cliente: ${clientName}`);
        
        onBookingComplete();
      } else {
        setError(response.data.message || 'Erro ao realizar agendamento');
      }
    } catch (error) {
      console.error('Erro ao agendar:', error);
      setError(error.response?.data?.message || 'Erro ao realizar agendamento');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 30 dias no futuro
    return maxDate.toISOString().split('T')[0];
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            currentStep >= step 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}>
            {step}
          </div>
          {step < 3 && (
            <div className={`w-12 h-1 mx-2 ${
              currentStep > step 
                ? 'bg-primary-600' 
                : 'bg-gray-200 dark:bg-gray-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderServiceSelection = () => (
    <div>
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white text-center">
        Escolha o Tipo de Manicure
      </h3>
      
      <div className="grid gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => handleServiceSelect(service)}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  {service.nome}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {service.descricao}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="mr-4">⏱️ {service.duracao_min} min</span>
                  <span>💅 {service.profissional}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  R$ {service.preco?.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDateTimeSelection = () => (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => setCurrentStep(1)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-4"
        >
          ← Voltar
        </button>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Escolha Data e Horário
        </h3>
      </div>

      {selectedService && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <p className="text-blue-800 dark:text-blue-200 font-medium">
            Serviço selecionado: {selectedService.nome} - R$ {selectedService.preco?.toFixed(2)}
          </p>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Data
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          min={getMinDate()}
          max={getMaxDate()}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-[#0a0e19] text-gray-900 dark:text-white"
          required
        />
      </div>

      {selectedDate && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Horários Disponíveis
          </label>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Carregando horários...</p>
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => handleSlotSelect(slot)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedSlot?.time === slot.time
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-500'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Nenhum horário disponível para esta data</p>
              <p className="text-sm mt-1">Tente outra data</p>
            </div>
          )}
        </div>
      )}

      {selectedSlot && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Seu Nome *
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Digite seu nome completo"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-[#0a0e19] text-gray-900 dark:text-white"
            required
          />
        </div>
      )}

      {selectedSlot && clientName && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Observações (opcional)
          </label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Alguma observação especial?"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-[#0a0e19] text-gray-900 dark:text-white resize-none"
          />
        </div>
      )}

      {selectedSlot && clientName && (
        <button
          onClick={handleProceedToConfirmation}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Revisar Agendamento
        </button>
      )}
    </div>
  );

  const renderConfirmation = () => (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => setCurrentStep(2)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-4"
        >
          ← Voltar
        </button>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Confirmar Agendamento
        </h3>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
          Resumo do Agendamento
        </h4>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Serviço:</span>
            <span className="font-medium text-gray-900 dark:text-white">{selectedService?.nome}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Data:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {new Date(selectedDate).toLocaleDateString('pt-BR')}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Horário:</span>
            <span className="font-medium text-gray-900 dark:text-white">{selectedSlot?.time}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Duração:</span>
            <span className="font-medium text-gray-900 dark:text-white">{selectedService?.duracao_min} min</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Cliente:</span>
            <span className="font-medium text-gray-900 dark:text-white">{clientName}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Telefone:</span>
            <span className="font-medium text-gray-900 dark:text-white">{clientPhone}</span>
          </div>
          
          {observations && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Observações:</span>
              <span className="font-medium text-gray-900 dark:text-white">{observations}</span>
            </div>
          )}
          
          <hr className="dark:border-gray-600" />
          
          <div className="flex justify-between text-xl font-bold">
            <span className="text-gray-900 dark:text-white">Total:</span>
            <span className="text-primary-600 dark:text-primary-400">
              R$ {selectedService?.preco?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleBookingSubmit}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Confirmando Agendamento...
          </div>
        ) : (
          '✅ Confirmar Agendamento'
        )}
      </button>
    </div>
  );

  return (
    <div className="bg-white dark:bg-[#1a1d29] rounded-[25px] p-8 shadow-sm">
      {/* Header com botão voltar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToMenu}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          ← Voltar ao Menu
        </button>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {clientPhone}
        </div>
      </div>

      {/* Indicador de Passos */}
      {renderStepIndicator()}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </p>
        </div>
      )}

      {/* Content based on current step */}
      {currentStep === 1 && renderServiceSelection()}
      {currentStep === 2 && renderDateTimeSelection()}
      {currentStep === 3 && renderConfirmation()}
    </div>
  );
}

export default BookingFlow;
import { useState } from 'react';
import PhoneIdentification from '../components/booking/PhoneIdentification';
import BookingFlow from '../components/booking/BookingFlow';
import ClientAppointments from '../components/booking/ClientAppointments';
import DarkModeToggle from '../components/ui/DarkModeToggle';

function PublicBooking() {
  const [currentStep, setCurrentStep] = useState('phone'); // phone, menu, booking, appointments
  const [clientPhone, setClientPhone] = useState('');
  const [clientAppointments, setClientAppointments] = useState([]);

  const handlePhoneSubmit = (phone, appointments) => {
    setClientPhone(phone);
    setClientAppointments(appointments);
    setCurrentStep('menu');
  };

  const handleNewBooking = () => {
    setCurrentStep('booking');
  };

  const handleViewAppointments = () => {
    setCurrentStep('appointments');
  };

  const handleBackToMenu = () => {
    setCurrentStep('menu');
  };

  const handleBackToPhone = () => {
    setCurrentStep('phone');
    setClientPhone('');
    setClientAppointments([]);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'phone':
        return (
          <PhoneIdentification 
            onPhoneSubmit={handlePhoneSubmit}
          />
        );
      
      case 'menu':
        return (
          <div className="text-center">
            <div className="bg-white dark:bg-[#1a1d29] rounded-[25px] p-8 mb-6 shadow-sm">
              <div className="text-6xl mb-6">👋</div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Olá! Encontramos {clientAppointments.length} agendamento(s) seu(s)
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Telefone: {clientPhone}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                <button
                  onClick={handleViewAppointments}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
                >
                  Ver Meus Agendamentos
                </button>
                
                <button
                  onClick={handleNewBooking}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
                >
                  Fazer Novo Agendamento
                </button>
              </div>
              
              <button
                onClick={handleBackToPhone}
                className="mt-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline"
              >
                Usar outro telefone
              </button>
            </div>
          </div>
        );
      
      case 'booking':
        return (
          <BookingFlow 
            clientPhone={clientPhone}
            onBackToMenu={handleBackToMenu}
            onBookingComplete={() => {
              // Refresh appointments and go back to menu
              setCurrentStep('menu');
            }}
          />
        );
      
      case 'appointments':
        return (
          <ClientAppointments 
            appointments={clientAppointments}
            clientPhone={clientPhone}
            onBackToMenu={handleBackToMenu}
            onAppointmentUpdate={(updatedAppointments) => {
              setClientAppointments(updatedAppointments);
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="auth-main-content bg-white dark:bg-[#0a0e19] min-h-screen py-[60px] md:py-[80px] lg:py-[135px]">
      <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
        
        {/* Header com Dark Mode */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="text-4xl mr-4">💅</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                AgendaFácil Manicure
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Agende seu horário de forma rápida e fácil
              </p>
            </div>
          </div>
          <DarkModeToggle />
        </div>

        {/* Conteúdo Principal */}
        <div className="max-w-2xl mx-auto">
          {renderCurrentStep()}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>© 2024 AgendaFácil Manicure. Sistema de agendamentos online.</p>
        </div>
      </div>
    </div>
  );
}

export default PublicBooking;
import { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import api from '../../services/api';

const AppointmentCalendar = ({ onEventClick, onDateClick, height = 'auto' }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const loadEvents = useCallback(async (start, end) => {
    setLoading(true);
    try {
      const response = await api.get('/agendamentos/calendar', {
        params: {
          start: start?.toISOString(),
          end: end?.toISOString()
        }
      });

      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Carrega eventos iniciais
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    loadEvents(startOfMonth, endOfMonth);
  }, [currentDate, loadEvents]);

  const handleDatesSet = (dateInfo) => {
    loadEvents(dateInfo.start, dateInfo.end);
  };

  const handleEventClick = (clickInfo) => {
    if (onEventClick) {
      onEventClick(clickInfo.event);
    }
  };

  const handleDateClick = (dateInfo) => {
    if (onDateClick) {
      onDateClick(dateInfo);
    }
  };

  const eventContent = (eventInfo) => {
    const { event } = eventInfo;
    const status = event.extendedProps.status;
    
    // Ícones por status
    const statusIcons = {
      'agendado': '⏰',
      'confirmado': '✓',
      'concluido': '✅',
      'cancelado': '❌',
      'em_andamento': '🔄',
      'nao_compareceu': '❌'
    };

    return (
      <div className="fc-event-content overflow-hidden">
        <div className="fc-event-time text-xs">
          {statusIcons[status]} {eventInfo.timeText}
        </div>
        <div className="fc-event-title text-xs font-medium truncate">
          {event.title}
        </div>
      </div>
    );
  };

  // Configuração responsiva
  const getCalendarConfig = () => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    if (isMobile) {
      return {
        initialView: 'listWeek',
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,listWeek'
        }
      };
    } else if (isTablet) {
      return {
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }
      };
    } else {
      return {
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }
      };
    }
  };

  const config = getCalendarConfig();

  return (
    <div className="bg-white dark:bg-[#0c1427] rounded-[25px] p-6 shadow-sm border border-gray-100 dark:border-[#172036]">
      {/* Header do calendário */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            📅 Calendário de Agendamentos
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Visualize e gerencie seus agendamentos
          </p>
        </div>
        
        {loading && (
          <div className="flex items-center text-blue-600 dark:text-blue-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm">Carregando...</span>
          </div>
        )}
      </div>

      {/* Legenda de cores */}
      <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">Agendado</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">Confirmado</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">Concluído</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 rounded-full bg-violet-500 mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">Em andamento</span>
        </div>
      </div>

      {/* FullCalendar */}
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          {...config}
          locale="pt-br"
          events={events}
          eventContent={eventContent}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          datesSet={handleDatesSet}
          height={height}
          nowIndicator={true}
          scrollTime="08:00:00"
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday to Saturday
            startTime: '08:00',
            endTime: '18:00',
          }}
          eventDisplay="block"
          dayMaxEvents={3}
          moreLinkClick="popover"
          eventMouseEnter={(mouseEnterInfo) => {
            // Tooltip simples
            const event = mouseEnterInfo.event;
            const props = event.extendedProps;
            
            mouseEnterInfo.el.title = `
Cliente: ${props.clientName}
Telefone: ${props.clientPhone}
Serviço: ${props.service}
Status: ${props.status}
${props.observations ? 'Obs: ' + props.observations : ''}
            `.trim();
          }}
          buttonText={{
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana', 
            day: 'Dia',
            list: 'Lista'
          }}
          allDayText="Todo dia"
          noEventsText="Nenhum agendamento encontrado"
          // Customização adicional para dark mode
          eventClassNames={(arg) => {
            return ['cursor-pointer', 'hover:opacity-80', 'transition-opacity'];
          }}
        />
      </div>

      {/* CSS personalizado para dark mode */}
      <style jsx>{`
        .calendar-container :global(.fc-theme-standard .fc-scrollgrid) {
          border: 1px solid ${loading ? '#e5e7eb' : 'transparent'};
        }
        
        .calendar-container :global(.fc-theme-standard td),
        .calendar-container :global(.fc-theme-standard th) {
          border-color: #374151;
        }
        
        .dark .calendar-container :global(.fc) {
          --fc-border-color: #374151;
          --fc-button-text-color: #f9fafb;
          --fc-button-bg-color: #4f46e5;
          --fc-button-border-color: #4f46e5;
          --fc-button-hover-bg-color: #4338ca;
          --fc-button-hover-border-color: #4338ca;
          --fc-button-active-bg-color: #3730a3;
          --fc-button-active-border-color: #3730a3;
          --fc-today-bg-color: rgba(79, 70, 229, 0.1);
        }
        
        .dark .calendar-container :global(.fc-toolbar-title) {
          color: #f9fafb;
        }
        
        .dark .calendar-container :global(.fc-col-header-cell-cushion) {
          color: #d1d5db;
        }
        
        .dark .calendar-container :global(.fc-daygrid-day-number) {
          color: #d1d5db;
        }
        
        .dark .calendar-container :global(.fc-list-event-time) {
          color: #9ca3af;
        }
        
        .dark .calendar-container :global(.fc-list-event-title) {
          color: #f9fafb;
        }
      `}</style>
    </div>
  );
};

export default AppointmentCalendar;
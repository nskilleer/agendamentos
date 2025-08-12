import { useState, useEffect } from 'react';
import StatCard from '../ui/StatCard';
import api from '../../services/api';

const StatsCards = ({ period = 'month' }) => {
  const [stats, setStats] = useState({
    today: 0,
    total: 0,
    confirmado: 0,
    concluido: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/agendamentos/stats', {
        params: { period }
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'day':
        return 'Hoje';
      case 'week':
        return 'Esta Semana';
      case 'month':
        return 'Este Mês';
      default:
        return 'Período';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[25px] mb-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-[25px] h-32"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[25px] mb-6">
      <StatCard
        title="Agendamentos Hoje"
        value={stats.today}
        icon="today"
        bgColor="primary"
        change={stats.today > 0 ? `${stats.today} agendamento${stats.today !== 1 ? 's' : ''}` : 'Nenhum hoje'}
      />
      
      <StatCard
        title={`Confirmados ${getPeriodLabel()}`}
        value={stats.confirmado}
        icon="schedule"
        bgColor="info"
        change={stats.total > 0 ? `${Math.round((stats.confirmado / stats.total) * 100)}% do total` : '0%'}
      />
      
      <StatCard
        title={`Concluídos ${getPeriodLabel()}`}
        value={stats.concluido}
        icon={
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        bgColor="success"
        change={stats.total > 0 ? `${Math.round((stats.concluido / stats.total) * 100)}% concluída` : '0%'}
      />
      
      <StatCard
        title={`Receita ${getPeriodLabel()}`}
        value={formatCurrency(stats.revenue)}
        icon={
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        }
        bgColor="purple"
        change={stats.concluido > 0 ? `Média: ${formatCurrency(stats.revenue / stats.concluido)}` : 'Sem receita'}
      />
    </div>
  );
};

export default StatsCards;
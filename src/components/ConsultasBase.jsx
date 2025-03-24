import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService, authService } from '../services/apiService';

const ConsultasBase = ({ children, queryType }) => {
  const [queryCount, setQueryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkQueryLimit = async () => {
      try {
        const { user } = await authService.getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }

        // Obtener el recuento de consultas de los últimos 30 días
        const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const { data, error } = await dataService.search('user_queries', {
          userId: user.id,
          fromDate: oneMonthAgo,
          countOnly: true
        });

        if (error) throw error;
        
        setQueryCount(data?.length || 0);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al verificar límite de consultas:', error);
        setIsLoading(false);
      }
    };

    checkQueryLimit();
  }, [navigate]);

  const handleQuery = async () => {
    if (queryCount >= 5) {
      navigate('/afiliados');
      return;
    }

    try {
      const { user } = await authService.getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }
      
      const { error } = await dataService.create('user_queries', { 
        user_id: user.id, 
        query_type: queryType 
      });
      
      if (error) throw error;
      
      setQueryCount(prev => prev + 1);
    } catch (error) {
      console.error('Error al realizar la consulta:', error);
    }
  };

  return children({ handleQuery, queryCount, isLoading });
};

export default ConsultasBase;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../App';

const ConsultasBase = ({ children, queryType }) => {
  const [queryCount, setQueryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkQueryLimit = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { count } = await supabase
        .from('user_queries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      setQueryCount(count || 0);
      setIsLoading(false);
    };

    checkQueryLimit();
  }, [navigate]);

  const handleQuery = async () => {
    if (queryCount >= 5) {
      navigate('/afiliados');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from('user_queries')
      .insert([{ user_id: user.id, query_type: queryType }]);

    setQueryCount(prev => prev + 1);
  };

  return children({ handleQuery, queryCount, isLoading });
};

export default ConsultasBase;

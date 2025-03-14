import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';

const AffiliateList = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          throw new Error('Debe iniciar sesión para ver la lista de afiliados');
        }

        const { data, error: fetchError } = await supabase
          .from('affiliates')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        setAffiliates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliates();
  }, []);

  if (loading) {
    return <div>Cargando afiliados...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {affiliates.map((affiliate) => (
        <div key={affiliate.id} className="p-4 border rounded-md">
          <p className="text-gray-700">{affiliate.name}</p>
          <p className="text-sm text-gray-500">{affiliate.email}</p>
          <p className="text-sm text-gray-500">Código de referido: {affiliate.referral_code}</p>
          <p className="text-sm text-gray-500">{new Date(affiliate.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default AffiliateList;

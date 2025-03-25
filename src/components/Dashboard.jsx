import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { affiliateService } from '../services/affiliateService';
import { ebookService } from '../services/ebookService';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [affiliateStats, code] = await Promise.all([
          affiliateService.getReferralStats(user.id),
          affiliateService.generateReferralCode(user.id)
        ]);
        setStats(affiliateStats);
        setReferralCode(code);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const copyReferralLink = () => {
    const link = `${window.location.origin}/register?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copiado al portapapeles');
  };

  if (loading) {
    return <div className="loader">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Afiliado</h1>
      
      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Referidos"
          value={stats?.total_referrals || 0}
          icon="users"
        />
        <StatsCard
          title="Referidos Exitosos"
          value={stats?.successful_referrals || 0}
          icon="check"
        />
        <StatsCard
          title="Ganancias Totales"
          value={`$${stats?.total_earnings || 0}`}
          icon="money"
        />
      </div>

      {/* Referral Link Section */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Tu Link de Referido</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={`${window.location.origin}/register?ref=${referralCode}`}
            className="form-input flex-1"
            readOnly
          />
          <button
            onClick={copyReferralLink}
            className="btn-primary"
          >
            Copiar
          </button>
        </div>
      </div>
    </div>
  );
}

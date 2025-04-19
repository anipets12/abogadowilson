import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaCoins, FaCreditCard, FaChartLine, FaLink, FaCopy } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const AffiliateOverview = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    pendingCommission: 0,
    totalEarned: 0,
    conversionRate: 0,
    clickCount: 0,
    recentReferrals: []
  });
  
  useEffect(() => {
    if (user) {
      fetchAffiliateStats();
    }
  }, [user]);
  
  const fetchAffiliateStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/affiliates/stats', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar estadu00edsticas de afiliados');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching affiliate stats:', error);
      // Datos de fallback para desarrollo
      setStats({
        totalReferrals: 12,
        activeReferrals: 8,
        pendingCommission: 85.50,
        totalEarned: 325.75,
        conversionRate: 5.2,
        clickCount: 230,
        recentReferrals: [
          { id: 1, name: 'Ana Rodru00edguez', date: '2025-04-05', status: 'active', commission: 15.00 },
          { id: 2, name: 'Mario Gu00f3mez', date: '2025-04-10', status: 'active', commission: 22.50 },
          { id: 3, name: 'Elena Torres', date: '2025-04-12', status: 'pending', commission: 0 },
          { id: 4, name: 'Carlos Su00e1nchez', date: '2025-04-15', status: 'active', commission: 18.00 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };
  
  const copyReferralLink = () => {
    const referralLink = `https://abogadowilson.com/ref/${user?.id || '123456'}`;
    navigator.clipboard.writeText(referralLink);
    toast.success('Enlace de referido copiado al portapapeles');
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800'
    };

    const statusText = {
      active: 'Activo',
      pending: 'Pendiente',
      inactive: 'Inactivo'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusText[status] || status}
      </span>
    );
  };
  
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="h-12 bg-gray-200 rounded mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Panel de Afiliados</h1>
        <Link 
          to="/dashboard/referrals/settings" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Configurar Programa
        </Link>
      </div>
      
      {/* Estadu00edsticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Referidos</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalReferrals}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <FaUsers className="h-6 w-6 text-blue-700" />
            </div>
          </div>
          <p className="mt-2 text-xs text-blue-600">Total de personas referidas por ti</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Comisiu00f3n Pendiente</p>
              <p className="text-2xl font-bold text-green-900">${stats.pendingCommission.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <FaCoins className="h-6 w-6 text-green-700" />
            </div>
          </div>
          <p className="mt-2 text-xs text-green-600">Pru00f3ximo pago: {new Date().getDate() > 15 ? '05' : '20'}/{(new Date().getMonth() + 1).toString().padStart(2, '0')}/{new Date().getFullYear()}</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Total Ganado</p>
              <p className="text-2xl font-bold text-purple-900">${stats.totalEarned.toFixed(2)}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <FaCreditCard className="h-6 w-6 text-purple-700" />
            </div>
          </div>
          <p className="mt-2 text-xs text-purple-600">Ingresos totales desde tu registro</p>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Tasa de Conversiu00f3n</p>
              <p className="text-2xl font-bold text-orange-900">{stats.conversionRate.toFixed(1)}%</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <FaChartLine className="h-6 w-6 text-orange-700" />
            </div>
          </div>
          <p className="mt-2 text-xs text-orange-600">{stats.clickCount} clics, {stats.totalReferrals} registros</p>
        </div>
      </div>
      
      {/* Enlace de referido */}
      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Tu Enlace de Afiliado</h2>
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-l-md p-3">
            <FaLink className="h-5 w-5 text-gray-500" />
          </div>
          <input 
            type="text" 
            value={`https://abogadowilson.com/ref/${user?.id || '123456'}`}
            readOnly
            className="flex-1 px-3 py-2 border-y border-gray-300 focus:outline-none text-gray-700 text-sm"
          />
          <button 
            onClick={copyReferralLink}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md text-sm hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <FaCopy className="mr-2" />
            Copiar
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>Comparte este enlace con tus amigos, familia y contactos. Cuando se registren usando tu enlace, ganaru00e1s una comisiu00f3n por sus compras:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
            <li>10% por compras de tokens y e-books</li>
            <li>15% por la primera consulta legal</li>
            <li>5% por servicios recurrentes durante 6 meses</li>
          </ul>
        </div>
        <div className="mt-4 flex space-x-2">
          <a 
            href={`https://wa.me/?text=u00a1Conoce al mejor abogado de Ecuador! Regu00edstrate usando mi enlace y recibe un 5% de descuento en tu primera consulta: https://abogadowilson.com/ref/${user?.id || '123456'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Compartir en WhatsApp
          </a>
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=https://abogadowilson.com/ref/${user?.id || '123456'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Compartir en Facebook
          </a>
          <a 
            href={`https://twitter.com/intent/tweet?text=u00a1Conoce al mejor abogado de Ecuador! Regu00edstrate usando mi enlace y recibe un 5% de descuento en tu primera consulta:&url=https://abogadowilson.com/ref/${user?.id || '123456'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
          >
            Compartir en Twitter
          </a>
        </div>
      </div>
      
      {/* Referidos recientes */}
      <h2 className="text-lg font-medium text-gray-900 mb-3">Referidos Recientes</h2>
      {stats.recentReferrals && stats.recentReferrals.length > 0 ? (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comisiu00f3n</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentReferrals.map((referral) => (
                <tr key={referral.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{referral.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(referral.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(referral.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {referral.commission > 0 ? `$${referral.commission.toFixed(2)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tienes referidos au00fan</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza a compartir tu enlace para empezar a ganar comisiones.</p>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <Link 
          to="/dashboard/referrals/withdrawals" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-4"
        >
          Solicitar Pago
        </Link>
        <Link 
          to="/dashboard/referrals/history" 
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Ver Historial Completo
        </Link>
      </div>
    </div>
  );
};

export default AffiliateOverview;

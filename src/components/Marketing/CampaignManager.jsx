import React, { useState, useEffect } from 'react';
import { FaChartLine, FaBullhorn, FaUsers, FaShare, FaLink, FaCopy, FaCheck } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const CampaignManager = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [campaignStats, setCampaignStats] = useState({});
  const [copied, setCopied] = useState({});
  
  useEffect(() => {
    if (user) {
      fetchCampaigns();
    }
  }, [user]);
  
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/marketing/campaigns', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) throw new Error('Error al cargar campañas');
      
      const data = await response.json();
      setActiveCampaigns(data.campaigns);
      setCampaignStats(data.stats);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      // Datos de fallback para desarrollo
      setActiveCampaigns([
        {
          id: 1,
          title: 'Consultoría Legal Gratuita',
          description: 'Ofrezca a sus contactos una consultoría legal gratuita',
          imageUrl: '/images/marketing/free-consultation.jpg',
          linkCode: 'CONSULT25',
          reward: 15,
          rewardDescription: '15 tokens por cada referido que complete una consulta',
          expiry: '2025-06-30',
          active: true
        },
        {
          id: 2,
          title: 'Plan Familiar Legal',
          description: 'Promocione nuestro plan familiar legal con descuento',
          imageUrl: '/images/marketing/family-plan.jpg',
          linkCode: 'FAMILIA50',
          reward: 30,
          rewardDescription: '30 tokens por cada referido que se suscriba',
          expiry: '2025-07-15',
          active: true
        },
        {
          id: 3,
          title: 'E-Book Promocional',
          description: 'Comparta nuestro e-book "Derechos del Ciudadano" con 50% de descuento',
          imageUrl: '/images/marketing/ebook-promo.jpg',
          linkCode: 'EBOOK50',
          reward: 10,
          rewardDescription: '10 tokens por cada descarga completa',
          expiry: '2025-05-30',
          active: true
        }
      ]);
      
      setCampaignStats({
        totalEarnings: 85,
        activeReferrals: 7,
        completedReferrals: 5,
        campaignPerformance: {
          1: { clicks: 23, conversions: 3, earnings: 45 },
          2: { clicks: 15, conversions: 1, earnings: 30 },
          3: { clicks: 12, conversions: 1, earnings: 10 }
        }
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopyLink = (campaignId, linkCode) => {
    const baseUrl = 'https://abogadowilson.com/promo/';
    const fullLink = `${baseUrl}${linkCode}?ref=${user?.id || 'demo'}`;
    
    navigator.clipboard.writeText(fullLink);
    
    setCopied({ ...copied, [campaignId]: true });
    toast.success('Enlace promocional copiado al portapapeles');
    
    setTimeout(() => {
      setCopied({ ...copied, [campaignId]: false });
    }, 3000);
  };
  
  const handleShareCampaign = (campaign, platform) => {
    const baseUrl = 'https://abogadowilson.com/promo/';
    const shareLink = `${baseUrl}${campaign.linkCode}?ref=${user?.id || 'demo'}`;
    const message = `Conoce los servicios legales del Abg. Wilson Ipiales. ${campaign.description}. Utiliza mi código: ${campaign.linkCode}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${message} ${shareLink}`)}`;  
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}&quote=${encodeURIComponent(message)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${message} ${shareLink}`)}`;  
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}&title=${encodeURIComponent(campaign.title)}&summary=${encodeURIComponent(campaign.description)}`;
        break;
      default:
        toast.error('Plataforma de compartir no soportada');
        return;
    }
    
    window.open(shareUrl, '_blank');
    toast.success(`Campaña compartida en ${platform}`);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  if (loading) {
    return (
      <div className="animate-pulse p-6">
        <div className="h-8 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 px-6 py-4 text-white">
        <h2 className="text-xl font-bold">Campañas de Marketing</h2>
        <p className="text-sm text-purple-100 mt-1">Promocione nuestros servicios y gane tokens</p>
      </div>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-purple-50 border-b border-purple-100">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaChartLine className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tokens Ganados</p>
              <p className="text-2xl font-bold text-gray-800">{campaignStats.totalEarnings || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaUsers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Referidos Activos</p>
              <p className="text-2xl font-bold text-gray-800">{campaignStats.activeReferrals || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FaBullhorn className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Conversiones</p>
              <p className="text-2xl font-bold text-gray-800">{campaignStats.completedReferrals || 0}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Campañas Activas */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Campañas Activas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCampaigns.map((campaign) => {
            const stats = campaignStats.campaignPerformance?.[campaign.id] || {
              clicks: 0,
              conversions: 0,
              earnings: 0
            };
            
            return (
              <div 
                key={campaign.id} 
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="h-40 bg-gray-100 relative overflow-hidden">
                  <img 
                    src={campaign.imageUrl || '/images/marketing/default.jpg'} 
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-purple-800 to-transparent px-3 py-1 text-white text-xs">
                    Reward: {campaign.reward} tokens
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="text-lg font-medium text-gray-900">{campaign.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
                  
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-center">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">{stats.clicks}</p>
                      <p className="text-gray-500">Clicks</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">{stats.conversions}</p>
                      <p className="text-gray-500">Conversiones</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">{stats.earnings}</p>
                      <p className="text-gray-500">Tokens</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">Código: <span className="font-mono">{campaign.linkCode}</span></span>
                      <span className="text-xs text-gray-500">Hasta: {formatDate(campaign.expiry)}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCopyLink(campaign.id, campaign.linkCode)}
                        className="flex-1 flex items-center justify-center py-2 px-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm"
                      >
                        {copied[campaign.id] ? <FaCheck className="mr-1" /> : <FaLink className="mr-1" />}
                        {copied[campaign.id] ? 'Copiado!' : 'Copiar Link'}
                      </button>
                      <button 
                        onClick={() => handleShareCampaign(campaign, 'whatsapp')} 
                        className="py-2 px-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm flex items-center justify-center"
                      >
                        <FaShare className="mr-1" />
                        Compartir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Descripción del programa */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">¿Cómo funciona?</h3>
        <ol className="space-y-2 text-sm text-gray-600 list-decimal pl-5">
          <li>Selecciona una campaña que desees promocionar</li>
          <li>Copia el enlace de referido o compártelo directamente en tus redes sociales</li>
          <li>Cuando alguien use tu enlace y complete la acción requerida, ganarás tokens automáticamente</li>
          <li>Tus tokens pueden ser utilizados para servicios legales en nuestra plataforma</li>
        </ol>
        
        <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100">
          <p className="text-sm text-blue-800">
            <FaInfoCircle className="inline mr-1" />
            Las recompensas serán acreditadas a tu cuenta en un plazo máximo de 24 horas después de que tu referido complete la acción correspondiente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignManager;

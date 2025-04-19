import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTag, FaGift, FaPercent, FaClock, FaCopy, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const PromotionsManager = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activePromotions, setActivePromotions] = useState([]);
  const [appliedPromotions, setAppliedPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchActivePromotions();
      fetchAppliedPromotions();
    }
  }, [user]);
  
  const fetchActivePromotions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/promotions/active', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) throw new Error('Error al cargar promociones');
      
      const data = await response.json();
      setActivePromotions(data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      // Datos de prueba para desarrollo
      setActivePromotions([
        {
          id: 1,
          code: 'BIENVENIDO25',
          title: 'Bienvenida 25% OFF',
          description: '25% de descuento en tu primera compra de tokens',
          discountType: 'percentage',
          discountValue: 25,
          minPurchase: 20,
          validUntil: '2025-12-31',
          imageUrl: '/images/promotions/welcome-promo.jpg',
          restrictions: 'Solo para nuevos usuarios. Aplicable en la primera compra.',
          category: 'tokens'
        },
        {
          id: 2,
          code: 'LEGAL50',
          title: '50 Tokens Extra',
          description: 'Obtén 50 tokens adicionales en la compra del paquete Premium',
          discountType: 'bonus',
          discountValue: 50,
          minPurchase: 299,
          validUntil: '2025-06-30',
          imageUrl: '/images/promotions/premium-bonus.jpg',
          restrictions: 'Aplicable solo en la compra del paquete Premium de tokens.',
          category: 'tokens'
        },
        {
          id: 3,
          code: 'CONSULTA2X1',
          title: '2x1 en Consultas',
          description: 'Paga una consulta legal completa y obtén otra gratis',
          discountType: 'twoforone',
          discountValue: 100,
          minPurchase: 0,
          validUntil: '2025-05-31',
          imageUrl: '/images/promotions/consultation-2x1.jpg',
          restrictions: 'La segunda consulta debe ser utilizada dentro de los 30 días siguientes a la primera.',
          category: 'consultations'
        },
        {
          id: 4,
          code: 'EBOOK10OFF',
          title: '10% OFF en E-Books',
          description: 'Descuento del 10% en todos nuestros e-books legales',
          discountType: 'percentage',
          discountValue: 10,
          minPurchase: 0,
          validUntil: '2025-07-15',
          imageUrl: '/images/promotions/ebook-promo.jpg',
          restrictions: 'No acumulable con otras promociones de e-books.',
          category: 'ebooks'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAppliedPromotions = async () => {
    try {
      const response = await fetch('/api/promotions/applied', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) throw new Error('Error al cargar promociones aplicadas');
      
      const data = await response.json();
      setAppliedPromotions(data);
    } catch (error) {
      console.error('Error fetching applied promotions:', error);
      // Datos de prueba para desarrollo
      setAppliedPromotions([
        {
          id: 101,
          promotionId: 2,
          code: 'LEGAL50',
          title: '50 Tokens Extra',
          appliedDate: '2025-04-10T14:30:00',
          expiryDate: '2025-05-10T14:30:00',
          status: 'active',
          usedIn: 'Compra de tokens - Paquete Premium'
        }
      ]);
    }
  };
  
  const handleSelectPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setPromoCode(promotion.code);
  };
  
  const handleVerifyCode = async () => {
    if (!promoCode.trim()) {
      toast.error('Por favor, ingrese un código promocional');
      return;
    }
    
    setVerifying(true);
    
    try {
      // Simulación de verificación para desarrollo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Buscar si el código coincide con alguna promoción activa
      const foundPromotion = activePromotions.find(
        promo => promo.code.toLowerCase() === promoCode.trim().toLowerCase()
      );
      
      if (foundPromotion) {
        setSelectedPromotion(foundPromotion);
        toast.success(`¡Promoción "${foundPromotion.title}" verificada correctamente!`);
      } else {
        toast.error('Código promocional no válido o expirado');
        setSelectedPromotion(null);
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error('Error al verificar el código. Intente nuevamente.');
    } finally {
      setVerifying(false);
    }
  };
  
  const handleApplyPromotion = async () => {
    if (!selectedPromotion) {
      toast.error('Por favor, seleccione una promoción válida');
      return;
    }
    
    try {
      setVerifying(true);
      
      // Simulación de aplicación para desarrollo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Agregar a promociones aplicadas (simular respuesta del servidor)
      const newApplied = {
        id: Date.now(),
        promotionId: selectedPromotion.id,
        code: selectedPromotion.code,
        title: selectedPromotion.title,
        appliedDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 días
        status: 'active',
        usedIn: 'Pendiente de uso'
      };
      
      setAppliedPromotions([...appliedPromotions, newApplied]);
      toast.success('¡Promoción aplicada correctamente a su cuenta!');
      
      // En producción, aquí iría una llamada a la API
      /* 
      const response = await fetch('/api/promotions/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ promotionId: selectedPromotion.id })
      });
      
      if (!response.ok) throw new Error('Error al aplicar promoción');
      
      const data = await response.json();
      setAppliedPromotions([...appliedPromotions, data]);
      */
      
      // Limpiar selección
      setSelectedPromotion(null);
      setPromoCode('');
    } catch (error) {
      console.error('Error applying promotion:', error);
      toast.error('Error al aplicar la promoción. Intente nuevamente.');
    } finally {
      setVerifying(false);
    }
  };
  
  const copyPromoCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Código copiado al portapapeles');
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  if (loading) {
    return (
      <div className="animate-pulse p-6">
        <div className="h-8 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <h2 className="text-xl font-bold">Promociones y Descuentos</h2>
        <p className="text-sm text-blue-100 mt-1">Aproveche nuestras ofertas exclusivas para servicios legales</p>
      </div>
      
      {/* Verificador de código promocional */}
      <div className="p-5 bg-blue-50 border-b border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3">
          <div className="flex-grow">
            <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-1">
              Tengo un código promocional
            </label>
            <input
              type="text"
              id="promoCode"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Ingrese su código"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleVerifyCode}
              disabled={verifying || !promoCode.trim()}
              className={`w-full md:w-auto mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none ${verifying || !promoCode.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {verifying ? 'Verificando...' : 'Verificar Código'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Promoción seleccionada */}
      {selectedPromotion && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="p-5 bg-green-50 border-b border-green-100"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-green-800 flex items-center">
                <FaCheckCircle className="mr-2 text-green-600" />
                {selectedPromotion.title}
              </h3>
              <p className="text-sm text-green-700 mt-1">{selectedPromotion.description}</p>
              <div className="mt-2 flex items-center text-green-800 text-sm">
                <FaClock className="mr-1" /> Válido hasta: {formatDate(selectedPromotion.validUntil)}
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleApplyPromotion}
                disabled={verifying}
                className={`px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none ${verifying ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {verifying ? 'Aplicando...' : 'Aplicar Promoción'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Promociones disponibles */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaTag className="mr-2 text-blue-600" />
          Promociones Disponibles
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activePromotions.map((promotion) => (
            <motion.div
              key={promotion.id}
              whileHover={{ scale: 1.02 }}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="h-40 bg-gray-100 relative overflow-hidden">
                <img 
                  src={promotion.imageUrl || '/images/promotions/default.jpg'} 
                  alt={promotion.title}
                  className="w-full h-full object-cover"
                />
                {promotion.discountType === 'percentage' && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white rounded-full h-14 w-14 flex items-center justify-center text-lg font-bold">
                    -{promotion.discountValue}%
                  </div>
                )}
                {promotion.discountType === 'bonus' && (
                  <div className="absolute top-3 right-3 bg-purple-600 text-white rounded-full h-14 w-14 flex items-center justify-center text-lg font-bold">
                    +{promotion.discountValue}
                  </div>
                )}
                {promotion.discountType === 'twoforone' && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full h-14 w-14 flex items-center justify-center text-sm font-bold">
                    2x1
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h4 className="text-lg font-medium text-gray-900">{promotion.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{promotion.description}</p>
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">Código:</span>
                    <span className="text-sm font-mono font-medium bg-gray-100 px-2 py-0.5 rounded">{promotion.code}</span>
                    <button 
                      onClick={() => copyPromoCode(promotion.code)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaCopy size={14} />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">Hasta: {formatDate(promotion.validUntil)}</span>
                </div>
                
                <button
                  onClick={() => handleSelectPromotion(promotion)}
                  className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none text-sm"
                >
                  Seleccionar Promoción
                </button>
                
                {promotion.restrictions && (
                  <p className="mt-3 text-xs text-gray-500 italic">
                    <FaInfoCircle className="inline mr-1" /> {promotion.restrictions}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Promociones aplicadas */}
      <div className="p-5 bg-gray-50 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaGift className="mr-2 text-purple-600" />
          Mis Promociones Aplicadas
        </h3>
        
        {appliedPromotions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promoción</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aplicada</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expira</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uso</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appliedPromotions.map((promo) => (
                  <tr key={promo.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{promo.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{promo.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(promo.appliedDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(promo.expiryDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${promo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {promo.status === 'active' ? 'Activa' : 'Utilizada'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{promo.usedIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6">
            <FaTimesCircle className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-gray-500">No tienes promociones aplicadas actualmente</p>
            <p className="text-sm text-gray-400 mt-1">Selecciona una promoción de la lista o ingresa un código promocional</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionsManager;

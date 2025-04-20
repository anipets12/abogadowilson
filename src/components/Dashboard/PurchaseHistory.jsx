import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaBook, 
  FaCoins, 
  FaDownload, 
  FaFileAlt, 
  FaGraduationCap, 
  FaPlay, 
  FaReceipt, 
  FaSearch, 
  FaShoppingCart, 
  FaSort, 
  FaSortAmountDown 
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

import { dataService } from '../../services/supabaseService';
import { useAuth } from '../../context/AuthContext';

// Datos de muestra para el historial de compras
const SAMPLE_PURCHASES = [
  {
    id: 'purchase-1',
    type: 'course',
    item_id: 'curso-derecho-penal-1',
    title: 'Fundamentos de Derecho Penal',
    amount: 49.99,
    date: '2025-03-15',
    status: 'completed',
    payment_method: 'paypal',
    invoice_url: '#',
    thumbnail: '/images/courses/derecho-penal.jpg'
  },
  {
    id: 'purchase-2',
    type: 'course',
    item_id: 'masterclass-litigacion-1',
    title: 'Masterclass: Técnicas de Litigación Oral',
    amount: 79.99,
    date: '2025-02-10',
    status: 'completed',
    payment_method: 'bank_transfer',
    invoice_url: '#',
    thumbnail: '/images/courses/litigacion.jpg'
  },
  {
    id: 'purchase-3',
    type: 'ebook',
    item_id: 'ebook-guia-penal-1',
    title: 'Guía Práctica de Derecho Penal',
    amount: 19.99,
    date: '2025-01-20',
    status: 'completed',
    payment_method: 'paypal',
    invoice_url: '#',
    thumbnail: '/images/ebooks/guia-penal.jpg'
  },
  {
    id: 'purchase-4',
    type: 'tokens',
    item_id: 'token-package-standard',
    title: 'Paquete de 10 Tokens',
    amount: 45.00,
    date: '2025-04-05',
    status: 'completed',
    payment_method: 'paypal',
    invoice_url: '#',
    thumbnail: '/images/tokens/token-package.jpg',
    details: {
      token_count: 10
    }
  },
  {
    id: 'purchase-5',
    type: 'consultation',
    item_id: 'consultation-1',
    title: 'Consulta de Derecho Laboral',
    amount: 59.99,
    date: '2025-03-28',
    status: 'completed',
    payment_method: 'tokens',
    invoice_url: '#',
    thumbnail: '/images/consultations/labor-law.jpg',
    details: {
      token_cost: 5,
      scheduled_date: '2025-04-02'
    }
  },
  {
    id: 'purchase-6',
    type: 'course',
    item_id: 'curso-transito-1',
    title: 'Infracciones de Tránsito y Defensa',
    amount: 39.99,
    date: '2025-04-10',
    status: 'completed',
    payment_method: 'paypal',
    invoice_url: '#',
    thumbnail: '/images/courses/transito.jpg'
  }
];

const PurchaseCard = ({ purchase }) => {
  // Renderizar icono según el tipo de compra
  const renderIcon = () => {
    switch (purchase.type) {
      case 'course':
        return <FaGraduationCap className="text-blue-500" size={20} />;
      case 'ebook':
        return <FaBook className="text-green-500" size={20} />;
      case 'tokens':
        return <FaCoins className="text-yellow-500" size={20} />;
      case 'consultation':
        return <FaFileAlt className="text-purple-500" size={20} />;
      default:
        return <FaShoppingCart className="text-gray-500" size={20} />;
    }
  };
  
  // Renderizar acción según el tipo de compra
  const renderAction = () => {
    switch (purchase.type) {
      case 'course':
        return (
          <Link 
            to={`/dashboard/cursos/${purchase.item_id}/learn`}
            className="flex items-center justify-center p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaPlay size={14} className="mr-1" /> Ver curso
          </Link>
        );
      case 'ebook':
        return (
          <Link 
            to={`/dashboard/ebooks/${purchase.item_id}`}
            className="flex items-center justify-center p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FaDownload size={14} className="mr-1" /> Descargar
          </Link>
        );
      case 'tokens':
        return (
          <Link 
            to="/tokens"
            className="flex items-center justify-center p-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            <FaCoins size={14} className="mr-1" /> Comprar más
          </Link>
        );
      case 'consultation':
        return (
          <Link 
            to="/dashboard/citas"
            className="flex items-center justify-center p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <FaFileAlt size={14} className="mr-1" /> Ver cita
          </Link>
        );
      default:
        return (
          <button
            onClick={() => toast.success('Factura descargada')}
            className="flex items-center justify-center p-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            <FaReceipt size={14} className="mr-1" /> Factura
          </button>
        );
    }
  };
  
  // Formatear tipo
  const formatType = (type) => {
    switch (type) {
      case 'course':
        return 'Curso';
      case 'ebook':
        return 'E-book';
      case 'tokens':
        return 'Tokens';
      case 'consultation':
        return 'Consulta';
      default:
        return type;
    }
  };
  
  // Formatear método de pago
  const formatPaymentMethod = (method) => {
    switch (method) {
      case 'paypal':
        return 'PayPal';
      case 'bank_transfer':
        return 'Transferencia bancaria';
      case 'tokens':
        return 'Tokens';
      default:
        return method;
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          {renderIcon()}
          <span className="ml-2 text-sm font-medium text-gray-600">
            {formatType(purchase.type)}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {formatDate(purchase.date)}
        </span>
      </div>
      
      <div className="flex items-center p-4">
        <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-md overflow-hidden">
          <img 
            src={purchase.thumbnail || "/images/placeholder.jpg"} 
            alt={purchase.title}
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="ml-4 flex-grow">
          <h3 className="font-medium text-gray-900">{purchase.title}</h3>
          <div className="flex flex-wrap mt-1 gap-2">
            <span className="text-sm text-gray-500">
              ${purchase.amount.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">
              • {formatPaymentMethod(purchase.payment_method)}
            </span>
            {purchase.type === 'tokens' && purchase.details?.token_count && (
              <span className="text-sm text-gray-500">
                • {purchase.details.token_count} tokens
              </span>
            )}
          </div>
        </div>
        
        <div className="ml-4">
          {renderAction()}
        </div>
      </div>
    </motion.div>
  );
};

const PurchaseHistory = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) return;
      
      try {
        // En una aplicación real, obtendríamos las compras desde Supabase
        // const { data, error } = await dataService.query(
        //   'purchases',
        //   q => q.eq('user_id', user.id).eq('status', 'completed')
        // );
        // if (error) throw error;
        
        // Por ahora, usamos datos de muestra
        setTimeout(() => {
          setPurchases(SAMPLE_PURCHASES);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error al obtener historial de compras:', error);
        toast.error('Error al cargar tu historial de compras');
        setLoading(false);
      }
    };
    
    fetchPurchases();
  }, [user]);
  
  // Aplicar filtros y ordenamiento
  const filteredAndSortedPurchases = purchases
    .filter(purchase => {
      const matchesSearch = purchase.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || purchase.type === filterType;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'oldest') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'price-high') {
        return b.amount - a.amount;
      } else if (sortBy === 'price-low') {
        return a.amount - b.amount;
      }
      return 0;
    });
  
  // Calcular el gasto total
  const totalSpent = purchases.reduce((total, purchase) => total + purchase.amount, 0);
  
  // Contar las compras por tipo
  const countByType = purchases.reduce((acc, purchase) => {
    acc[purchase.type] = (acc[purchase.type] || 0) + 1;
    return acc;
  }, {});
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Historial de Compras</h2>
          <p className="text-gray-600">
            Total gastado: <span className="font-medium">${totalSpent.toFixed(2)}</span>
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          {/* Buscador */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar compras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-48"
            />
          </div>
          
          {/* Filtro por tipo */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="all">Todos</option>
            <option value="course">Cursos</option>
            <option value="ebook">E-books</option>
            <option value="tokens">Tokens</option>
            <option value="consultation">Consultas</option>
          </select>
          
          {/* Ordenar por */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="recent">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="price-high">Mayor precio</option>
            <option value="price-low">Menor precio</option>
          </select>
        </div>
      </div>
      
      {/* Resumen de compras */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center text-blue-600 mb-2">
            <FaGraduationCap className="mr-2" />
            <span className="font-medium">Cursos</span>
          </div>
          <div className="text-2xl font-bold">{countByType.course || 0}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center text-green-600 mb-2">
            <FaBook className="mr-2" />
            <span className="font-medium">E-books</span>
          </div>
          <div className="text-2xl font-bold">{countByType.ebook || 0}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center text-yellow-600 mb-2">
            <FaCoins className="mr-2" />
            <span className="font-medium">Tokens</span>
          </div>
          <div className="text-2xl font-bold">{countByType.tokens || 0}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center text-purple-600 mb-2">
            <FaFileAlt className="mr-2" />
            <span className="font-medium">Consultas</span>
          </div>
          <div className="text-2xl font-bold">{countByType.consultation || 0}</div>
        </div>
      </div>
      
      {filteredAndSortedPurchases.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <FaReceipt className="mx-auto text-gray-400 text-4xl mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No hay compras</h3>
          {searchTerm || filterType !== 'all' ? (
            <p className="text-gray-500 mb-6">
              No se encontraron compras que coincidan con tu búsqueda. Intenta con otros filtros.
            </p>
          ) : (
            <p className="text-gray-500 mb-6">
              Aún no has realizado ninguna compra. Explora nuestro catálogo para comenzar.
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-3">
            <Link 
              to="/cursos" 
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <FaGraduationCap className="mr-2" /> Ver Cursos
            </Link>
            <Link 
              to="/ebooks" 
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <FaBook className="mr-2" /> Ver E-books
            </Link>
            <Link 
              to="/tokens" 
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
            >
              <FaCoins className="mr-2" /> Comprar Tokens
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedPurchases.map(purchase => (
            <PurchaseCard key={purchase.id} purchase={purchase} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;

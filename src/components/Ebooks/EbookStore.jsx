import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { FaBook, FaLock, FaUnlock, FaDownload, FaCoins, FaSearch, FaFilter } from 'react-icons/fa';

const EbookStore = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ebooks, setEbooks] = useState([]);
  const [userEbooks, setUserEbooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredEbooks, setFilteredEbooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [tokens, setTokens] = useState(0);
  const [currentView, setCurrentView] = useState('store'); // 'store' or 'library'
  
  useEffect(() => {
    fetchEbooks();
    fetchCategories();
    
    if (user) {
      fetchUserEbooks();
      fetchUserTokens();
    }
  }, [user]);
  
  useEffect(() => {
    // Filtrar e-books basado en la búsqueda y categoría
    filterEbooks();
  }, [searchTerm, selectedCategory, ebooks]);
  
  const fetchEbooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ebooks');
      
      if (!response.ok) {
        throw new Error('Error al cargar los e-books');
      }
      
      const data = await response.json();
      setEbooks(data);
      setFilteredEbooks(data);
    } catch (error) {
      console.error('Error fetching ebooks:', error);
      // Datos de fallback para desarrollo
      const fallbackData = [
        {
          id: 1,
          title: 'Guía Legal para Emprendedores',
          description: 'Todo lo que necesitas saber para iniciar tu negocio desde una perspectiva legal.',
          author: 'Wilson Alexander Ipiales Guerrón',
          price: 25,
          tokenPrice: 30,
          category: 'emprendimiento',
          coverImage: '/images/ebooks/ebook-emprendedores.jpg',
          pageCount: 120,
          releaseDate: '2025-01-15',
          isFree: false
        },
        {
          id: 2,
          title: 'Derechos Fundamentales: Lo que Debes Saber',
          description: 'Una guía completa sobre los derechos fundamentales y cómo protegerlos en el sistema legal ecuatoriano.',
          author: 'Wilson Alexander Ipiales Guerrón',
          price: 19.99,
          tokenPrice: 25,
          category: 'derechos',
          coverImage: '/images/ebooks/ebook-derechos.jpg',
          pageCount: 85,
          releaseDate: '2025-02-10',
          isFree: false
        },
        {
          id: 3,
          title: 'Derecho de Familia: Guía Práctica',
          description: 'Aprende todo sobre el derecho de familia, divorcios, custodia de hijos y pensiones alimenticias.',
          author: 'Wilson Alexander Ipiales Guerrón',
          price: 22.50,
          tokenPrice: 28,
          category: 'familia',
          coverImage: '/images/ebooks/ebook-familia.jpg',
          pageCount: 110,
          releaseDate: '2025-03-05',
          isFree: false
        },
        {
          id: 4,
          title: 'Contratos Civiles y Mercantiles',
          description: 'Todo sobre contratos, cláusulas, términos legales y su aplicación práctica en el mundo empresarial.',
          author: 'Wilson Alexander Ipiales Guerrón',
          price: 29.99,
          tokenPrice: 35,
          category: 'contratos',
          coverImage: '/images/ebooks/ebook-contratos.jpg',
          pageCount: 150,
          releaseDate: '2025-01-30',
          isFree: false
        },
        {
          id: 5,
          title: 'Introducción al Derecho Penal',
          description: 'Conceptos básicos del derecho penal para entender el sistema de justicia criminal.',
          author: 'Wilson Alexander Ipiales Guerrón',
          price: 0,
          tokenPrice: 0,
          category: 'penal',
          coverImage: '/images/ebooks/ebook-penal.jpg',
          pageCount: 50,
          releaseDate: '2024-12-20',
          isFree: true
        }
      ];
      
      setEbooks(fallbackData);
      setFilteredEbooks(fallbackData);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/ebooks/categories');
      
      if (!response.ok) {
        throw new Error('Error al cargar categorías');
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Datos de fallback para desarrollo
      setCategories([
        { id: 'all', name: 'Todas las categorías' },
        { id: 'emprendimiento', name: 'Emprendimiento' },
        { id: 'derechos', name: 'Derechos Fundamentales' },
        { id: 'familia', name: 'Derecho de Familia' },
        { id: 'contratos', name: 'Contratos' },
        { id: 'penal', name: 'Derecho Penal' },
        { id: 'laboral', name: 'Derecho Laboral' }
      ]);
    }
  };
  
  const fetchUserEbooks = async () => {
    try {
      const response = await fetch('/api/ebooks/user', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar tus e-books');
      }
      
      const data = await response.json();
      setUserEbooks(data);
    } catch (error) {
      console.error('Error fetching user ebooks:', error);
      // Datos de fallback para desarrollo
      setUserEbooks([
        {
          id: 2,
          title: 'Derechos Fundamentales: Lo que Debes Saber',
          coverImage: '/images/ebooks/ebook-derechos.jpg',
          progress: 30,
          downloadedAt: '2025-04-10T15:30:00'
        },
        {
          id: 5,
          title: 'Introducción al Derecho Penal',
          coverImage: '/images/ebooks/ebook-penal.jpg',
          progress: 75,
          downloadedAt: '2025-04-05T09:45:00'
        }
      ]);
    }
  };
  
  const fetchUserTokens = async () => {
    try {
      const response = await fetch('/api/tokens/balance', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener saldo de tokens');
      }
      
      const data = await response.json();
      setTokens(data.balance);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      // Valor de fallback para desarrollo
      setTokens(50);
    }
  };
  
  const filterEbooks = () => {
    let filtered = [...ebooks];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(ebook => 
        ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ebook.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ebook.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ebook => ebook.category === selectedCategory);
    }
    
    setFilteredEbooks(filtered);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  
  const handlePurchase = async (ebook, paymentMethod) => {
    if (!user) {
      toast.error('Debes iniciar sesión para comprar e-books');
      return;
    }
    
    if (paymentMethod === 'tokens' && tokens < ebook.tokenPrice) {
      toast.error(`No tienes suficientes tokens. Necesitas ${ebook.tokenPrice} tokens.`);
      return;
    }
    
    try {
      const response = await fetch('/api/ebooks/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          ebookId: ebook.id,
          paymentMethod
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la compra del e-book');
      }
      
      const data = await response.json();
      
      // Actualizar lista de e-books del usuario
      fetchUserEbooks();
      
      // Si pagó con tokens, actualizar el saldo
      if (paymentMethod === 'tokens') {
        fetchUserTokens();
      }
      
      // Mostrar mensaje de éxito
      toast.success(`¡E-book "${ebook.title}" adquirido con éxito!`);
      
      // Para fines de demo/desarrollo, simular la compra
      setUserEbooks(prev => {
        // Verificar si ya existe
        if (prev.some(book => book.id === ebook.id)) {
          return prev;
        }
        
        // Agregarlo a la lista
        return [...prev, {
          id: ebook.id,
          title: ebook.title,
          coverImage: ebook.coverImage,
          progress: 0,
          downloadedAt: new Date().toISOString()
        }];
      });
      
      if (paymentMethod === 'tokens') {
        setTokens(prev => prev - ebook.tokenPrice);
      }
      
    } catch (error) {
      console.error('Error purchasing ebook:', error);
      toast.error(error.message || 'Error al procesar la compra. Inténtalo de nuevo.');
    }
  };
  
  const handleDownload = (ebook) => {
    toast.success(`Descargando "${ebook.title}"...`);
    // Aquí se implementaría la lógica real de descarga
    
    // Para fines de demo, simulamos la actualización del progreso
    setTimeout(() => {
      toast.success(`¡E-book "${ebook.title}" descargado correctamente!`);
    }, 2000);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  const isEbookOwned = (ebookId) => {
    return userEbooks.some(userEbook => userEbook.id === ebookId);
  };
  
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">Biblioteca Legal Digital</h1>
        
        {user && (
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView('store')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${currentView === 'store' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Tienda de E-Books
            </button>
            <button
              onClick={() => setCurrentView('library')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${currentView === 'library' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Mi Biblioteca
            </button>
          </div>
        )}
      </div>
      
      {currentView === 'store' ? (
        <>
          {/* Filtros y búsqueda */}
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar E-Books
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Título, autor o descripción..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-auto">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFilter className="text-gray-400" />
                  </div>
                  <select
                    id="category"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {user && (
              <div className="mt-4 bg-blue-50 p-3 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <FaCoins className="text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-blue-800">Tokens disponibles: <span className="font-bold">{tokens}</span></span>
                </div>
                <Link to="/dashboard/tokens" className="text-xs text-blue-600 hover:text-blue-800 hover:underline">
                  Comprar más tokens
                </Link>
              </div>
            )}
          </div>
          
          {/* Lista de E-Books */}
          {filteredEbooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEbooks.map((ebook) => (
                <div 
                  key={ebook.id} 
                  className={`bg-white border rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-lg ${isEbookOwned(ebook.id) ? 'border-green-500' : 'border-gray-200'}`}
                >
                  <div className="relative h-48 overflow-hidden">
                    {ebook.coverImage ? (
                      <img 
                        src={ebook.coverImage} 
                        alt={ebook.title}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <FaBook className="text-4xl text-gray-400" />
                      </div>
                    )}
                    {ebook.isFree && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        GRATIS
                      </div>
                    )}
                    {isEbookOwned(ebook.id) && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                        <FaUnlock className="mr-1" /> ADQUIRIDO
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{ebook.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{ebook.author}</p>
                    <div className="mt-2 flex items-center text-xs text-gray-500 space-x-3">
                      <span>{ebook.pageCount} páginas</span>
                      <span>•</span>
                      <span>Publicado: {formatDate(ebook.releaseDate)}</span>
                    </div>
                    <p className="mt-3 text-sm text-gray-700 line-clamp-3">{ebook.description}</p>
                    
                    {isEbookOwned(ebook.id) ? (
                      <button
                        onClick={() => handleDownload(ebook)}
                        className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <FaDownload className="mr-2" /> Descargar
                      </button>
                    ) : (
                      <div className="mt-4">
                        {ebook.isFree ? (
                          <button
                            onClick={() => handlePurchase(ebook, 'free')}
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Obtener Gratis
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span className="text-xl font-bold text-gray-900">${ebook.price.toFixed(2)}</span>
                                <span className="ml-2 text-xs text-gray-500">o</span>
                                <div className="ml-2 flex items-center text-blue-600">
                                  <FaCoins className="text-yellow-500 mr-1" />
                                  <span>{ebook.tokenPrice}</span>
                                </div>
                              </div>
                              <Link 
                                to={`/ebooks/${ebook.id}`}
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                Detalles
                              </Link>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handlePurchase(ebook, 'card')}
                                className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={!user}
                              >
                                Comprar
                              </button>
                              <button
                                onClick={() => handlePurchase(ebook, 'tokens')}
                                className={`inline-flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-md ${tokens >= ebook.tokenPrice ? 'text-white bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' : 'text-gray-400 bg-gray-200 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                disabled={!user || tokens < ebook.tokenPrice}
                              >
                                <FaCoins className="mr-1" /> Usar Tokens
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaBook className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron e-books</h3>
              <p className="mt-1 text-sm text-gray-500">Intenta con otros términos de búsqueda o categorías.</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Mi Biblioteca */}
          {userEbooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userEbooks.map((ebook) => (
                <div key={ebook.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-lg">
                  <div className="relative h-48 overflow-hidden">
                    {ebook.coverImage ? (
                      <img 
                        src={ebook.coverImage} 
                        alt={ebook.title}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <FaBook className="text-4xl text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{ebook.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Añadido: {formatDate(ebook.downloadedAt)}</p>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Progreso: {ebook.progress}%</span>
                        <span>{ebook.progress < 100 ? 'En curso' : 'Completado'}</span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${ebook.progress < 100 ? 'bg-blue-600' : 'bg-green-600'} h-2 rounded-full`} 
                          style={{ width: `${ebook.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleDownload(ebook)}
                        className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FaDownload className="mr-1" /> Descargar
                      </button>
                      <Link 
                        to={`/dashboard/ebooks/${ebook.id}`}
                        className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Leer Online
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaBook className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Tu biblioteca está vacía</h3>
              <p className="mt-1 text-sm text-gray-500">Adquiere e-books en nuestra tienda para comenzar tu colección.</p>
              <button
                onClick={() => setCurrentView('store')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Ir a la tienda
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EbookStore;

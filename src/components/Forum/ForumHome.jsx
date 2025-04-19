import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaComments, FaSearch, FaFilter, FaPlus, FaEye, FaComment, FaThumbsUp, FaClock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const ForumHome = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  useEffect(() => {
    fetchTopics();
    fetchCategories();
  }, []);
  
  useEffect(() => {
    filterTopics();
  }, [searchTerm, selectedCategory, topics]);
  
  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/forum/topics');
      
      if (!response.ok) {
        throw new Error('Error al cargar los temas del foro');
      }
      
      const data = await response.json();
      setTopics(data);
      setFilteredTopics(data);
    } catch (error) {
      console.error('Error fetching forum topics:', error);
      
      // Datos de fallback para desarrollo
      const fallbackData = [
        {
          id: 1,
          title: 'Pasos para impugnar una multa de tránsito incorrecta',
          content: 'Recientemente recibí una multa por supuestamente pasarme un semáforo en rojo, pero yo estoy seguro que estaba en verde...',
          author: {
            id: 101,
            name: 'Carlos Mendoza',
            avatar: '/images/avatars/user1.jpg'
          },
          category: 'transito',
          date: '2025-04-18T15:30:00',
          views: 124,
          replies: 8,
          likes: 15,
          isSolved: false,
          isSticky: false,
          lastActivityDate: '2025-04-19T10:15:00'
        },
        {
          id: 2,
          title: 'Consulta sobre régimen de visitas en caso de divorcio',
          content: 'Me acabo de divorciar y tenemos dos hijos. Quiero saber cuáles son mis derechos respecto a las visitas y cómo establec...',
          author: {
            id: 102,
            name: 'María Torres',
            avatar: '/images/avatars/user2.jpg'
          },
          category: 'familia',
          date: '2025-04-16T09:45:00',
          views: 98,
          replies: 12,
          likes: 7,
          isSolved: true,
          isSticky: false,
          lastActivityDate: '2025-04-18T14:20:00'
        },
        {
          id: 3,
          title: '[IMPORTANTE] Cambios en la legislación laboral 2025',
          content: 'Resumen de los principales cambios en la legislación laboral que entran en vigor a partir de mayo de 2025...',
          author: {
            id: 1,
            name: 'Wilson Alexander Ipiales Guerrón',
            avatar: '/images/avatars/admin.jpg',
            isAdmin: true
          },
          category: 'laboral',
          date: '2025-04-15T11:00:00',
          views: 562,
          replies: 34,
          likes: 87,
          isSolved: false,
          isSticky: true,
          lastActivityDate: '2025-04-19T09:30:00'
        },
        {
          id: 4,
          title: 'Requisitos para constitución de empresa unipersonal',
          content: 'Estoy pensando en formalizar mi negocio como empresa unipersonal. ¿Cuáles son los requisitos y pasos a seguir?...',
          author: {
            id: 103,
            name: 'Roberto Sánchez',
            avatar: '/images/avatars/user3.jpg'
          },
          category: 'empresarial',
          date: '2025-04-14T16:20:00',
          views: 76,
          replies: 5,
          likes: 9,
          isSolved: true,
          isSticky: false,
          lastActivityDate: '2025-04-17T08:45:00'
        },
        {
          id: 5,
          title: 'Procedimiento para denunciar acoso laboral',
          content: 'Llevo varios meses sufriendo lo que considero acoso laboral por parte de mi supervisor. ¿Cómo puedo proceder legalmente?...',
          author: {
            id: 104,
            name: 'Lucía Moreno',
            avatar: '/images/avatars/user4.jpg'
          },
          category: 'laboral',
          date: '2025-04-12T13:10:00',
          views: 187,
          replies: 19,
          likes: 23,
          isSolved: false,
          isSticky: false,
          lastActivityDate: '2025-04-18T19:05:00'
        },
        {
          id: 6,
          title: 'Derechos en caso de detención policial',
          content: 'Me gustaría saber exactamente cuáles son mis derechos si alguna vez soy detenido por la policía y qué debo hacer...',
          author: {
            id: 105,
            name: 'Javier López',
            avatar: '/images/avatars/user5.jpg'
          },
          category: 'penal',
          date: '2025-04-10T10:25:00',
          views: 243,
          replies: 15,
          likes: 31,
          isSolved: true,
          isSticky: false,
          lastActivityDate: '2025-04-15T17:30:00'
        }
      ];
      
      setTopics(fallbackData);
      setFilteredTopics(fallbackData);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/forum/categories');
      
      if (!response.ok) {
        throw new Error('Error al cargar categorías del foro');
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching forum categories:', error);
      
      // Datos de fallback para desarrollo
      setCategories([
        { id: 'all', name: 'Todas las categorías' },
        { id: 'transito', name: 'Derecho de Tránsito' },
        { id: 'penal', name: 'Derecho Penal' },
        { id: 'familia', name: 'Derecho de Familia' },
        { id: 'laboral', name: 'Derecho Laboral' },
        { id: 'empresarial', name: 'Derecho Empresarial' },
        { id: 'civil', name: 'Derecho Civil' },
        { id: 'administrativo', name: 'Derecho Administrativo' },
        { id: 'general', name: 'Consultas Generales' }
      ]);
    }
  };
  
  const filterTopics = () => {
    let filtered = [...topics];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(topic => 
        topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(topic => topic.category === selectedCategory);
    }
    
    // Ordenar temas: primero los fijados, luego por fecha de actividad
    filtered.sort((a, b) => {
      if (a.isSticky && !b.isSticky) return -1;
      if (!a.isSticky && b.isSticky) return 1;
      return new Date(b.lastActivityDate) - new Date(a.lastActivityDate);
    });
    
    setFilteredTopics(filtered);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `hace ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
      }
      return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffDays === 1) {
      return 'ayer';
    } else if (diffDays < 7) {
      return `hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  };
  
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  const getCategoryColor = (categoryId) => {
    const colors = {
      transito: 'bg-yellow-100 text-yellow-800',
      penal: 'bg-red-100 text-red-800',
      familia: 'bg-pink-100 text-pink-800',
      laboral: 'bg-blue-100 text-blue-800',
      empresarial: 'bg-purple-100 text-purple-800',
      civil: 'bg-green-100 text-green-800',
      administrativo: 'bg-orange-100 text-orange-800',
      general: 'bg-gray-100 text-gray-800'
    };
    
    return colors[categoryId] || 'bg-gray-100 text-gray-800';
  };
  
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="h-12 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Foro Legal</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Expón tus dudas legales y recibe orientación de profesionales y la comunidad
          </p>
        </div>
        
        {/* Filtros y búsqueda */}
        <div className="mt-10 bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar en el Foro
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Buscar por título o contenido..."
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
            
            <div className="md:ml-4">
              <Link 
                to="/forum/new"
                className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaPlus className="mr-2" /> Nuevo Tema
              </Link>
            </div>
          </div>
        </div>
        
        {/* Lista de temas */}
        <div className="mt-8">
          {filteredTopics.length > 0 ? (
            <div className="overflow-hidden border border-gray-200 sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredTopics.map((topic) => (
                  <li key={topic.id} className={`${topic.isSticky ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50`}>
                    <Link to={`/forum/topic/${topic.id}`} className="block">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {topic.isSticky && (
                              <div className="flex-shrink-0">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  DESTACADO
                                </span>
                              </div>
                            )}
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {topic.title}
                            </p>
                          </div>
                          <div className="flex-shrink-0 flex">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(topic.category)}`}>
                              {getCategoryName(topic.category)}
                            </span>
                            {topic.isSolved && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                RESUELTO
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <img 
                                src={topic.author.avatar || '/images/avatars/default.jpg'} 
                                alt={topic.author.name}
                                className="flex-shrink-0 mr-1.5 h-5 w-5 rounded-full"
                              />
                              {topic.author.name}
                              {topic.author.isAdmin && (
                                <span className="ml-1 text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                                  ADMIN
                                </span>
                              )}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              <FaClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {formatDate(topic.date)}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 space-x-4">
                            <p className="flex items-center">
                              <FaEye className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {topic.views}
                            </p>
                            <p className="flex items-center">
                              <FaComment className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {topic.replies}
                            </p>
                            <p className="flex items-center">
                              <FaThumbsUp className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {topic.likes}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {topic.content}
                          </p>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Última actividad: {formatDate(topic.lastActivityDate)}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaComments className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron temas</h3>
              <p className="mt-1 text-sm text-gray-500">Intenta con otros términos de búsqueda o crea un nuevo tema.</p>
              <div className="mt-6">
                <Link 
                  to="/forum/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaPlus className="mr-2" /> Nuevo Tema
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Información del foro */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-medium text-blue-800 mb-4">Normas del Foro Legal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-blue-700 mb-2">Lo que debes hacer:</h3>
              <ul className="text-sm text-blue-600 space-y-1 pl-5 list-disc">
                <li>Describir tu situación legal con claridad y precisión</li>
                <li>Respetar a todos los miembros de la comunidad</li>
                <li>Utilizar un lenguaje apropiado y profesional</li>
                <li>Marcar como resuelto cuando tu consulta haya sido respondida satisfactoriamente</li>
                <li>Revisar si tu pregunta ya ha sido respondida antes de crearla</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-700 mb-2">Lo que no debes hacer:</h3>
              <ul className="text-sm text-blue-600 space-y-1 pl-5 list-disc">
                <li>Compartir información personal sensible (números de documentos, direcciones exactas)</li>
                <li>Publicar contenido ofensivo, discriminatorio o inapropiado</li>
                <li>Hacer spam o publicar anuncios no relacionados</li>
                <li>Crear múltiples temas para la misma consulta</li>
                <li>Compartir capturas de pantalla con información confidencial</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 text-sm text-blue-700 border-t border-blue-200 pt-4">
            <p><strong>Importante:</strong> Recuerda que las respuestas y comentarios en este foro no constituyen asesoramiento legal formal. Para casos específicos, te recomendamos agendar una consulta profesional.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumHome;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaDownload, FaCertificate, FaExclamationCircle, FaBook, FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

import { dataService } from '../../services/supabaseService';
import { useAuth } from '../../context/AuthContext';

// Datos de muestra para cursos comprados
const SAMPLE_PURCHASED_COURSES = [
  {
    id: 'curso-derecho-penal-1',
    title: 'Fundamentos de Derecho Penal',
    description: 'Aprende los principios básicos del Derecho Penal ecuatoriano.',
    imageUrl: '/images/courses/derecho-penal.jpg',
    instructor: 'Abg. Wilson Ipiales',
    category: 'Derecho Penal',
    duration: '10 horas',
    progress: 35,
    purchaseDate: '2025-03-15',
    expiryDate: null, // null significa acceso de por vida
    certificateAvailable: false,
    lastAccessed: '2025-04-18'
  },
  {
    id: 'masterclass-litigacion-1',
    title: 'Masterclass: Técnicas de Litigación Oral',
    description: 'Aprende técnicas avanzadas de litigación oral para destacar en audiencias y juicios.',
    imageUrl: '/images/courses/litigacion.jpg',
    instructor: 'Abg. Wilson Ipiales',
    category: 'Litigación',
    duration: '8 horas',
    progress: 100,
    purchaseDate: '2025-02-10',
    expiryDate: null,
    certificateAvailable: true,
    lastAccessed: '2025-03-25'
  },
  {
    id: 'curso-transito-1',
    title: 'Infracciones de Tránsito y Defensa',
    description: 'Guía completa sobre infracciones de tránsito y defensa legal.',
    imageUrl: '/images/courses/transito.jpg',
    instructor: 'Abg. Wilson Ipiales',
    category: 'Derecho de Tránsito',
    duration: '7 horas',
    progress: 0,
    purchaseDate: '2025-04-10',
    expiryDate: null,
    certificateAvailable: false,
    lastAccessed: null
  }
];

const CourseCard = ({ course }) => {
  const getStatusBadge = () => {
    if (course.progress === 100) {
      return (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          Completado
        </span>
      );
    } else if (course.progress > 0) {
      return (
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          En progreso
        </span>
      );
    } else {
      return (
        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
          No iniciado
        </span>
      );
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
    >
      <div className="relative">
        <img 
          src={course.imageUrl || "/images/courses/default.jpg"} 
          alt={course.title} 
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
          <div>
            {getStatusBadge()}
          </div>
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs text-gray-500">
            Comprado el {new Date(course.purchaseDate).toLocaleDateString()}
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {course.category}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="mt-auto">
          {course.progress > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Progreso</span>
                <span className="font-medium">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {course.lastAccessed ? `Último acceso: ${new Date(course.lastAccessed).toLocaleDateString()}` : 'Aún no iniciado'}
            </span>
            
            <div className="flex gap-2">
              {course.certificateAvailable && (
                <button
                  onClick={() => toast.success("Certificado descargado correctamente")}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                  title="Descargar certificado"
                >
                  <FaCertificate />
                </button>
              )}
              
              <Link
                to={`/dashboard/cursos/${course.id}/learn`}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Continuar aprendiendo"
              >
                <FaPlay />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const UserCourses = () => {
  const { user } = useAuth();
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      if (!user) return;
      
      try {
        // En una aplicación real, obtendríamos los cursos desde Supabase
        // const { data: purchases, error } = await dataService.query(
        //   'purchases',
        //   q => q.eq('user_id', user.id).eq('status', 'completed').eq('type', 'course')
        // );
        // if (error) throw error;
        
        // const courseIds = purchases.map(p => p.item_id);
        // const { data: courses, error: coursesError } = await dataService.queryIn('courses', 'id', courseIds);
        // if (coursesError) throw coursesError;
        
        // const coursesWithProgress = courses.map(course => {
        //   const purchase = purchases.find(p => p.item_id === course.id);
        //   return {
        //     ...course,
        //     purchaseDate: purchase.created_at,
        //     progress: purchase.progress || 0,
        //     lastAccessed: purchase.last_accessed
        //   };
        // });
        
        // setPurchasedCourses(coursesWithProgress);
        
        // Por ahora, usamos datos de muestra
        setTimeout(() => {
          setPurchasedCourses(SAMPLE_PURCHASED_COURSES);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error al obtener cursos comprados:', error);
        toast.error('Error al cargar tus cursos. Por favor, intenta nuevamente.');
        setLoading(false);
      }
    };
    
    fetchPurchasedCourses();
  }, [user]);
  
  // Aplicar filtros y ordenamiento
  const filteredAndSortedCourses = purchasedCourses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filterStatus === 'all' || 
        (filterStatus === 'completed' && course.progress === 100) ||
        (filterStatus === 'in-progress' && course.progress > 0 && course.progress < 100) ||
        (filterStatus === 'not-started' && course.progress === 0);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.purchaseDate) - new Date(a.purchaseDate);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'progress') {
        return b.progress - a.progress;
      }
      return 0;
    });
  
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
        <h2 className="text-2xl font-bold text-gray-800">Mis Cursos</h2>
        
        <div className="flex flex-col md:flex-row gap-3">
          {/* Buscador */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
          
          {/* Filtro por estado */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none w-full"
            >
              <option value="all">Todos los cursos</option>
              <option value="completed">Completados</option>
              <option value="in-progress">En progreso</option>
              <option value="not-started">No iniciados</option>
            </select>
          </div>
          
          {/* Ordenar por */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSortAmountDown className="text-gray-400" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none w-full"
            >
              <option value="recent">Más recientes</option>
              <option value="title">Por título</option>
              <option value="progress">Por progreso</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredAndSortedCourses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <FaBook className="mx-auto text-gray-400 text-4xl mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No tienes cursos</h3>
          {searchTerm || filterStatus !== 'all' ? (
            <p className="text-gray-500 mb-6">
              No se encontraron cursos que coincidan con tu búsqueda. Intenta con otros filtros.
            </p>
          ) : (
            <p className="text-gray-500 mb-6">
              Aún no has comprado ningún curso. Explora nuestro catálogo y comienza tu aprendizaje.
            </p>
          )}
          <Link 
            to="/cursos" 
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Ver Cursos Disponibles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCourses;

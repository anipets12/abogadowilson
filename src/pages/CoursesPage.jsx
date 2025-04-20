import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaBookReader, FaGraduationCap, FaPlay, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

import Footer from '../components/Footer/Footer';
import { useCart } from '../context/CartContext';
import { dataService } from '../services/supabaseService';

// Datos de ejemplo para los cursos
const SAMPLE_COURSES = [
  {
    id: 'curso-derecho-penal-1',
    title: 'Fundamentos de Derecho Penal',
    description: 'Aprende los principios básicos del Derecho Penal ecuatoriano. Este curso cubre los conceptos esenciales, legislación actual y análisis de casos prácticos.',
    imageUrl: '/images/courses/derecho-penal.jpg',
    price: 49.99,
    category: 'Derecho Penal',
    duration: '10 horas',
    lessons: 15,
    level: 'Principiante',
    instructor: 'Abg. Wilson Ipiales',
    featured: true,
    popular: true
  },
  {
    id: 'curso-derecho-civil-1',
    title: 'Contratos y Obligaciones',
    description: 'Curso especializado en la redacción, análisis e interpretación de contratos civiles y mercantiles. Incluye plantillas y casos de estudio reales.',
    imageUrl: '/images/courses/contratos.jpg',
    price: 59.99,
    category: 'Derecho Civil',
    duration: '12 horas',
    lessons: 18,
    level: 'Intermedio',
    instructor: 'Abg. Wilson Ipiales',
    featured: false,
    popular: true
  },
  {
    id: 'masterclass-litigacion-1',
    title: 'Masterclass: Técnicas de Litigación Oral',
    description: 'Aprende técnicas avanzadas de litigación oral para destacar en audiencias y juicios. Incluye ejercicios prácticos y simulaciones.',
    imageUrl: '/images/courses/litigacion.jpg',
    price: 79.99,
    category: 'Litigación',
    duration: '8 horas',
    lessons: 10,
    level: 'Avanzado',
    instructor: 'Abg. Wilson Ipiales',
    featured: true,
    popular: false
  },
  {
    id: 'curso-derecho-laboral-1',
    title: 'Derecho Laboral Práctico',
    description: 'Todo lo que necesitas saber sobre relaciones laborales, contratos de trabajo, indemnizaciones y procesos administrativos laborales.',
    imageUrl: '/images/courses/laboral.jpg',
    price: 49.99,
    category: 'Derecho Laboral',
    duration: '9 horas',
    lessons: 14,
    level: 'Intermedio',
    instructor: 'Abg. Wilson Ipiales',
    featured: false,
    popular: false
  },
  {
    id: 'curso-transito-1',
    title: 'Infracciones de Tránsito y Defensa',
    description: 'Guía completa sobre infracciones de tránsito, procedimientos administrativos y defensa legal en casos de accidentes.',
    imageUrl: '/images/courses/transito.jpg',
    price: 39.99,
    category: 'Derecho de Tránsito',
    duration: '7 horas',
    lessons: 12,
    level: 'Principiante',
    instructor: 'Abg. Wilson Ipiales',
    featured: false,
    popular: true
  },
  {
    id: 'masterclass-aduanero-1',
    title: 'Masterclass: Derecho Aduanero',
    description: 'Todo sobre procedimientos aduaneros, importaciones, exportaciones y resolución de conflictos en comercio internacional.',
    imageUrl: '/images/courses/aduanero.jpg',
    price: 89.99,
    category: 'Derecho Aduanero',
    duration: '14 horas',
    lessons: 20,
    level: 'Avanzado',
    instructor: 'Abg. Wilson Ipiales',
    featured: true,
    popular: false
  }
];

const CourseCard = ({ course, addToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative">
        <img 
          src={course.imageUrl || "/images/courses/default.jpg"} 
          alt={course.title} 
          className="w-full h-48 object-cover"
        />
        {course.featured && (
          <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 m-2 rounded">
            Destacado
          </div>
        )}
        {course.popular && (
          <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 m-2 rounded">
            Popular
          </div>
        )}
        <div 
          className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Link 
            to={`/cursos/${course.id}`}
            className="bg-white text-blue-600 rounded-full p-3 transform hover:scale-110 transition-transform"
          >
            <FaPlay />
          </Link>
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
            {course.category}
          </span>
          <span className="text-gray-500 text-sm">{course.level}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <FaGraduationCap className="mr-1" />
          <span className="mr-3">{course.lessons} lecciones</span>
          <FaBookReader className="mr-1" />
          <span>{course.duration}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-3 mt-auto">
          <div className="flex items-center justify-between">
            <span className="text-blue-600 font-bold">${course.price.toFixed(2)}</span>
            <button
              onClick={() => addToCart({
                id: course.id,
                name: course.title,
                price: course.price,
                category: 'Curso',
                imageUrl: course.imageUrl,
                quantity: 1,
                type: 'course'
              })}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <FaShoppingCart className="mr-1" /> Comprar
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // En una aplicación real, obtendríamos los cursos desde Supabase
        // const { data, error } = await dataService.getAll('courses');
        // if (error) throw error;
        // setCourses(data);
        
        // Por ahora, usamos datos de muestra
        setTimeout(() => {
          setCourses(SAMPLE_COURSES);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error al obtener cursos:', error);
        toast.error('Error al cargar los cursos. Por favor, intente nuevamente.');
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  const handleAddToCart = (course) => {
    addToCart(course);
    toast.success(`${course.name} agregado al carrito`);
  };
  
  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'featured' && course.featured) ||
                         (filter === 'popular' && course.popular) ||
                         filter === course.category;
    
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  // Obtener categorías únicas para el filtro
  const categories = [...new Set(courses.map(course => course.category))];
  
  return (
    <>
      <Helmet>
        <title>Cursos y Masterclass | Abg. Wilson Ipiales</title>
        <meta name="description" content="Cursos y masterclass de derecho. Aprenda conceptos legales de manera práctica y efectiva." />
      </Helmet>
      
      <Header />
      
      <main className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Cursos y Masterclass
            </motion.h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Aprenda conceptos legales de manera práctica y efectiva con nuestros cursos especializados. 
              Acceda a contenido premium diseñado por profesionales del derecho.
            </p>
          </div>
          
          <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    filter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilter('featured')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    filter === 'featured' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Destacados
                </button>
                <button
                  onClick={() => setFilter('popular')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    filter === 'popular' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Populares
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                      filter === category 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <FaBook className="mx-auto text-gray-400 text-4xl mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No hay cursos disponibles</h3>
              <p className="text-gray-500">
                No se encontraron cursos que coincidan con tu búsqueda. Por favor, intenta con otros términos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  addToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default CoursesPage;

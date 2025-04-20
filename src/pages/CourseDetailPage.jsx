import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaPlay, FaPlayCircle, FaClock, FaUser, FaChevronDown, FaChevronUp, FaShoppingCart, FaLock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

import Footer from '../components/Footer/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/supabaseService';

// Datos de ejemplo de cursos
const SAMPLE_COURSES = [
  {
    id: 'curso-derecho-penal-1',
    title: 'Fundamentos de Derecho Penal',
    description: 'Aprende los principios básicos del Derecho Penal ecuatoriano. Este curso cubre los conceptos esenciales, legislación actual y análisis de casos prácticos.',
    fullDescription: `
      <p>Este curso integral de Derecho Penal está diseñado para proporcionar una sólida base en los principios fundamentales que rigen el derecho penal ecuatoriano. A través de un enfoque práctico y basado en casos reales, los estudiantes adquirirán los conocimientos esenciales para comprender y aplicar la legislación penal vigente.</p>
      
      <p>El programa está estructurado en módulos progresivos que cubren desde la teoría del delito hasta los procedimientos penales, con énfasis en la aplicación práctica de los conceptos aprendidos. Se analizarán casos emblemáticos que han marcado precedentes en la jurisprudencia ecuatoriana.</p>
      
      <h3>Objetivos del curso:</h3>
      <ul>
        <li>Comprender los principios fundamentales del Derecho Penal</li>
        <li>Analizar la estructura y elementos del delito</li>
        <li>Estudiar las diferentes categorías de delitos en el COIP</li>
        <li>Desarrollar habilidades para la interpretación de normas penales</li>
        <li>Aplicar conocimientos en casos prácticos y simulaciones</li>
      </ul>
    `,
    imageUrl: '/images/courses/derecho-penal.jpg',
    price: 49.99,
    category: 'Derecho Penal',
    duration: '10 horas',
    lessons: 15,
    level: 'Principiante',
    instructor: 'Abg. Wilson Ipiales',
    featured: true,
    popular: true,
    rating: 4.8,
    students: 324,
    updated: '2025-02-15',
    language: 'Español',
    certificate: true,
    curriculum: [
      {
        title: 'Introducción al Derecho Penal',
        lessons: [
          { title: 'Concepto y funciones del Derecho Penal', duration: '20 min', free: true },
          { title: 'Principios limitadores del poder punitivo', duration: '25 min', free: false },
          { title: 'Evolución histórica del Derecho Penal', duration: '30 min', free: false }
        ]
      },
      {
        title: 'Teoría del Delito',
        lessons: [
          { title: 'Elementos del delito', duration: '35 min', free: false },
          { title: 'Tipicidad y sus elementos', duration: '40 min', free: false },
          { title: 'Antijuridicidad y causas de justificación', duration: '45 min', free: false },
          { title: 'Culpabilidad y sus elementos', duration: '30 min', free: false }
        ]
      },
      {
        title: 'Delitos en Particular',
        lessons: [
          { title: 'Delitos contra la vida', duration: '50 min', free: false },
          { title: 'Delitos contra la propiedad', duration: '45 min', free: false },
          { title: 'Delitos contra la administración pública', duration: '40 min', free: false },
          { title: 'Delitos informáticos', duration: '35 min', free: false }
        ]
      },
      {
        title: 'Procedimiento Penal',
        lessons: [
          { title: 'Sujetos procesales', duration: '30 min', free: false },
          { title: 'Etapas del proceso penal', duration: '45 min', free: false },
          { title: 'Medidas cautelares', duration: '35 min', free: false },
          { title: 'Recursos en materia penal', duration: '30 min', free: false }
        ]
      }
    ]
  },
  // Más cursos...
];

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [expandedSections, setExpandedSections] = useState({});
  const [hasPurchased, setHasPurchased] = useState(false);
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // En una aplicación real, obtendríamos el curso desde Supabase
        // const { data, error } = await dataService.getById('courses', courseId);
        // if (error) throw error;
        // setCourse(data);
        
        // Por ahora, usamos datos de muestra
        setTimeout(() => {
          const foundCourse = SAMPLE_COURSES.find(c => c.id === courseId);
          if (foundCourse) {
            setCourse(foundCourse);
          }
          setLoading(false);
        }, 800);
        
        // Verificar si el usuario ha comprado el curso
        if (user) {
          // En una aplicación real, verificaríamos en Supabase
          // const { data, error } = await dataService.query(
          //   'purchases',
          //   { user_id: user.id, course_id: courseId, status: 'completed' }
          // );
          // if (error) throw error;
          // setHasPurchased(data && data.length > 0);
          
          // Por ahora, simulamos
          setHasPurchased(false);
        }
      } catch (error) {
        console.error('Error al obtener detalles del curso:', error);
        toast.error('Error al cargar el curso. Por favor, intente nuevamente.');
        setLoading(false);
      }
    };
    
    fetchCourseDetails();
  }, [courseId, user]);
  
  const handleAddToCart = () => {
    if (!course) return;
    
    addToCart({
      id: course.id,
      name: course.title,
      price: course.price,
      category: 'Curso',
      imageUrl: course.imageUrl,
      quantity: 1,
      type: 'course'
    });
    
    toast.success(`${course.title} agregado al carrito`);
  };
  
  const toggleSection = (sectionIndex) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex]
    }));
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (!course) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Curso no encontrado</h1>
          <p className="text-gray-600 mb-8">El curso que estás buscando no existe o ha sido removido.</p>
          <Link 
            to="/cursos" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Ver todos los cursos
          </Link>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{course.title} | Abg. Wilson Ipiales</title>
        <meta name="description" content={course.description} />
      </Helmet>
      
      <Header />
      
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-7/12">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-4"
              >
                {course.title}
              </motion.h1>
              
              <p className="text-gray-300 mb-6">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      i < Math.floor(course.rating) ? (
                        <FaStar key={i} className="text-yellow-400" />
                      ) : (
                        <FaRegStar key={i} className="text-yellow-400" />
                      )
                    ))}
                  </div>
                  <span className="ml-2 text-yellow-400 font-medium">{course.rating}</span>
                  <span className="ml-1 text-gray-400">({course.students} estudiantes)</span>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <FaClock className="mr-1" />
                  <span className="mr-3">{course.duration}</span>
                  <FaGraduationCap className="mr-1" />
                  <span className="mr-3">{course.lessons} lecciones</span>
                  <FaUser className="mr-1" />
                  <span>{course.level}</span>
                </div>
              </div>
              
              <div className="flex items-center mb-8">
                <img 
                  src="/images/instructor-avatar.jpg" 
                  alt={course.instructor} 
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div>
                  <p className="text-sm text-gray-400">Instructor</p>
                  <p className="font-medium">{course.instructor}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="bg-blue-900 px-4 py-2 rounded-md text-sm">
                  <p className="text-gray-400">Actualizado</p>
                  <p className="font-medium">{course.updated}</p>
                </div>
                <div className="bg-blue-900 px-4 py-2 rounded-md text-sm">
                  <p className="text-gray-400">Idioma</p>
                  <p className="font-medium">{course.language}</p>
                </div>
                {course.certificate && (
                  <div className="bg-blue-900 px-4 py-2 rounded-md text-sm">
                    <p className="text-gray-400">Certificado</p>
                    <p className="font-medium">Sí, al completar</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="w-full md:w-5/12 lg:w-4/12">
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
                <div className="relative">
                  <img 
                    src={course.imageUrl || "/images/courses/default.jpg"} 
                    alt={course.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <Link 
                      to={hasPurchased ? `/dashboard/cursos/${course.id}/learn` : '#'}
                      onClick={e => !hasPurchased && e.preventDefault()}
                      className="bg-white text-blue-600 rounded-full p-5 transform hover:scale-110 transition-transform"
                    >
                      {hasPurchased ? <FaPlay className="text-xl" /> : <FaLock className="text-xl" />}
                    </Link>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-bold">${course.price.toFixed(2)}</span>
                    {course.featured && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded">
                        Destacado
                      </span>
                    )}
                  </div>
                  
                  {hasPurchased ? (
                    <Link
                      to={`/dashboard/cursos/${course.id}/learn`}
                      className="block w-full bg-green-600 text-white text-center py-3 rounded-md font-medium hover:bg-green-700 transition-colors mb-4"
                    >
                      Continuar Aprendiendo
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={handleAddToCart}
                        className="w-full bg-blue-600 text-white text-center py-3 rounded-md font-medium hover:bg-blue-700 transition-colors mb-4 flex items-center justify-center"
                      >
                        <FaShoppingCart className="mr-2" /> Agregar al Carrito
                      </button>
                      
                      <Link
                        to={`/checkout?course=${course.id}`}
                        className="block w-full bg-green-600 text-white text-center py-3 rounded-md font-medium hover:bg-green-700 transition-colors mb-4"
                      >
                        Comprar Ahora
                      </Link>
                    </>
                  )}
                  
                  <div className="border-t border-gray-700 pt-6 space-y-4">
                    <h4 className="font-medium mb-2">Este curso incluye:</h4>
                    <div className="flex items-start">
                      <FaPlay className="text-gray-400 mt-1 mr-3" />
                      <p>{course.duration} de video</p>
                    </div>
                    <div className="flex items-start">
                      <FaGraduationCap className="text-gray-400 mt-1 mr-3" />
                      <p>{course.lessons} lecciones</p>
                    </div>
                    <div className="flex items-start">
                      <FaDownload className="text-gray-400 mt-1 mr-3" />
                      <p>Recursos descargables</p>
                    </div>
                    <div className="flex items-start">
                      <FaBookmark className="text-gray-400 mt-1 mr-3" />
                      <p>Acceso de por vida</p>
                    </div>
                    {course.certificate && (
                      <div className="flex items-start">
                        <FaCheck className="text-gray-400 mt-1 mr-3" />
                        <p>Certificado de finalización</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 px-6 font-medium ${
                activeTab === 'description' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Descripción
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`pb-4 px-6 font-medium ${
                activeTab === 'curriculum' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Contenido del Curso
            </button>
            <button
              onClick={() => setActiveTab('instructor')}
              className={`pb-4 px-6 font-medium ${
                activeTab === 'instructor' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Instructor
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-6">
            {activeTab === 'description' && (
              <div 
                className="prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: course.fullDescription }}
              ></div>
            )}
            
            {activeTab === 'curriculum' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Contenido del Curso</h2>
                <div className="space-y-4">
                  {course.curriculum.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border border-gray-200 rounded-md overflow-hidden">
                      <button
                        onClick={() => toggleSection(sectionIndex)}
                        className="flex items-center justify-between w-full px-6 py-4 bg-gray-100 text-left font-medium"
                      >
                        <span>{section.title}</span>
                        <span className="text-sm text-gray-500">
                          {section.lessons.length} lecciones
                        </span>
                      </button>
                      
                      {expandedSections[sectionIndex] && (
                        <div className="divide-y divide-gray-200">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div 
                              key={lessonIndex} 
                              className="flex items-center justify-between px-6 py-3"
                            >
                              <div className="flex items-center">
                                {lesson.free ? (
                                  <FaPlay className="text-blue-600 mr-3" />
                                ) : hasPurchased ? (
                                  <FaPlay className="text-blue-600 mr-3" />
                                ) : (
                                  <FaLock className="text-gray-400 mr-3" />
                                )}
                                <span className={lesson.free || hasPurchased ? 'text-gray-800' : 'text-gray-500'}>
                                  {lesson.title}
                                </span>
                                {lesson.free && (
                                  <span className="ml-2 text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded">
                                    Gratis
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'instructor' && (
              <div>
                <div className="flex items-center mb-6">
                  <img 
                    src="/images/instructor-avatar.jpg" 
                    alt={course.instructor} 
                    className="w-24 h-24 rounded-full mr-6 object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{course.instructor}</h2>
                    <p className="text-gray-600 italic mb-2">Abogado especialista en Derecho Penal</p>
                    <div className="flex items-center text-gray-500">
                      <FaChalkboardTeacher className="mr-1" />
                      <span>12 cursos</span>
                      <span className="mx-2">•</span>
                      <FaUser className="mr-1" />
                      <span>1,240+ estudiantes</span>
                    </div>
                  </div>
                </div>
                
                <div className="prose prose-blue max-w-none">
                  <p>
                    Abogado con más de 15 años de experiencia en litigación penal y civil. Especialista en Derecho Penal 
                    Económico y Derecho Procesal. Ha participado en más de 500 juicios en diferentes materias legales.
                  </p>
                  <p>
                    Docente universitario y capacitador en escuelas judiciales, con amplia experiencia en la enseñanza 
                    de materias jurídicas. Su enfoque práctico y metodología basada en casos reales han ayudado a formar 
                    a cientos de profesionales del derecho.
                  </p>
                  <p>
                    Autor de varios artículos académicos y publicaciones especializadas en el ámbito del Derecho Penal
                    y Derecho Procesal. Conferencista internacional y referente en temas relacionados con el sistema penal acusatorio.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default CourseDetailPage;

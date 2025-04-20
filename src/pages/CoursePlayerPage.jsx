import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaArrowLeft, FaBookmark, FaCheck, FaChevronDown, FaChevronUp, FaDownload, FaExclamationCircle, FaHome, FaLock, FaPlay, FaRegCheckCircle, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

import Footer from '../components/Footer/Footer';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/supabaseService';

// Datos de ejemplo para el curso
const SAMPLE_COURSE_DATA = {
  id: 'curso-derecho-penal-1',
  title: 'Fundamentos de Derecho Penal',
  description: 'Aprende los principios básicos del Derecho Penal ecuatoriano.',
  instructor: 'Abg. Wilson Ipiales',
  sections: [
    {
      id: 'section-1',
      title: 'Introducción al Derecho Penal',
      lessons: [
        {
          id: 'lesson-1-1',
          title: 'Concepto y funciones del Derecho Penal',
          duration: '20 min',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // URL de ejemplo
          completed: true,
          resources: [
            {
              id: 'resource-1-1-1',
              title: 'Presentación de la lección',
              type: 'pdf',
              size: '1.2 MB',
              url: '#'
            },
            {
              id: 'resource-1-1-2',
              title: 'Lecturas recomendadas',
              type: 'pdf',
              size: '850 KB',
              url: '#'
            }
          ]
        },
        {
          id: 'lesson-1-2',
          title: 'Principios limitadores del poder punitivo',
          duration: '25 min',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          completed: true,
          resources: [
            {
              id: 'resource-1-2-1',
              title: 'Principios constitucionales',
              type: 'pdf',
              size: '1.5 MB',
              url: '#'
            }
          ]
        },
        {
          id: 'lesson-1-3',
          title: 'Evolución histórica del Derecho Penal',
          duration: '30 min',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          completed: false,
          resources: []
        }
      ]
    },
    {
      id: 'section-2',
      title: 'Teoría del Delito',
      lessons: [
        {
          id: 'lesson-2-1',
          title: 'Elementos del delito',
          duration: '35 min',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          completed: false,
          resources: [
            {
              id: 'resource-2-1-1',
              title: 'Cuadro resumen de elementos',
              type: 'pdf',
              size: '980 KB',
              url: '#'
            }
          ]
        },
        {
          id: 'lesson-2-2',
          title: 'Tipicidad y sus elementos',
          duration: '40 min',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          completed: false,
          resources: []
        },
        {
          id: 'lesson-2-3',
          title: 'Antijuridicidad y causas de justificación',
          duration: '45 min',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          completed: false,
          resources: []
        },
        {
          id: 'lesson-2-4',
          title: 'Culpabilidad y sus elementos',
          duration: '30 min',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          completed: false,
          resources: []
        }
      ]
    },
    {
      id: 'section-3',
      title: 'Delitos en Particular',
      lessons: [
        {
          id: 'lesson-3-1',
          title: 'Delitos contra la vida',
          duration: '50 min',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          completed: false,
          resources: []
        },
        {
          id: 'lesson-3-2',
          title: 'Delitos contra la propiedad',
          duration: '45 min',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          completed: false,
          resources: []
        }
      ]
    }
  ]
};

const CoursePlayerPage = () => {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const videoRef = useRef(null);
  
  // Simular la carga del curso y verificar si el usuario lo ha comprado
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // En una aplicación real, obtendríamos los datos del curso desde Supabase
        // const { data, error } = await dataService.getById('courses', courseId);
        // if (error) throw error;
        
        // Verificar si el usuario ha comprado el curso
        // const { data: purchases, error: purchaseError } = await dataService.query(
        //   'purchases',
        //   q => q.eq('user_id', user.id).eq('item_id', courseId).eq('status', 'completed')
        // );
        // if (purchaseError) throw purchaseError;
        
        // const purchased = purchases && purchases.length > 0;
        // setHasPurchased(purchased);
        
        // if (!purchased) {
        //   toast.error('No tienes acceso a este curso');
        //   navigate('/cursos');
        //   return;
        // }
        
        // setCourse(data);
        
        // Usando datos de muestra por ahora
        setTimeout(() => {
          setCourse(SAMPLE_COURSE_DATA);
          setHasPurchased(true);
          
          // Pre-expandir todas las secciones para mejor usabilidad
          const initialExpandedState = {};
          SAMPLE_COURSE_DATA.sections.forEach(section => {
            initialExpandedState[section.id] = true;
          });
          setExpandedSections(initialExpandedState);
          
          // Si no se especificó una lección, usar la primera
          if (!lessonId) {
            const firstSection = SAMPLE_COURSE_DATA.sections[0];
            const firstLesson = firstSection.lessons[0];
            setCurrentLesson(firstLesson);
            navigate(`/dashboard/cursos/${courseId}/learn/${firstLesson.id}`, { replace: true });
          } else {
            // Buscar la lección especificada en todas las secciones
            let foundLesson = null;
            for (const section of SAMPLE_COURSE_DATA.sections) {
              foundLesson = section.lessons.find(lesson => lesson.id === lessonId);
              if (foundLesson) break;
            }
            
            if (foundLesson) {
              setCurrentLesson(foundLesson);
            } else {
              const firstSection = SAMPLE_COURSE_DATA.sections[0];
              const firstLesson = firstSection.lessons[0];
              setCurrentLesson(firstLesson);
              navigate(`/dashboard/cursos/${courseId}/learn/${firstLesson.id}`, { replace: true });
            }
          }
          
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error al cargar el curso:', error);
        toast.error('Error al cargar el curso');
        setLoading(false);
        navigate('/dashboard/cursos');
      }
    };
    
    if (user) {
      fetchCourseData();
    } else {
      navigate('/auth/login');
    }
  }, [courseId, lessonId, user, navigate]);
  
  // Manejar la expansión/colapso de secciones
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  // Cambiar de lección
  const changeLesson = (lesson) => {
    setCurrentLesson(lesson);
    setVideoCompleted(false);
    navigate(`/dashboard/cursos/${courseId}/learn/${lesson.id}`);
    
    // En una aplicación real, registraríamos el progreso
    // dataService.trackLessonProgress(user.id, courseId, lesson.id, 'started');
  };
  
  // Marcar lección como completada
  const markLessonAsCompleted = async () => {
    if (!currentLesson) return;
    
    try {
      // En una aplicación real, actualizaríamos en Supabase
      // const { error } = await dataService.trackLessonProgress(
      //   user.id, courseId, currentLesson.id, 'completed', 100
      // );
      // if (error) throw error;
      
      // Actualizar estado local
      const updatedCourse = { ...course };
      for (const section of updatedCourse.sections) {
        const lesson = section.lessons.find(l => l.id === currentLesson.id);
        if (lesson) {
          lesson.completed = true;
          break;
        }
      }
      
      setCourse(updatedCourse);
      setVideoCompleted(true);
      toast.success('Lección completada');
      
      // Encontrar la siguiente lección si existe
      let foundCurrentLesson = false;
      let nextLesson = null;
      
      outerLoop:
      for (const section of course.sections) {
        for (let i = 0; i < section.lessons.length; i++) {
          if (foundCurrentLesson) {
            nextLesson = section.lessons[i];
            break outerLoop;
          }
          
          if (section.lessons[i].id === currentLesson.id) {
            foundCurrentLesson = true;
            if (i < section.lessons.length - 1) {
              nextLesson = section.lessons[i + 1];
              break outerLoop;
            }
          }
        }
      }
      
      if (nextLesson) {
        setTimeout(() => {
          changeLesson(nextLesson);
        }, 1500);
      }
    } catch (error) {
      console.error('Error al marcar lección como completada:', error);
      toast.error('Error al actualizar el progreso');
    }
  };
  
  // Calcular el progreso general del curso
  const calculateCourseProgress = () => {
    if (!course) return 0;
    
    let totalLessons = 0;
    let completedLessons = 0;
    
    course.sections.forEach(section => {
      totalLessons += section.lessons.length;
      completedLessons += section.lessons.filter(lesson => lesson.completed).length;
    });
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };
  
  // Encontrar la lección siguiente
  const findNextLesson = () => {
    if (!course || !currentLesson) return null;
    
    let foundCurrentLesson = false;
    let nextLesson = null;
    
    outerLoop:
    for (const section of course.sections) {
      for (let i = 0; i < section.lessons.length; i++) {
        if (foundCurrentLesson) {
          nextLesson = section.lessons[i];
          break outerLoop;
        }
        
        if (section.lessons[i].id === currentLesson.id) {
          foundCurrentLesson = true;
          if (i < section.lessons.length - 1) {
            nextLesson = section.lessons[i + 1];
            break outerLoop;
          }
        }
      }
    }
    
    return nextLesson;
  };
  
  // Encontrar la lección anterior
  const findPreviousLesson = () => {
    if (!course || !currentLesson) return null;
    
    let previousLesson = null;
    
    outerLoop:
    for (const section of course.sections) {
      for (let i = 0; i < section.lessons.length; i++) {
        if (section.lessons[i].id === currentLesson.id) {
          break outerLoop;
        }
        previousLesson = section.lessons[i];
      }
    }
    
    return previousLesson;
  };
  
  // Manejar el evento de finalización del video
  const handleVideoEnded = () => {
    setVideoCompleted(true);
    // Marcar automáticamente como completada
    markLessonAsCompleted();
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!course || !hasPurchased) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <FaExclamationCircle className="text-red-500 text-5xl mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso Denegado</h1>
        <p className="text-gray-600 mb-6 text-center">
          No tienes acceso a este curso o el curso no existe.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard/cursos')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Mis Cursos
          </button>
          <button
            onClick={() => navigate('/cursos')}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Explorar Cursos
          </button>
        </div>
      </div>
    );
  }
  
  const courseProgress = calculateCourseProgress();
  const nextLesson = findNextLesson();
  const previousLesson = findPreviousLesson();
  
  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Barra superior */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/dashboard/cursos')}
            className="text-gray-500 hover:text-gray-700 mr-4"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-lg font-medium text-gray-800 truncate max-w-md">
            {course.title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center">
            <div className="flex items-center mr-3">
              <div className="w-24 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${courseProgress}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">{courseProgress}%</span>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaHome />
          </button>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex flex-grow overflow-hidden">
        {/* Barra lateral (curriculum) */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0"
              style={{ width: 320 }}
            >
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-2">Contenido del curso</h2>
                <div className="text-sm text-gray-600 mb-4">
                  {course.sections.reduce((total, section) => total + section.lessons.length, 0)} lecciones •{' '}
                  {courseProgress}% completado
                </div>
                
                <div className="space-y-2">
                  {course.sections.map((section, index) => (
                    <div key={section.id} className="border border-gray-200 rounded-md overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 text-left font-medium"
                      >
                        <span className="flex items-center">
                          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-xs mr-2">
                            {index + 1}
                          </span>
                          <span className="text-sm">{section.title}</span>
                        </span>
                        <span className="flex items-center text-gray-500 text-sm">
                          <span className="mr-2">{section.lessons.length} clases</span>
                          {expandedSections[section.id] ? <FaChevronUp /> : <FaChevronDown />}
                        </span>
                      </button>
                      
                      {expandedSections[section.id] && (
                        <div className="divide-y divide-gray-100">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <button
                              key={lesson.id}
                              onClick={() => changeLesson(lesson)}
                              className={`flex items-start w-full p-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                                currentLesson && currentLesson.id === lesson.id ? 'bg-blue-50' : ''
                              }`}
                            >
                              <div className="flex-shrink-0 mt-0.5 mr-3">
                                {lesson.completed ? (
                                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                    <FaCheck className="text-xs" />
                                  </div>
                                ) : currentLesson && currentLesson.id === lesson.id ? (
                                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <FaPlay className="text-xs" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">
                                    {(index + 1)}.{lessonIndex + 1}
                                  </div>
                                )}
                              </div>
                              <div className="flex-grow">
                                <span className={`block ${lesson.completed ? 'text-green-600' : 'text-gray-800'}`}>
                                  {lesson.title}
                                </span>
                                <span className="block text-gray-400 text-xs mt-1">
                                  {lesson.duration}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Área de contenido principal (video y recursos) */}
        <div className="flex-grow overflow-y-auto">
          <div className="p-4">
            {/* Botón para mostrar/ocultar sidebar en móvil */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden mb-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
            >
              {sidebarOpen ? 'Ocultar contenido' : 'Mostrar contenido'}
            </button>
            
            {currentLesson && (
              <div>
                {/* Reproductor de video */}
                <div className="bg-black rounded-lg overflow-hidden mb-6 relative" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    ref={videoRef}
                    src={currentLesson.videoUrl}
                    className="absolute top-0 left-0 w-full h-full"
                    title={currentLesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onEnded={handleVideoEnded}
                  ></iframe>
                </div>
                
                {/* Título de la lección y navegación */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{currentLesson.title}</h2>
                    <span className="text-sm text-gray-500">{currentLesson.duration}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-6">
                    {previousLesson && (
                      <button
                        onClick={() => changeLesson(previousLesson)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 transition-colors"
                      >
                        Lección anterior
                      </button>
                    )}
                    
                    {currentLesson.completed ? (
                      <div className="flex items-center text-green-600">
                        <FaRegCheckCircle className="mr-1" />
                        <span>Lección completada</span>
                      </div>
                    ) : videoCompleted ? (
                      <div className="flex items-center text-green-600">
                        <FaRegCheckCircle className="mr-1" />
                        <span>Lección completada</span>
                      </div>
                    ) : (
                      <button
                        onClick={markLessonAsCompleted}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                      >
                        Marcar como completada
                      </button>
                    )}
                    
                    {nextLesson && (
                      <button
                        onClick={() => changeLesson(nextLesson)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors ml-auto"
                      >
                        Siguiente lección
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Recursos de la lección */}
                {currentLesson.resources && currentLesson.resources.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Recursos</h3>
                    <div className="space-y-3">
                      {currentLesson.resources.map(resource => (
                        <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center">
                            <FaDownload className="text-gray-500 mr-3" />
                            <div>
                              <p className="font-medium text-gray-800">{resource.title}</p>
                              <p className="text-xs text-gray-500">{resource.type.toUpperCase()} • {resource.size}</p>
                            </div>
                          </div>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition-colors"
                          >
                            Descargar
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayerPage;

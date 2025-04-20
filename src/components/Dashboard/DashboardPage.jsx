import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserCircle, FaCalendarAlt, FaFileAlt, FaBook, FaGraduationCap, FaHistory, FaCoins, FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/supabaseService';

// Datos de ejemplo para el dashboard
const SAMPLE_USER_DATA = {
  name: 'Juan Pérez',
  email: 'juan.perez@example.com',
  tokens: 15,
  appointments: [
    {
      id: 'app-1',
      title: 'Consulta Derecho Laboral',
      date: '2025-04-25T14:00:00',
      status: 'scheduled'
    }
  ],
  courses: [
    {
      id: 'curso-derecho-penal-1',
      title: 'Fundamentos de Derecho Penal',
      progress: 35,
      thumbnail: '/images/courses/derecho-penal.jpg'
    },
    {
      id: 'masterclass-litigacion-1',
      title: 'Masterclass: Técnicas de Litigación Oral',
      progress: 100,
      thumbnail: '/images/courses/litigacion.jpg'
    }
  ],
  ebooks: [
    {
      id: 'ebook-guia-penal-1',
      title: 'Guía Práctica de Derecho Penal',
      thumbnail: '/images/ebooks/guia-penal.jpg'
    }
  ],
  recentPurchases: [
    {
      id: 'purchase-6',
      title: 'Infracciones de Tránsito y Defensa',
      date: '2025-04-10',
      amount: 39.99,
      type: 'course'
    },
    {
      id: 'purchase-4',
      title: 'Paquete de 10 Tokens',
      date: '2025-04-05',
      amount: 45.00,
      type: 'tokens'
    }
  ]
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        // En una aplicación real, obtendríamos los datos del usuario desde Supabase
        // const { data: profile, error } = await dataService.getById('profiles', user.id);
        // if (error) throw error;
        
        // const { data: appointments } = await dataService.query(
        //   'appointments',
        //   q => q.eq('user_id', user.id).order('date', { ascending: true }).limit(5)
        // );
        
        // const { data: courses } = await dataService.query(
        //   'user_courses',
        //   q => q.eq('user_id', user.id).order('last_accessed', { ascending: false }).limit(5)
        // );
        
        // const { data: ebooks } = await dataService.query(
        //   'user_ebooks',
        //   q => q.eq('user_id', user.id).order('purchased_at', { ascending: false }).limit(5)
        // );
        
        // const { data: purchases } = await dataService.query(
        //   'purchases',
        //   q => q.eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
        // );
        
        // const userData = {
        //   ...profile,
        //   appointments,
        //   courses,
        //   ebooks,
        //   recentPurchases: purchases
        // };
        
        // setUserData(userData);
        
        // Por ahora, usamos datos de muestra
        setTimeout(() => {
          setUserData({
            ...SAMPLE_USER_DATA,
            email: user.email
          });
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        toast.error('Error al cargar tus datos');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error al cargar el dashboard</h2>
          <p className="text-gray-600 mb-6">
            No se pudieron cargar tus datos. Por favor, intenta recargar la página o contacta a soporte.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Bienvenida y resumen */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-md p-6 mb-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-4">Bienvenido, {userData.name || user.email}</h1>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-3">
                <FaCoins className="text-yellow-300" size={20} />
              </div>
              <div>
                <p className="text-sm text-white text-opacity-80">Tokens disponibles</p>
                <p className="text-xl font-bold">{userData.tokens}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-3">
                <FaCalendarAlt className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-white text-opacity-80">Próxima cita</p>
                <p className="text-xl font-bold">
                  {userData.appointments && userData.appointments.length > 0 
                    ? new Date(userData.appointments[0].date).toLocaleDateString()
                    : 'No hay citas programadas'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-3">
                <FaGraduationCap className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-white text-opacity-80">Cursos activos</p>
                <p className="text-xl font-bold">{userData.courses ? userData.courses.length : 0}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap mt-6 gap-3">
            <Link 
              to="/tokens" 
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md transition-colors flex items-center"
            >
              <FaCoins className="mr-2" /> Comprar tokens
            </Link>
            <Link 
              to="/agendar-cita" 
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md transition-colors flex items-center"
            >
              <FaCalendarAlt className="mr-2" /> Agendar cita
            </Link>
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cursos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-2"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FaGraduationCap className="mr-2 text-blue-600" /> Mis Cursos
              </h2>
              <Link 
                to="/dashboard/cursos" 
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Ver todos
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {userData.courses && userData.courses.length > 0 ? (
              userData.courses.map(course => (
                <div key={course.id} className="p-4 flex items-center">
                  <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-md overflow-hidden">
                    <img 
                      src={course.thumbnail || "/images/placeholder.jpg"} 
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="ml-4 flex-grow">
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <div className="mt-1">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progreso</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Link 
                      to={`/dashboard/cursos/${course.id}/learn`}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                    >
                      Continuar
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <FaGraduationCap className="mx-auto text-gray-400 text-3xl mb-2" />
                <p className="text-gray-500 mb-4">No tienes cursos activos</p>
                <Link 
                  to="/cursos" 
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  Explorar cursos
                </Link>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* E-books */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FaBook className="mr-2 text-green-600" /> Mis E-books
              </h2>
              <Link 
                to="/dashboard/ebooks" 
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Ver todos
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {userData.ebooks && userData.ebooks.length > 0 ? (
              userData.ebooks.map(ebook => (
                <div key={ebook.id} className="p-4 flex items-center">
                  <div className="flex-shrink-0 h-16 w-12 bg-gray-200 rounded-md overflow-hidden">
                    <img 
                      src={ebook.thumbnail || "/images/placeholder.jpg"} 
                      alt={ebook.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="ml-4 flex-grow">
                    <h3 className="font-medium text-gray-900">{ebook.title}</h3>
                  </div>
                  
                  <div className="ml-2">
                    <Link 
                      to={`/dashboard/ebooks/${ebook.id}`}
                      className="px-2 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700 transition-colors"
                    >
                      Descargar
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <FaBook className="mx-auto text-gray-400 text-3xl mb-2" />
                <p className="text-gray-500 mb-4">No tienes e-books</p>
                <Link 
                  to="/ebooks" 
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                >
                  Explorar e-books
                </Link>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Próximas citas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FaCalendarAlt className="mr-2 text-purple-600" /> Próximas Citas
              </h2>
              <Link 
                to="/calendario" 
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Ver todas
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {userData.appointments && userData.appointments.length > 0 ? (
              userData.appointments.map(appointment => (
                <div key={appointment.id} className="p-4">
                  <h3 className="font-medium text-gray-900">{appointment.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(appointment.date).toLocaleDateString()} a las {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                      {appointment.status === 'scheduled' ? 'Programada' : 'Completada'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <FaCalendarAlt className="mx-auto text-gray-400 text-3xl mb-2" />
                <p className="text-gray-500 mb-4">No tienes citas programadas</p>
                <Link 
                  to="/agendar-cita" 
                  className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors"
                >
                  Agendar una cita
                </Link>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Últimas compras */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-2"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FaHistory className="mr-2 text-indigo-600" /> Historial de Compras
              </h2>
              <Link 
                to="/dashboard/compras" 
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Ver historial completo
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {userData.recentPurchases && userData.recentPurchases.length > 0 ? (
              userData.recentPurchases.map(purchase => (
                <div key={purchase.id} className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{purchase.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(purchase.date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-sm mr-3">
                      ${purchase.amount.toFixed(2)}
                    </span>
                    {purchase.type === 'course' ? (
                      <FaGraduationCap className="text-blue-600" />
                    ) : purchase.type === 'ebook' ? (
                      <FaBook className="text-green-600" />
                    ) : purchase.type === 'tokens' ? (
                      <FaCoins className="text-yellow-600" />
                    ) : (
                      <FaShoppingCart className="text-gray-600" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <FaShoppingCart className="mx-auto text-gray-400 text-3xl mb-2" />
                <p className="text-gray-500 mb-4">No tienes compras recientes</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Link 
                    to="/cursos" 
                    className="inline-block px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                  >
                    Ver cursos
                  </Link>
                  <Link 
                    to="/ebooks" 
                    className="inline-block px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                  >
                    Ver e-books
                  </Link>
                  <Link 
                    to="/tokens" 
                    className="inline-block px-3 py-1 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700 transition-colors"
                  >
                    Comprar tokens
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Acciones rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FaUserCircle className="mr-2 text-gray-600" /> Acciones Rápidas
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <Link 
              to="/tokens"
              className="flex items-center p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <div className="p-2 bg-yellow-100 rounded-full mr-3">
                <FaCoins className="text-yellow-600" />
              </div>
              <span>Comprar tokens</span>
            </Link>
            
            <Link 
              to="/agendar-cita"
              className="flex items-center p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-full mr-3">
                <FaCalendarAlt className="text-purple-600" />
              </div>
              <span>Agendar consulta</span>
            </Link>
            
            <Link 
              to="/cursos"
              className="flex items-center p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-full mr-3">
                <FaGraduationCap className="text-blue-600" />
              </div>
              <span>Explorar cursos</span>
            </Link>
            
            <Link 
              to="/dashboard/compras"
              className="flex items-center p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <div className="p-2 bg-indigo-100 rounded-full mr-3">
                <FaHistory className="text-indigo-600" />
              </div>
              <span>Historial de compras</span>
            </Link>
            
            <Link 
              to="/perfil"
              className="flex items-center p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-full mr-3">
                <FaUserCircle className="text-green-600" />
              </div>
              <span>Editar perfil</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;

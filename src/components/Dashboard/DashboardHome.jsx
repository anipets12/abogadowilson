import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaCalendarAlt, FaComment, FaBook, FaCoins, FaUsers, FaInfoCircle, FaFileAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const DashboardHome = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    consultations: [],
    appointments: [],
    tokens: 0,
    ebooks: [],
    referrals: [],
    notifications: []
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/summary', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar datos del dashboard');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      // Datos de fallback para desarrollo/demo
      setStats({
        consultations: [
          { id: 1, title: 'Consulta sobre herencia', status: 'pending', date: '2025-04-15' },
          { id: 2, title: 'Caso de litigio civil', status: 'in_progress', date: '2025-04-10' }
        ],
        appointments: [
          { id: 1, date: '2025-04-20T10:00:00', title: 'Asesoría legal', status: 'confirmed' }
        ],
        tokens: 50,
        ebooks: [
          { id: 1, title: 'Guía Legal para Emprendedores', progress: 75, thumbnail: '/images/ebook-thumbnail-1.jpg' },
          { id: 2, title: 'Derechos Fundamentales', progress: 30, thumbnail: '/images/ebook-thumbnail-2.jpg' }
        ],
        referrals: [
          { id: 1, name: 'Carlos Méndez', status: 'registered', date: '2025-04-01' },
          { id: 2, name: 'Ana Gutiérrez', status: 'purchased', date: '2025-04-05' }
        ],
        notifications: [
          { id: 1, message: 'Su cita del 20 de abril ha sido confirmada', type: 'appointment', date: '2025-04-18' },
          { id: 2, message: 'Consulta respondida: Caso de herencia', type: 'consultation', date: '2025-04-17' },
          { id: 3, message: 'Su compra de 50 tokens ha sido procesada', type: 'purchase', date: '2025-04-15' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      registered: 'bg-purple-100 text-purple-800',
      purchased: 'bg-indigo-100 text-indigo-800'
    };

    const statusText = {
      pending: 'Pendiente',
      in_progress: 'En proceso',
      completed: 'Completado',
      confirmed: 'Confirmado',
      cancelled: 'Cancelado',
      registered: 'Registrado',
      purchased: 'Compra realizada'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusText[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Bienvenido, {user?.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Tarjeta de Tokens */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white p-3 rounded-full">
                <FaCoins className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-5">
                <p className="text-white text-sm uppercase font-medium">Mis Tokens</p>
                <h3 className="text-white text-3xl font-bold">{stats.tokens}</h3>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/dashboard/tokens" className="text-white text-sm hover:underline">
                Comprar más tokens →
              </Link>
            </div>
          </div>
        </div>
        
        {/* Tarjeta de Próximas Citas */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200">
          <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" /> Próximas Citas
              </h3>
              <Link to="/dashboard/appointments" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                Ver todas
              </Link>
            </div>
          </div>
          <div className="px-5 py-3">
            {stats.appointments.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {stats.appointments.slice(0, 2).map(appointment => (
                  <li key={appointment.id} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{appointment.title}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(appointment.date)} - {new Date(appointment.date).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                      <div>
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-3 text-center">
                <p className="text-gray-500">No tienes citas programadas</p>
                <Link to="/dashboard/appointments/schedule" className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  Agendar una cita
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Tarjeta de Consultas Recientes */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200">
          <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <FaComment className="mr-2 text-blue-500" /> Consultas Recientes
              </h3>
              <Link to="/dashboard/consultations" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                Ver todas
              </Link>
            </div>
          </div>
          <div className="px-5 py-3">
            {stats.consultations.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {stats.consultations.slice(0, 2).map(consultation => (
                  <li key={consultation.id} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{consultation.title}</p>
                        <p className="text-sm text-gray-500">{formatDate(consultation.date)}</p>
                      </div>
                      <div>
                        {getStatusBadge(consultation.status)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-3 text-center">
                <p className="text-gray-500">No tienes consultas recientes</p>
                <Link to="/dashboard/consultations/new" className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  Nueva consulta
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Tarjeta de Mis E-Books */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200">
          <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <FaBook className="mr-2 text-blue-500" /> Mis E-Books
              </h3>
              <Link to="/dashboard/ebooks" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                Ver biblioteca
              </Link>
            </div>
          </div>
          <div className="p-5">
            {stats.ebooks.length > 0 ? (
              <div className="space-y-4">
                {stats.ebooks.slice(0, 2).map(book => (
                  <div key={book.id} className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-12 bg-gray-200 rounded overflow-hidden">
                      {book.thumbnail ? (
                        <img src={book.thumbnail} alt={book.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-500">
                          <FaBook />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{book.title}</h4>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${book.progress}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{book.progress}% completado</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No tienes e-books en tu biblioteca</p>
                <Link to="/ebooks" className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  Explorar e-books
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Tarjeta de Mis Referidos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200">
          <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <FaUsers className="mr-2 text-blue-500" /> Mis Referidos
              </h3>
              <Link to="/dashboard/referrals" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                Ver programa
              </Link>
            </div>
          </div>
          <div className="px-5 py-3">
            {stats.referrals.length > 0 ? (
              <div>
                <ul className="divide-y divide-gray-200">
                  {stats.referrals.slice(0, 3).map(referral => (
                    <li key={referral.id} className="py-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{referral.name}</p>
                          <p className="text-sm text-gray-500">{formatDate(referral.date)}</p>
                        </div>
                        <div>
                          {getStatusBadge(referral.status)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-4 bg-blue-50 rounded-md p-3">
                  <p className="text-sm text-blue-800">Comparte tu enlace de referidos:</p>
                  <div className="mt-2 flex">
                    <input 
                      type="text" 
                      value={`https://abogadowilson.com/ref/${user?.id || '123456'}`}
                      readOnly
                      className="flex-1 text-sm border border-gray-300 rounded-l-md px-3 py-2 bg-white"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`https://abogadowilson.com/ref/${user?.id || '123456'}`);
                        toast.success('Enlace copiado al portapapeles');
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-r-md text-sm hover:bg-blue-700 transition-colors duration-200"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-3 text-center">
                <p className="text-gray-500">No tienes referidos aún</p>
                <Link to="/dashboard/referrals" className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  Iniciar programa de referidos
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Tarjeta de Notificaciones */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200">
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <FaInfoCircle className="mr-2 text-blue-500" /> Notificaciones Recientes
            </h3>
          </div>
        </div>
        <div className="px-5 py-3">
          {stats.notifications.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {stats.notifications.map(notification => (
                <li key={notification.id} className="py-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {notification.type === 'appointment' && <FaCalendarAlt className="h-5 w-5 text-blue-500" />}
                      {notification.type === 'consultation' && <FaComment className="h-5 w-5 text-green-500" />}
                      {notification.type === 'purchase' && <FaFileAlt className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500">{formatDate(notification.date)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-3 text-center">
              <p className="text-gray-500">No tienes notificaciones recientes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

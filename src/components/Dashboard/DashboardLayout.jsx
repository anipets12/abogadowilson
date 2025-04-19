import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaFileAlt, FaComment, FaCalendarAlt, FaBook, FaCoins, FaUsers, FaCreditCard, FaSignOutAlt, FaShieldAlt, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const DashboardLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userStats, setUserStats] = useState({
    consultations: 0,
    appointments: 0,
    tokens: 0,
    ebooks: 0,
    referrals: 0
  });
  
  useEffect(() => {
    // Si no hay usuario, redireccionar al login
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Cargar estadísticas del usuario
    fetchUserStats();
  }, [user, navigate]);
  
  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) throw new Error('Error al cargar estadísticas');
      
      const data = await response.json();
      setUserStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      // Usar datos de fallback para no bloquear la UI
      setUserStats({
        consultations: 2,
        appointments: 1,
        tokens: 50,
        ebooks: 3,
        referrals: 5
      });
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };
  
  // Enlaces de navegación para usuarios normales
  const userNavLinks = [
    { name: 'Inicio', path: '/dashboard', icon: <FaHome /> },
    { name: 'Mi Perfil', path: '/dashboard/profile', icon: <FaUser /> },
    { name: 'Mis Consultas', path: '/dashboard/consultations', icon: <FaComment /> },
    { name: 'Mis Citas', path: '/dashboard/appointments', icon: <FaCalendarAlt /> },
    { name: 'Mis E-Books', path: '/dashboard/ebooks', icon: <FaBook /> },
    { name: 'Mis Tokens', path: '/dashboard/tokens', icon: <FaCoins /> },
    { name: 'Mis Referidos', path: '/dashboard/referrals', icon: <FaUsers /> },
    { name: 'Historial de Pagos', path: '/dashboard/payments', icon: <FaCreditCard /> },
  ];
  
  // Enlaces adicionales para administradores
  const adminNavLinks = [
    { name: 'Panel Admin', path: '/dashboard/admin', icon: <FaShieldAlt /> },
    { name: 'Gestionar Usuarios', path: '/dashboard/admin/users', icon: <FaUsers /> },
    { name: 'Gestionar Contenidos', path: '/dashboard/admin/content', icon: <FaFileAlt /> },
    { name: 'Analíticas', path: '/dashboard/admin/analytics', icon: <FaChartLine /> },
  ];
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar para escritorio */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <img className="h-10 w-auto" src="/logo.svg" alt="Logo de Abogado Wilson" />
              <span className="ml-2 text-xl font-semibold text-blue-900">Panel de Usuario</span>
            </div>
            
            {/* Información del usuario */}
            <div className="mt-5 px-4 py-2 border-t border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuario'}</p>
                  <p className="text-xs font-medium text-gray-500 truncate">{user?.email || 'usuario@ejemplo.com'}</p>
                </div>
              </div>
              
              {/* Mostrar tokens disponibles */}
              <div className="mt-3 flex items-center bg-blue-50 p-2 rounded-md">
                <FaCoins className="text-yellow-500" />
                <span className="ml-2 text-sm font-medium">Tokens: {userStats.tokens}</span>
              </div>
            </div>
            
            {/* Navegación */}
            <nav className="mt-3 flex-1 px-2">
              <div className="space-y-1">
                {userNavLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'} group flex items-center px-2 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out`
                    }
                  >
                    <div className="mr-3 text-lg">{link.icon}</div>
                    {link.name}
                  </NavLink>
                ))}
                
                {/* Mostrar enlaces de admin si el usuario es administrador */}
                {isAdmin && (
                  <>
                    <div className="mt-8 mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Administración
                    </div>
                    {adminNavLinks.map((link) => (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                          `${isActive ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-100'} group flex items-center px-2 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out`
                        }
                      >
                        <div className="mr-3 text-lg">{link.icon}</div>
                        {link.name}
                      </NavLink>
                    ))}
                  </>
                )}
              </div>
            </nav>
          </div>
          
          {/* Botón de cierre de sesión */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 group block w-full text-left"
            >
              <div className="flex items-center">
                <div className="mr-3 text-red-500">
                  <FaSignOutAlt />
                </div>
                <div className="text-sm font-medium text-red-600">
                  Cerrar Sesión
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Barra superior para móvil */}
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center justify-between shadow-sm border-b">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="sr-only">Abrir menú</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center pr-4">
            <img className="h-8 w-auto" src="/logo.svg" alt="Logo" />
            <span className="ml-2 text-lg font-semibold text-blue-900">Panel</span>
          </div>
        </div>
        
        {/* Contenido principal */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      
      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Panel lateral */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Cerrar menú</span>
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <img className="h-8 w-auto" src="/logo.svg" alt="Logo" />
                <span className="ml-2 text-lg font-semibold text-blue-900">Panel de Usuario</span>
              </div>
              
              {/* Información del usuario */}
              <div className="mt-5 px-4 py-2 border-t border-b border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuario'}</p>
                    <p className="text-xs font-medium text-gray-500 truncate">{user?.email || 'usuario@ejemplo.com'}</p>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center bg-blue-50 p-2 rounded-md">
                  <FaCoins className="text-yellow-500" />
                  <span className="ml-2 text-sm font-medium">Tokens: {userStats.tokens}</span>
                </div>
              </div>
              
              {/* Navegación */}
              <nav className="mt-5 px-2">
                <div className="space-y-1">
                  {userNavLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'} group flex items-center px-2 py-2 text-base font-medium rounded-md transition duration-150 ease-in-out`
                      }
                    >
                      <div className="mr-4 text-lg">{link.icon}</div>
                      {link.name}
                    </NavLink>
                  ))}
                  
                  {/* Enlaces de admin en móvil */}
                  {isAdmin && (
                    <>
                      <div className="mt-8 mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Administración
                      </div>
                      {adminNavLinks.map((link) => (
                        <NavLink
                          key={link.path}
                          to={link.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `${isActive ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-100'} group flex items-center px-2 py-2 text-base font-medium rounded-md transition duration-150 ease-in-out`
                          }
                        >
                          <div className="mr-4 text-lg">{link.icon}</div>
                          {link.name}
                        </NavLink>
                      ))}
                    </>
                  )}
                </div>
              </nav>
            </div>
            
            {/* Botón de cierre de sesión en móvil */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 group block w-full text-left"
              >
                <div className="flex items-center">
                  <div className="mr-3 text-red-500">
                    <FaSignOutAlt />
                  </div>
                  <div className="text-sm font-medium text-red-600">
                    Cerrar Sesión
                  </div>
                </div>
              </button>
            </div>
          </div>
          
          <div className="flex-shrink-0 w-14"></div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;

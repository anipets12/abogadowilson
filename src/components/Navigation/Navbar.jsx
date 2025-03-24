import { Fragment, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition, Popover } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon, UserIcon } from '@heroicons/react/24/outline';
import { FaUsers, FaHandshake, FaComments, FaGavel, FaBook, FaShieldAlt, FaFileContract, FaFileAlt, FaUserTie, FaWhatsapp, FaPhone, FaEnvelope, FaUserPlus, FaSignInAlt, FaLock } from 'react-icons/fa';
import { authService, dataService } from '../../services/apiService';

const mainNavigation = [
  { name: 'Inicio', href: '/', current: false },
  { name: 'Servicios', href: '#', current: false, hasSubmenu: true, icon: <FaGavel className="text-blue-600" /> },
  { name: 'Consultas', href: '#', current: false, hasSubmenu: true, icon: <FaFileAlt className="text-blue-600" /> },
  { name: 'Blog', href: '/blog', current: false, icon: <FaBook className="text-blue-600" /> },
  { name: 'Foro', href: '/foro', current: false, icon: <FaComments className="text-blue-600" /> },
  { name: 'Comunidad', href: '#', current: false, hasSubmenu: true, icon: <FaUsers className="text-blue-600" /> },
  { name: 'Contacto', href: '/contacto', current: false, icon: <FaEnvelope className="text-blue-600" /> },
];

const serviceSubmenu = [
  { name: 'Derecho Penal', href: '/servicios/penal', current: false, icon: <FaGavel className="text-red-500" /> },
  { name: 'Derecho Civil', href: '/servicios/civil', current: false, icon: <FaFileContract className="text-blue-500" /> },
  { name: 'Derecho Comercial', href: '/servicios/comercial', current: false, icon: <FaFileAlt className="text-green-500" /> },
  { name: 'Derecho de Tránsito', href: '/servicios/transito', current: false, icon: <FaFileAlt className="text-yellow-500" /> },
  { name: 'Derecho Aduanero', href: '/servicios/aduanas', current: false, icon: <FaFileAlt className="text-purple-500" /> },
];

const consultasSubmenu = [
  { name: 'Consulta General', href: '/consultas', current: false, icon: <FaFileAlt className="text-blue-500" /> },
  { name: 'Consultas Civiles', href: '/consultas/civiles', current: false, icon: <FaFileContract className="text-green-500" /> },
  { name: 'Consultas Penales', href: '/consultas/penales', current: false, icon: <FaGavel className="text-red-500" /> },
  { name: 'Consultas de Tránsito', href: '/consultas/transito', current: false, icon: <FaFileAlt className="text-yellow-500" /> },
  { name: 'Consulta con IA', href: '/consulta-ia', current: false, icon: <FaUserTie className="text-purple-500" /> },
];

const comunidadSubmenu = [
  { name: 'Programa de Afiliados', href: '/afiliados', current: false, icon: <FaUsers className="text-blue-500" /> },
  { name: 'Programa de Referidos', href: '/referidos', current: false, icon: <FaHandshake className="text-green-500" /> },
  { name: 'Testimonios', href: '/testimonios', current: false, icon: <FaComments className="text-yellow-500" /> },
  { name: 'Noticias', href: '/noticias', current: false, icon: <FaBook className="text-purple-500" /> },
  { name: 'E-Books', href: '/ebooks', current: false, icon: <FaBook className="text-indigo-500" /> },
];

// Nuevo submenú para Políticas y Seguridad
const policySubmenu = [
  { name: 'Política de Privacidad', href: '/privacidad', current: false, icon: <FaShieldAlt className="text-gray-500" /> },
  { name: 'Términos y Condiciones', href: '/terminos', current: false, icon: <FaFileContract className="text-gray-500" /> },
  { name: 'Seguridad', href: '/seguridad', current: false, icon: <FaLock className="text-gray-500" /> },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Navbar() {
  const [session, setSession] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Establecer la sesión inicial
    const setInitialSession = async () => {
      try {
        // Verificar si hay un token en localStorage
        const token = localStorage.getItem('authToken');
        if (token) {
          const { user } = await authService.getCurrentUser();
          setSession({ user });
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error('Error al obtener la sesión inicial:', error);
        setSession(null);
      }
    };
    setInitialSession();

    // Simplificamos la lógica de escucha de cambios de autenticación
    const handleAuthChange = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        authService.getCurrentUser().then(({ user }) => {
          if (user) setSession({ user });
        });
      } else {
        setSession(null);
      }
    };

    // Comprobamos cada 5 segundos si el token cambió
    const interval = setInterval(handleAuthChange, 5000);
    
    // Limpiar el intervalo al desmontar
    return () => clearInterval(interval);
  }, []);

  const updatedNavigation = mainNavigation.map(item => ({
    ...item,
    current: location.pathname === item.href || 
             (item.href !== '#' && item.href !== '/' && location.pathname.includes(item.href))
  }));

  // Añadir entrada para Políticas y Seguridad
  const allNavigation = [...updatedNavigation, { 
    name: 'Políticas', 
    href: '#', 
    current: location.pathname === '/privacidad' || location.pathname === '/terminos' || location.pathname === '/seguridad', 
    hasSubmenu: true, 
    icon: <FaShieldAlt className="text-blue-600" /> 
  }];

  return (
    <Disclosure as="nav" className="bg-white shadow-lg sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden z-50">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Abrir menú principal</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Desktop navigation */}
              <div className="flex flex-1 items-center justify-center sm:justify-start">
                {/* Logo completely removed as requested */}
                <div className="hidden sm:ml-6 sm:flex sm:space-x-2 md:space-x-4">
                  {allNavigation.map((item) => 
                    item.hasSubmenu ? (
                      <Popover className="relative" key={item.name}>
                        {({ open }) => (
                          <>
                            <Popover.Button
                              className={classNames(
                                item.current ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700',
                                'rounded-md px-3 py-2 text-sm font-medium flex items-center group transition-colors'
                              )}
                            >
                              <span className="mr-1">{item.icon}</span>
                              <span>{item.name}</span>
                              <ChevronDownIcon 
                                className={classNames(
                                  'ml-1 h-4 w-4 transition-transform',
                                  open ? 'rotate-180 transform' : ''
                                )}
                              />
                            </Popover.Button>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="opacity-0 translate-y-1"
                              enterTo="opacity-100 translate-y-0"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100 translate-y-0"
                              leaveTo="opacity-0 translate-y-1"
                            >
                              <Popover.Panel className="absolute left-1/2 z-50 mt-1 w-56 -translate-x-1/2 transform">
                                <div className="rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                                  <div className="relative grid gap-1 p-2">
                                    {(item.name === 'Servicios' ? serviceSubmenu : 
                                      item.name === 'Consultas' ? consultasSubmenu : 
                                      item.name === 'Comunidad' ? comunidadSubmenu :
                                      item.name === 'Políticas' ? policySubmenu : []).map((subItem) => (
                                      <Link
                                        key={subItem.name}
                                        to={subItem.href}
                                        className={classNames(
                                          subItem.current ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700',
                                          'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
                                        )}
                                      >
                                        <span className="mr-2">{subItem.icon}</span>
                                        <span>{subItem.name}</span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              </Popover.Panel>
                            </Transition>
                          </>
                        )}
                      </Popover>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700',
                          'rounded-md px-3 py-2 text-sm font-medium flex items-center transition-colors'
                        )}
                      >
                        <span className="mr-1">{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    )
                  )}
                </div>
              </div>

              {/* Right side buttons */}
              <div className="absolute inset-y-0 right-0 flex items-center space-x-1 sm:static sm:space-x-2">
                {/* Auth buttons */}
                {session ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-blue-100 p-1 text-blue-600 hover:bg-blue-200 focus:outline-none">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Abrir menú de usuario</span>
                        <UserIcon className="h-6 w-6" aria-hidden="true" />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard"
                              className={classNames(
                                active ? 'bg-blue-50' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Mi Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={async () => {
                                await authService.signOut();
                              }}
                              className={classNames(
                                active ? 'bg-blue-50' : '',
                                'block w-full text-left px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Cerrar Sesión
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="flex space-x-1">
                    <Link
                      to="/registro"
                      className="inline-flex items-center p-1.5 text-xs font-medium rounded text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100"
                    >
                      <FaUserPlus className="mr-1" /> Registrarse
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center p-1.5 text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <FaSignInAlt className="mr-1" /> Iniciar Sesión
                    </Link>
                  </div>
                )}
                
                {/* Contact Action Buttons - Hidden on small screens */}
                <div className="hidden md:flex md:items-center space-x-1">
                  <a 
                    href="tel:+593988835269" 
                    className="inline-flex items-center p-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                  >
                    <FaPhone className="mr-1" /> Llamar
                  </a>
                  <a 
                    href="https://wa.me/593988835269" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center p-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-500 hover:bg-green-600 transition-colors duration-200"
                  >
                    <FaWhatsapp className="mr-1" /> WhatsApp
                  </a>
                  <Link 
                    to="/contacto" 
                    className="inline-flex items-center p-1.5 border border-transparent text-xs font-medium rounded-md text-gray-900 bg-yellow-400 hover:bg-yellow-500 transition-colors duration-200"
                  >
                    <FaEnvelope className="mr-1" /> Consulta Gratis
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {allNavigation.map((item) =>
                item.hasSubmenu ? (
                  <Disclosure key={item.name} as="div" className="mt-1">
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={classNames(
                            item.current ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50 hover:text-blue-700',
                            'group w-full flex items-center justify-between rounded-md px-2 py-2 text-left text-sm font-medium text-gray-700 focus:outline-none'
                          )}
                        >
                          <div className="flex items-center">
                            <span className="mr-2">{item.icon}</span>
                            <span>{item.name}</span>
                          </div>
                          <ChevronDownIcon
                            className={classNames(
                              'h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-transform',
                              open ? 'rotate-180 transform' : ''
                            )}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="mt-1 space-y-1">
                          {(item.name === 'Servicios' ? serviceSubmenu : 
                            item.name === 'Consultas' ? consultasSubmenu : 
                            item.name === 'Comunidad' ? comunidadSubmenu :
                            item.name === 'Políticas' ? policySubmenu : []).map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className="group flex items-center rounded-md py-2 pl-4 pr-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <span className="mr-2">{subItem.icon}</span>
                              <span>{subItem.name}</span>
                            </Link>
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50 hover:text-blue-700',
                      'flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700'
                    )}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )
              )}
              
              {/* Mobile Contact Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Contacto Directo</h3>
                <div className="grid grid-cols-2 gap-2">
                  <a 
                    href="tel:+593988835269" 
                    className="flex items-center justify-center p-2 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <FaPhone className="mr-1" /> Llamar
                  </a>
                  <a 
                    href="https://wa.me/593988835269" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center p-2 border border-transparent text-xs font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
                  >
                    <FaWhatsapp className="mr-1" /> WhatsApp
                  </a>
                  <Link 
                    to="/contacto" 
                    className="flex items-center justify-center p-2 border border-transparent text-xs font-medium rounded-md text-gray-900 bg-yellow-400 hover:bg-yellow-500 col-span-2 mt-1"
                  >
                    <FaEnvelope className="mr-1" /> Consulta Gratis
                  </Link>
                </div>
              </div>
              
              {/* Mobile Authentication Buttons */}
              {!session && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mi Cuenta</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      className="flex items-center justify-center p-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <FaSignInAlt className="mr-1" /> Iniciar Sesión
                    </Link>
                    <Link
                      to="/registro"
                      className="flex items-center justify-center p-2 text-xs font-medium rounded-md text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100"
                    >
                      <FaUserPlus className="mr-1" /> Registrarse
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default Navbar;

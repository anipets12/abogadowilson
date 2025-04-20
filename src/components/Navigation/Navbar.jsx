import React, { Fragment, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition, Popover } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon, UserIcon } from '@heroicons/react/24/outline';
import { FaUsers, FaHandshake, FaComments, FaGavel, FaBook, FaShieldAlt, FaFileContract, FaFileAlt, FaUserTie, FaWhatsapp, FaPhone, FaEnvelope, FaUserPlus, FaSignInAlt, FaLock, FaCalendarAlt, FaCoins } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import CartWidget from '../Shop/CartWidget';

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

// Añadir nuevo submenú para Usuario Autenticado
const userSubmenu = [
  { name: 'Mi Dashboard', href: '/dashboard', current: false, icon: <UserIcon className="h-5 w-5 text-blue-500" /> },
  { name: 'Mis Citas', href: '/calendario', current: false, icon: <FaCalendarAlt className="text-green-500" /> },
  { name: 'Mis Tokens', href: '/tokens', current: false, icon: <FaCoins className="text-yellow-500" /> },
  { name: 'Agendar Cita', href: '/agendar-cita', current: false, icon: <FaCalendarAlt className="text-purple-500" /> },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Navbar() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Determinar si la ruta actual está activa
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Disclosure as="nav" className="bg-gray-900 shadow-md sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Botón del menú móvil */}
                <Disclosure.Button 
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="sr-only">Abrir menú principal</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                {/* Logo */}
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/">
                    <img
                      className="h-8 w-auto"
                      src="/images/logo-white.png"
                      alt="Abogado Wilson"
                    />
                  </Link>
                </div>
                
                {/* Menú de navegación para desktop */}
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {mainNavigation.map((item) => (
                      item.hasSubmenu ? (
                        <Popover key={item.name} className="relative">
                          {({ open }) => (
                            <>
                              <Popover.Button
                                className={classNames(
                                  isActive(item.href) ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                  'inline-flex items-center px-3 py-2 rounded-md text-sm font-medium focus:outline-none'
                                )}
                              >
                                <span>{item.name}</span>
                                <ChevronDownIcon
                                  className={classNames(
                                    open ? 'rotate-180' : '',
                                    'ml-1 h-4 w-4 transition-transform duration-200'
                                  )}
                                  aria-hidden="true"
                                />
                              </Popover.Button>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Popover.Panel className="absolute left-0 z-10 mt-2 w-60 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  <div className="py-1">
                                    {(item.name === 'Servicios' ? serviceSubmenu :
                                      item.name === 'Consultas' ? consultasSubmenu :
                                      item.name === 'Comunidad' ? comunidadSubmenu :
                                      item.name === 'Políticas' ? policySubmenu : []).map((subItem) => (
                                      <Link
                                        key={subItem.name}
                                        to={subItem.href}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      >
                                        <span className="mr-2">{subItem.icon}</span>
                                        <span>{subItem.name}</span>
                                      </Link>
                                    ))}
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
                            isActive(item.href) ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'px-3 py-2 rounded-md text-sm font-medium'
                          )}
                        >
                          {item.name}
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-y-0 right-0 flex items-center space-x-4 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Botón WhatsApp */}
                <a
                  href="https://wa.me/593992529049"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-green-600 text-white hover:bg-green-700"
                >
                  <FaWhatsapp className="mr-1" />
                  WhatsApp
                </a>
                
                {/* Widget del Carrito */}
                <CartWidget />
                
                {/* Botón de Tokens */}
                <Link
                  to="/tokens"
                  className="hidden sm:flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-yellow-600 text-white hover:bg-yellow-700"
                >
                  <FaCoins className="mr-1" />
                  Tokens
                </Link>
                
                {/* Menú de usuario */}
                {user ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="sr-only">Abrir menú de usuario</span>
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
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
                        {userSubmenu.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                to={item.href}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'flex items-center px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                <span className="mr-2">{item.icon}</span>
                                <span>{item.name}</span>
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => {
                                localStorage.removeItem('authToken');
                                window.location.href = '/';
                              }}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'flex items-center w-full text-left px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              <FaSignInAlt className="mr-2 text-red-500" />
                              <span>Cerrar Sesión</span>
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/auth/login"
                      className="hidden sm:flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <FaSignInAlt className="mr-1" />
                      Ingresar
                    </Link>
                    <Link
                      to="/auth/register"
                      className="hidden sm:flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-gray-700 text-white hover:bg-gray-800"
                    >
                      <FaUserPlus className="mr-1" />
                      Registro
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menú móvil */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {mainNavigation.map((item) => (
                item.hasSubmenu ? (
                  <Disclosure key={item.name} as="div" className="mt-1">
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={classNames(
                            isActive(item.href) ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium'
                          )}
                        >
                          <span>{item.name}</span>
                          <ChevronDownIcon
                            className={classNames(
                              open ? 'rotate-180' : '',
                              'h-5 w-5 transition-transform duration-200'
                            )}
                            aria-hidden="true"
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="mt-2 space-y-1">
                          {(item.name === 'Servicios' ? serviceSubmenu :
                            item.name === 'Consultas' ? consultasSubmenu :
                            item.name === 'Comunidad' ? comunidadSubmenu :
                            item.name === 'Políticas' ? policySubmenu : []).map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className="group flex items-center rounded-md py-2 pl-4 pr-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
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
                      isActive(item.href) ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'flex items-center rounded-md px-3 py-2 text-base font-medium'
                    )}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )
              ))}
              
              {/* Nuevos enlaces en el menú móvil */}
              <Link
                to="/tokens"
                className="flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <FaCoins className="mr-2 text-yellow-500" />
                <span>Comprar Tokens</span>
              </Link>
              
              <Link
                to="/agendar-cita"
                className="flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <FaCalendarAlt className="mr-2 text-green-500" />
                <span>Agendar Cita</span>
              </Link>
              
              {/* Mobile Contact Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Contacto Directo</h3>
                <div className="grid grid-cols-2 gap-2">
                  <a 
                    href="tel:+593992529049" 
                    className="flex items-center justify-center p-2 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <FaPhone className="mr-1" /> Llamar
                  </a>
                  <a 
                    href="https://wa.me/593992529049" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center p-2 border border-transparent text-xs font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
                  >
                    <FaWhatsapp className="mr-1" /> WhatsApp
                  </a>
                  <Link 
                    to="/consulta" 
                    className="flex items-center justify-center p-2 border border-transparent text-xs font-medium rounded-md text-gray-900 bg-yellow-400 hover:bg-yellow-500 col-span-2 mt-1"
                  >
                    <FaEnvelope className="mr-1" /> Consulta Gratis
                  </Link>
                </div>
              </div>
              
              {/* Mobile Authentication Buttons */}
              {!user ? (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Mi Cuenta</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/auth/login"
                      className="flex items-center justify-center p-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <FaSignInAlt className="mr-1" /> Iniciar Sesión
                    </Link>
                    <Link
                      to="/auth/register"
                      className="flex items-center justify-center p-2 text-xs font-medium rounded-md text-white bg-gray-600 border border-gray-500 hover:bg-gray-700"
                    >
                      <FaUserPlus className="mr-1" /> Registrarse
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Mi Cuenta</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/dashboard"
                      className="flex items-center justify-center p-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <UserIcon className="h-4 w-4 mr-1" /> Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem('authToken');
                        window.location.href = '/';
                      }}
                      className="flex items-center justify-center p-2 text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      <FaSignInAlt className="mr-1" /> Cerrar Sesión
                    </button>
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

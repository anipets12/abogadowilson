import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaWhatsapp, FaGavel, FaSearch, FaBook, FaNewspaper, FaUsers, FaCalendarAlt } from 'react-icons/fa';

const Navigation = () => {
  const services = [
    { name: 'Derecho Penal', path: '/servicios/penal' },
    { name: 'Derecho Civil', path: '/servicios/civil' },
    { name: 'Derecho Comercial', path: '/servicios/comercial' },
    { name: 'Derecho de Tránsito', path: '/servicios/transito' },
    { name: 'Derecho Aduanero', path: '/servicios/aduanas' },
    { name: 'Patrocinio de Causas', path: '/servicios/patrocinio', price: 'Desde $500' },
    { name: 'Cobro de Pensiones', path: '/servicios/pensiones' },
    { name: 'Cobro de Deudas', path: '/servicios/deudas' },
    { name: 'Consultas Legales', path: '/consultas' }
  ];

  const mainLinks = [
    { name: 'Inicio', path: '/', icon: <FaGavel /> },
    { name: 'Servicios', path: '/servicios', icon: <FaGavel />, submenu: services },
    { name: 'Consulta de Procesos', path: '/consultas', icon: <FaSearch /> },
    { name: 'E-books', path: '/ebooks', icon: <FaBook /> },
    { name: 'Noticias', path: '/noticias', icon: <FaNewspaper /> },
    { name: 'Testimonios', path: '/testimonios', icon: <FaUsers /> },
    { name: 'Agendar Cita', path: '/calendario', icon: <FaCalendarAlt /> }
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo y nombre */}
          <Link to="/" className="flex items-center space-x-2">
            <FaGavel className="text-2xl text-primary-600" />
            <span className="text-xl font-bold">Abg. Wilson Ipiales</span>
          </Link>

          {/* Menú principal */}
          <div className="hidden lg:flex space-x-8">
            {mainLinks.map((link) => (
              <div key={link.path} className="relative group">
                <Link
                  to={link.path}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>

                {link.submenu && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block z-50">
                    {link.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      >
                        {subItem.name}
                        {subItem.price && (
                          <span className="text-primary-600 ml-2">{subItem.price}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Botones de contacto */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:+593988835269"
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
            >
              <FaPhone />
              <span>+593 988835269</span>
            </a>
            <a
              href="https://wa.me/593988835269"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              <FaWhatsapp />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
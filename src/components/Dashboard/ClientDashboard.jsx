import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaFileAlt, FaCreditCard, FaUser, FaBell, FaSignOutAlt, FaArrowRight } from 'react-icons/fa';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const [userData, setUserData] = useState({
    nombre: 'Usuario',
    apellido: 'Ejemplo',
    creditos: 3,
    consultas: [
      { id: 1, fecha: '2025-03-05', tipo: 'Derecho Penal', estado: 'Completada' },
      { id: 2, fecha: '2025-03-10', tipo: 'Derecho Civil', estado: 'Pendiente' }
    ],
    citas: [
      { id: 1, fecha: '2025-03-15T14:00:00', tipo: 'Consulta Inicial', abogado: 'Wilson Ipiales' }
    ]
  });

  // En una implementación real, esto se conectaría con Supabase
  useEffect(() => {
    // Simulación de carga de datos del usuario
    // En implementación real: 
    // const fetchUserData = async () => {
    //   const { data, error } = await supabase
    //     .from('users')
    //     .select('*')
    //     .eq('id', userId)
    //     .single();
    //   if (data) setUserData(data);
    // };
    // fetchUserData();
  }, []);

  // Componente para la sección de inicio
  const InicioTab = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bienvenido, {userData.nombre}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Créditos Disponibles</h3>
            <span className="text-3xl font-bold text-blue-600">{userData.creditos}</span>
          </div>
          <p className="text-gray-600 mt-2">Utilice sus créditos para consultas y servicios</p>
          <Link to="/comprar-creditos" className="mt-4 text-blue-600 flex items-center hover:underline">
            Comprar más créditos <FaArrowRight className="ml-2" />
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Próxima Cita</h3>
          </div>
          {userData.citas.length > 0 ? (
            <div className="mt-2">
              <p className="font-medium">
                {new Date(userData.citas[0].fecha).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p className="text-gray-600">{userData.citas[0].tipo}</p>
              <Link to="/calendario" className="mt-2 text-blue-600 flex items-center hover:underline">
                Ver agenda completa <FaArrowRight className="ml-2" />
              </Link>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-gray-600">No tiene citas programadas</p>
              <Link to="/calendario" className="mt-2 text-blue-600 flex items-center hover:underline">
                Agendar una cita <FaArrowRight className="ml-2" />
              </Link>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Consultas Recientes</h3>
          </div>
          {userData.consultas.length > 0 ? (
            <div className="mt-2">
              <p className="font-medium">{userData.consultas[0].tipo}</p>
              <p className="text-gray-600">Estado: {userData.consultas[0].estado}</p>
              <Link to="/consultas" className="mt-2 text-blue-600 flex items-center hover:underline">
                Ver todas las consultas <FaArrowRight className="ml-2" />
              </Link>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-gray-600">No tiene consultas recientes</p>
              <Link to="/servicios" className="mt-2 text-blue-600 flex items-center hover:underline">
                Solicitar una consulta <FaArrowRight className="ml-2" />
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="font-bold text-lg mb-4">Servicios Recomendados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Consulta Legal', description: 'Obtenga asesoría legal personalizada para su caso', url: '/servicios/consulta' },
            { title: 'Patrocinio Legal', description: 'Representación completa en su caso desde $500', url: '/servicios/patrocinio' },
            { title: 'Certificados Digitales', description: 'Genere certificados legales mediante IA', url: '/servicios/certificados' }
          ].map((servicio, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-bold mb-2">{servicio.title}</h4>
              <p className="text-gray-600 text-sm mb-3">{servicio.description}</p>
              <Link to={servicio.url} className="text-blue-600 text-sm flex items-center hover:underline">
                Saber más <FaArrowRight className="ml-1 text-xs" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Componente para la sección de citas
  const CitasTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mis Citas</h2>
        <Link to="/calendario" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <FaCalendarAlt className="mr-2" /> Agendar Nueva Cita
        </Link>
      </div>
      
      {userData.citas.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abogado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userData.citas.map(cita => (
                <tr key={cita.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(cita.fecha).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{cita.tipo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{cita.abogado}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-800">Reprogramar</button>
                    <button className="text-red-600 hover:text-red-800 ml-4">Cancelar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">No tiene citas programadas</p>
          <Link to="/calendario" className="bg-blue-600 text-white px-6 py-2 rounded-lg inline-flex items-center hover:bg-blue-700 transition-colors">
            <FaCalendarAlt className="mr-2" /> Agendar Ahora
          </Link>
        </div>
      )}
    </div>
  );

  // Componente para la sección de consultas
  const ConsultasTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mis Consultas</h2>
        <Link to="/servicios" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <FaFileAlt className="mr-2" /> Nueva Consulta
        </Link>
      </div>
      
      {userData.consultas.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userData.consultas.map(consulta => (
                <tr key={consulta.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(consulta.fecha).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{consulta.tipo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      consulta.estado === 'Completada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {consulta.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-800">Ver detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">No tiene consultas realizadas</p>
          <Link to="/servicios" className="bg-blue-600 text-white px-6 py-2 rounded-lg inline-flex items-center hover:bg-blue-700 transition-colors">
            <FaFileAlt className="mr-2" /> Solicitar Consulta
          </Link>
        </div>
      )}
    </div>
  );

  // Componente para la sección de perfil
  const PerfilTab = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Mi Perfil</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="font-bold text-lg mb-4">Información Personal</h3>
        
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              value={userData.nombre}
              onChange={(e) => setUserData({...userData, nombre: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              value={userData.apellido}
              onChange={(e) => setUserData({...userData, apellido: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              value="usuario@ejemplo.com"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input 
              type="tel" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              placeholder="+593 XXXXXXXXX"
            />
          </div>
          
          <div className="col-span-2 mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Actualizar Información
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="font-bold text-lg mb-4">Cambiar Contraseña</h3>
        
        <form className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
            <input 
              type="password" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
            <input 
              type="password" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
            <input 
              type="password" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              placeholder="••••••••"
            />
          </div>
          
          <div className="mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Cambiar Contraseña
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-bold text-lg mb-4">Notificaciones</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Actualizaciones por correo</p>
              <p className="text-sm text-gray-600">Recibir novedades sobre servicios y promociones</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Recordatorios de citas</p>
              <p className="text-sm text-gray-600">Recibir notificaciones sobre citas próximas</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alertas de SMS</p>
              <p className="text-sm text-gray-600">Recibir notificaciones importantes por SMS</p>
            </div>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="mb-6 text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="text-blue-600 text-4xl" />
                </div>
                <h3 className="font-bold text-lg">{userData.nombre} {userData.apellido}</h3>
              </div>
              
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setActiveTab('inicio')} 
                    className={`w-full text-left py-2 px-4 rounded-lg transition-colors flex items-center ${
                      activeTab === 'inicio' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <FaUser className="mr-3" /> Inicio
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('citas')} 
                    className={`w-full text-left py-2 px-4 rounded-lg transition-colors flex items-center ${
                      activeTab === 'citas' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <FaCalendarAlt className="mr-3" /> Mis Citas
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('consultas')} 
                    className={`w-full text-left py-2 px-4 rounded-lg transition-colors flex items-center ${
                      activeTab === 'consultas' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <FaFileAlt className="mr-3" /> Mis Consultas
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('perfil')} 
                    className={`w-full text-left py-2 px-4 rounded-lg transition-colors flex items-center ${
                      activeTab === 'perfil' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <FaUser className="mr-3" /> Mi Perfil
                  </button>
                </li>
                <li>
                  <Link to="/logout" className="w-full text-left py-2 px-4 rounded-lg transition-colors flex items-center text-red-600 hover:bg-red-50">
                    <FaSignOutAlt className="mr-3" /> Cerrar Sesión
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-600 text-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-lg mb-3">¿Necesita ayuda?</h3>
              <p className="text-blue-100 mb-4">Nuestro equipo está disponible para asistirle con cualquier duda o problema.</p>
              <a 
                href="tel:+593988835269" 
                className="bg-white text-blue-600 hover:bg-blue-50 block text-center py-2 rounded-lg font-bold transition-colors"
              >
                Contáctenos
              </a>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="md:col-span-3">
            {activeTab === 'inicio' && <InicioTab />}
            {activeTab === 'citas' && <CitasTab />}
            {activeTab === 'consultas' && <ConsultasTab />}
            {activeTab === 'perfil' && <PerfilTab />}
          </div>
        </div>
      </div>
      
      {/* Estilos adicionales para los botones de toggle */}
      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }
        
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }
        
        input:checked + .slider {
          background-color: #2563EB;
        }
        
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        
        .slider.round {
          border-radius: 24px;
        }
        
        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default ClientDashboard;

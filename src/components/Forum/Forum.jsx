import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaComment, FaEye, FaUser, FaClock } from 'react-icons/fa';
import supabase, { fetchData, getCurrentUser } from '../../services/supabase';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const Forum = () => {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };

    const loadTopics = async () => {
      setIsLoading(true);
      try {
        const data = await fetchData('forum_topics', ['*']);
        // Ordenar por fecha de creación (más recientes primero)
        const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setTopics(sortedData);
        setError(null);
      } catch (err) {
        console.error('Error al cargar los temas del foro:', err);
        setError('Error al cargar los temas del foro. Por favor, intente nuevamente más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
    loadTopics();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Foro Legal</h1>
            {currentUser && (
              <Link to="/foro/nuevo" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center transition duration-300">
                <FaPlus className="mr-2" /> Nuevo Tema
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center p-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              >
                Reintentar
              </button>
            </div>
          ) : topics.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-lg text-gray-600">No hay temas en el foro actualmente.</p>
              {currentUser && (
                <Link to="/foro/nuevo" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300">
                  Crear el primer tema
                </Link>
              )}
              {!currentUser && (
                <Link to="/login" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300">
                  Iniciar sesión para participar
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tema
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Autor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actividad
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estadísticas
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topics.map((topic) => (
                    <motion.tr 
                      key={topic.id}
                      whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
                      className="cursor-pointer"
                      onClick={() => navigate(`/foro/tema/${topic.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-md font-medium text-blue-600 hover:text-blue-800">
                            {topic.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {topic.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaUser className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{topic.author_name || 'Usuario'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaClock className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true, locale: es })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-4">
                          <div className="flex items-center">
                            <FaComment className="text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">{topic.replies_count || 0}</span>
                          </div>
                          <div className="flex items-center">
                            <FaEye className="text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">{topic.views_count || 0}</span>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Este foro es un espacio para discusiones legales constructivas. Por favor, respete las normas de la comunidad.
          </p>
          {!currentUser && (
            <Link to="/login" className="mt-2 inline-block text-blue-600 hover:text-blue-800 font-medium">
              Iniciar sesión para participar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forum;

import React, { useEffect, useState } from 'react';
import { authService } from '../../services/apiService';
import { toast } from 'react-hot-toast';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await authService.getCurrentUser();
        if (error) {
          console.error('Error al obtener usuario:', error);
          setUser(null);
        } else {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Error al verificar sesión:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="profile bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      {user ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Perfil de Usuario</h2>
            <button 
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <FaSignOutAlt className="mr-2" /> Cerrar Sesión
            </button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaUser className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Bienvenido</h3>
                <p className="text-blue-600 font-medium">{user.email || user.name}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <FaUser className="mx-auto text-gray-400 text-4xl mb-4" />
          <p className="text-gray-600 mb-4">Por favor, inicia sesión para ver tu perfil.</p>
          <a 
            href="/login" 
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </a>
        </div>
      )}
    </div>
  );
};

export default Profile;

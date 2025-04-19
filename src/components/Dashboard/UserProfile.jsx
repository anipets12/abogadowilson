import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaMapMarkerAlt, FaEdit, FaKey, FaShieldAlt } from 'react-icons/fa';
import TurnstileWidget from '../TurnstileWidget';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    identification: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    profileImage: null
  });
  
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Cargar datos del perfil
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);
  
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) throw new Error('Error al cargar perfil');
      
      const data = await response.json();
      
      // Establecer datos del perfil
      setProfile({
        name: data.name || user?.name || '',
        email: data.email || user?.email || '',
        phone: data.phone || '',
        identification: data.identification || '',
        address: data.address || '',
        city: data.city || '',
        province: data.province || '',
        postalCode: data.postalCode || '',
        profileImage: data.profileImage || null
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error al cargar el perfil');
      
      // Usar datos de fallback para desarrollo
      setProfile({
        name: user?.name || 'Usuario Demo',
        email: user?.email || 'usuario@ejemplo.com',
        phone: '+593 98 765 4321',
        identification: '1234567890',
        address: 'Av. Principal 123',
        city: 'Quito',
        province: 'Pichincha',
        postalCode: '170150',
        profileImage: null
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setProfile({ ...profile, profileImage: reader.result });
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const saveProfile = async () => {
    if (!turnstileVerified && (editMode || changePassword)) {
      toast.error('Por favor, complete la verificación de seguridad');
      return;
    }
    
    try {
      setSaving(true);
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(profile)
      });
      
      if (!response.ok) throw new Error('Error al guardar perfil');
      
      // Actualizar contexto global
      updateUser({ name: profile.name, email: profile.email });
      
      toast.success('Perfil actualizado correctamente');
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };
  
  const changeUserPassword = async () => {
    if (!turnstileVerified) {
      toast.error('Por favor, complete la verificación de seguridad');
      return;
    }
    
    // Validaciones
    if (!passwords.currentPassword) {
      toast.error('Debe ingresar su contraseña actual');
      return;
    }
    
    if (passwords.newPassword.length < 8) {
      toast.error('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    try {
      setSaving(true);
      
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });
      
      if (!response.ok) throw new Error('Error al cambiar contraseña');
      
      toast.success('Contraseña actualizada correctamente');
      setChangePassword(false);
      
      // Limpiar campos
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Error al cambiar la contraseña');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-24 bg-gray-200 rounded mb-6"></div>
        <div className="h-64 bg-gray-200 rounded mb-4"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">Mi Perfil</h2>
        {!editMode && !changePassword && (
          <button
            onClick={() => setEditMode(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaEdit className="mr-1.5" /> Editar
          </button>
        )}
      </div>
      
      <div className="p-5">
        {/* Modo visualización */}
        {!editMode && !changePassword && (
          <div>
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex justify-center md:w-1/3 mb-6 md:mb-0">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-100">
                    {profile.profileImage ? (
                      <img src={profile.profileImage} alt="Foto de perfil" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                        <FaUser className="text-5xl text-blue-300" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      <FaUser className="mr-1 text-blue-500" /> Nombre
                    </h3>
                    <p className="text-base font-medium text-gray-900">{profile.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      <FaEnvelope className="mr-1 text-blue-500" /> Correo Electrónico
                    </h3>
                    <p className="text-base font-medium text-gray-900">{profile.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      <FaPhone className="mr-1 text-blue-500" /> Teléfono
                    </h3>
                    <p className="text-base font-medium text-gray-900">{profile.phone || '-'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      <FaIdCard className="mr-1 text-blue-500" /> Identificación
                    </h3>
                    <p className="text-base font-medium text-gray-900">{profile.identification || '-'}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      <FaMapMarkerAlt className="mr-1 text-blue-500" /> Dirección
                    </h3>
                    <p className="text-base font-medium text-gray-900">
                      {profile.address ? (
                        <>
                          {profile.address}, {profile.city}, {profile.province} {profile.postalCode}
                        </>
                      ) : (
                        '-'
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button
                    onClick={() => setChangePassword(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaKey className="mr-2" /> Cambiar contraseña
                  </button>
                </div>
              </div>
            </div>
            
            {/* Seguridad de la cuenta */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FaShieldAlt className="mr-2 text-blue-500" /> Seguridad de la cuenta
              </h3>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-800 mb-2">
                  Para mantener segura tu cuenta, te recomendamos:
                </p>
                <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                  <li>Cambiar tu contraseña regularmente</li>
                  <li>No compartir tus credenciales con terceros</li>
                  <li>Mantener actualizada tu información de contacto</li>
                  <li>Revisar periódicamente tu historial de actividades</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Modo edición */}
        {editMode && (
          <div>
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex flex-col items-center md:w-1/3 mb-6 md:mb-0">
                <div className="relative mb-3">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-100">
                    {profile.profileImage ? (
                      <img src={profile.profileImage} alt="Foto de perfil" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                        <FaUser className="text-5xl text-blue-300" />
                      </div>
                    )}
                  </div>
                  <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-lg">
                    <FaEdit />
                    <input 
                      type="file" 
                      id="profile-image" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">Click en el icono para cambiar la imagen</p>
              </div>
              
              <div className="md:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      disabled
                    />
                    <p className="mt-1 text-xs text-gray-500">El correo no se puede cambiar</p>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="identification" className="block text-sm font-medium text-gray-700 mb-1">
                      Identificación (Cédula/RUC)
                    </label>
                    <input
                      type="text"
                      id="identification"
                      name="identification"
                      value={profile.identification}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="md:col-span-2 mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={profile.city}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                      Provincia
                    </label>
                    <input
                      type="text"
                      id="province"
                      name="province"
                      value={profile.province}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={profile.postalCode}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Verificación de seguridad */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Verificación de seguridad
              </label>
              <TurnstileWidget onVerify={() => setTurnstileVerified(true)} />
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setEditMode(false);
                  fetchUserProfile(); // Recargar datos originales
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={saving}
              >
                Cancelar
              </button>
              
              <button
                onClick={saveProfile}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        )}
        
        {/* Cambio de contraseña */}
        {changePassword && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Cambiar Contraseña</h3>
            
            <div className="max-w-md">
              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña actual
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">Mínimo 8 caracteres</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar nueva contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              {/* Verificación de seguridad */}
              <div className="mt-6 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Verificación de seguridad
                </label>
                <TurnstileWidget onVerify={() => setTurnstileVerified(true)} />
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setChangePassword(false);
                    setPasswords({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={saving}
                >
                  Cancelar
                </button>
                
                <button
                  onClick={changeUserPassword}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={saving}
                >
                  {saving ? 'Actualizando...' : 'Actualizar contraseña'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

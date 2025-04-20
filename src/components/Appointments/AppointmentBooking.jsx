import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaPhone, FaCommentAlt, FaCheck } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../../services/supabaseService';
import { useAuth } from '../../context/AuthContext';

// Días disponibles (próximos 14 días, excluyendo sábados y domingos)
const getAvailableDays = () => {
  const days = [];
  const today = new Date();
  
  // Agregar próximos 14 días
  for (let i = 1; i <= 14; i++) {
    const day = new Date();
    day.setDate(today.getDate() + i);
    
    // Excluir sábados (6) y domingos (0)
    if (day.getDay() !== 0 && day.getDay() !== 6) {
      days.push({
        date: day,
        formatted: day.toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        })
      });
    }
  }
  
  return days;
};

// Horarios disponibles (de 9:00 a 17:00, cada 1 hora)
const getAvailableHours = () => {
  const hours = [];
  
  for (let hour = 9; hour <= 17; hour++) {
    hours.push({
      time: `${hour}:00`,
      formatted: `${hour}:00`
    });
  }
  
  return hours;
};

const AppointmentBooking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    date: null,
    time: null,
    name: '',
    email: '',
    phone: '',
    service: 'consulta-general',
    notes: '',
    tokensToUse: 1
  });
  
  const [availableDays] = useState(getAvailableDays());
  const [availableHours] = useState(getAvailableHours());
  const [userTokens, setUserTokens] = useState(0);
  
  // Obtener tokens del usuario si está autenticado
  useEffect(() => {
    if (user) {
      const fetchUserTokens = async () => {
        try {
          const { data } = await dataService.getById('profiles', user.id);
          if (data) {
            setUserTokens(data.tokens || 0);
            // Pre-llenar información del usuario
            setAppointmentData(prev => ({
              ...prev,
              name: data.full_name || '',
              email: user.email || '',
              phone: data.phone || ''
            }));
          }
        } catch (error) {
          console.error('Error al obtener tokens del usuario:', error);
        }
      };
      
      fetchUserTokens();
    }
  }, [user]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDateSelect = (date) => {
    setAppointmentData(prev => ({
      ...prev,
      date
    }));
  };
  
  const handleTimeSelect = (time) => {
    setAppointmentData(prev => ({
      ...prev,
      time
    }));
  };
  
  const handleNextStep = () => {
    // Validar dependiendo del paso actual
    if (step === 1) {
      if (!appointmentData.date || !appointmentData.time) {
        toast.error('Por favor seleccione una fecha y hora para su cita');
        return;
      }
    } else if (step === 2) {
      if (!appointmentData.name.trim() || !appointmentData.email.trim() || !appointmentData.phone.trim()) {
        toast.error('Por favor complete todos los campos obligatorios');
        return;
      }
      
      // Validar correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(appointmentData.email)) {
        toast.error('Por favor ingrese un correo electrónico válido');
        return;
      }
    }
    
    // Avanzar al siguiente paso
    setStep(step + 1);
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      // Verificar si el usuario tiene suficientes tokens
      if (user) {
        if (userTokens < appointmentData.tokensToUse) {
          toast.error('No tiene suficientes tokens. Por favor, adquiera más.');
          setLoading(false);
          return;
        }
        
        // Descontar tokens
        await dataService.update('profiles', user.id, {
          tokens: userTokens - appointmentData.tokensToUse
        });
      }
      
      // Guardar la cita en Supabase
      const appointmentId = 'CITA-' + Date.now().toString(36);
      
      await dataService.create('appointments', {
        id: appointmentId,
        user_id: user ? user.id : null,
        date: appointmentData.date.date.toISOString(),
        time: appointmentData.time.time,
        name: appointmentData.name,
        email: appointmentData.email,
        phone: appointmentData.phone,
        service: appointmentData.service,
        notes: appointmentData.notes,
        tokens_used: appointmentData.tokensToUse,
        status: 'scheduled',
        created_at: new Date().toISOString()
      });
      
      // Marcar como enviado y mostrar confirmación
      setSubmitted(true);
      toast.success('Cita agendada correctamente');
      
    } catch (error) {
      console.error('Error al agendar cita:', error);
      toast.error('Hubo un problema al agendar su cita. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // Renderizar pasos del formulario
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Seleccione Fecha y Hora</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableDays.map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    className={`py-2 px-3 rounded-md text-sm ${
                      appointmentData.date === day
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {day.formatted}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableHours.map((hour, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleTimeSelect(hour)}
                    className={`py-2 px-4 rounded-md text-sm ${
                      appointmentData.time === hour
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {hour.formatted}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo*
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={appointmentData.name}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Juan Pérez"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico*
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={appointmentData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono*
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={appointmentData.phone}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+593 99 123 4567"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Servicio
              </label>
              <select
                id="service"
                name="service"
                value={appointmentData.service}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="consulta-general">Consulta General</option>
                <option value="derecho-civil">Derecho Civil</option>
                <option value="derecho-penal">Derecho Penal</option>
                <option value="derecho-transito">Derecho de Tránsito</option>
                <option value="derecho-laboral">Derecho Laboral</option>
                <option value="derecho-aduanero">Derecho Aduanero</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notas Adicionales
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FaCommentAlt className="text-gray-400" />
                </div>
                <textarea
                  id="notes"
                  name="notes"
                  value={appointmentData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detalles adicionales sobre su caso o consulta..."
                />
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Confirmación de Cita</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <p className="flex justify-between">
                <span className="font-medium text-gray-600">Fecha:</span>
                <span>{appointmentData.date.formatted}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-600">Hora:</span>
                <span>{appointmentData.time.formatted}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-600">Servicio:</span>
                <span>
                  {appointmentData.service === 'consulta-general' && 'Consulta General'}
                  {appointmentData.service === 'derecho-civil' && 'Derecho Civil'}
                  {appointmentData.service === 'derecho-penal' && 'Derecho Penal'}
                  {appointmentData.service === 'derecho-transito' && 'Derecho de Tránsito'}
                  {appointmentData.service === 'derecho-laboral' && 'Derecho Laboral'}
                  {appointmentData.service === 'derecho-aduanero' && 'Derecho Aduanero'}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-600">Nombre:</span>
                <span>{appointmentData.name}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-600">Email:</span>
                <span>{appointmentData.email}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-600">Teléfono:</span>
                <span>{appointmentData.phone}</span>
              </p>
              {appointmentData.notes && (
                <div>
                  <span className="font-medium text-gray-600">Notas:</span>
                  <p className="mt-1 text-sm text-gray-600">{appointmentData.notes}</p>
                </div>
              )}
            </div>
            
            {user ? (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Tokens a utilizar</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">Tokens disponibles: {userTokens}</p>
                    <p className="text-sm text-blue-700 mt-1">Costo de esta cita: 1 token</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      name="tokensToUse"
                      min="1"
                      max={userTokens}
                      value={appointmentData.tokensToUse}
                      onChange={handleInputChange}
                      className="w-16 px-2 py-1 border border-blue-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Usar más tokens mejora la prioridad de su cita.
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-700">
                  Para agendar una cita, es necesario tener al menos 1 token.
                  <br />
                  <a 
                    href="/auth/register" 
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Regístrese aquí
                  </a> o 
                  <a 
                    href="/auth/login" 
                    className="text-blue-600 hover:text-blue-800 underline ml-1"
                  >
                    inicie sesión
                  </a> para continuar.
                </p>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Si la cita ya fue agendada, mostrar confirmación
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FaCheck className="text-green-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Cita Agendada!</h2>
          <p className="text-gray-700 mb-6">
            Su cita ha sido agendada exitosamente para el día {appointmentData.date.formatted} a las {appointmentData.time.formatted}.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
              Hemos enviado una confirmación a su correo electrónico. También recibirá un recordatorio 24 horas antes de su cita.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Ver Mis Citas
              </button>
            ) : (
              <button
                onClick={() => navigate('/auth/register')}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Crear una Cuenta
              </button>
            )}
            
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="bg-blue-600 p-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <FaCalendarAlt className="mr-2" />
          Agendar Cita
        </h2>
      </div>
      
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((stepNum) => (
              <React.Fragment key={stepNum}>
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div 
                    className={`flex-1 h-1 mx-2 ${
                      step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Fecha y Hora
            </span>
            <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Información
            </span>
            <span className={step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Confirmación
            </span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStepContent()}
          
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Anterior
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !user}
                className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Confirmar Cita'}
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AppointmentBooking;

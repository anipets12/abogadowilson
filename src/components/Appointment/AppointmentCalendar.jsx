import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaPhone, FaCommentAlt, FaCheck } from 'react-icons/fa';

const AppointmentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [bookingComplete, setBookingComplete] = useState(false);

  // Generar fechas disponibles (próximos 14 días)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      // Excluir fines de semana (6 = Sábado, 0 = Domingo)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    
    return dates;
  };

  // Horarios disponibles
  const availableTimes = [
    '09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'
  ];

  // Servicios legales disponibles
  const legalServices = [
    { id: 'penal', name: 'Derecho Penal' },
    { id: 'civil', name: 'Derecho Civil' },
    { id: 'comercial', name: 'Derecho Comercial' },
    { id: 'transito', name: 'Derecho de Tránsito' },
    { id: 'aduanas', name: 'Derecho de Aduanas' },
    { id: 'consulta', name: 'Consulta General' }
  ];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => {
    if (step === 1 && !selectedDate) {
      alert('Por favor seleccione una fecha para su cita');
      return;
    }
    
    if (step === 2 && !selectedTime) {
      alert('Por favor seleccione una hora para su cita');
      return;
    }
    
    if (step === 3 && !selectedService) {
      alert('Por favor seleccione el tipo de servicio legal que necesita');
      return;
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.email || !formData.telefono) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }
    
    setLoading(true);
    
    // Simulación de envío de datos (en implementación real conectaría con Supabase o API de calendario)
    setTimeout(() => {
      setLoading(false);
      setBookingComplete(true);
      
      // En implementación real:
      // 1. Guardar la cita en la base de datos
      // 2. Enviar confirmación por email
      // 3. Sincronizar con Google Calendar (opcional)
    }, 1500);
  };

  const formatDate = (date) => {
    if (!date) return '';
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Agende una Cita con el Abg. Wilson Ipiales</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Seleccione la fecha y hora que mejor se ajuste a su agenda para hablar con un profesional 
              sobre su caso legal.
            </p>
          </div>
          
          {/* Barra de progreso */}
          {!bookingComplete && (
            <div className="mb-10">
              <div className="flex justify-between mb-2">
                {['Fecha', 'Hora', 'Servicio', 'Información Personal'].map((label, index) => (
                  <div 
                    key={index}
                    className={`text-sm font-medium ${step > index + 1 ? 'text-blue-600' : 'text-gray-500'}`}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {!bookingComplete ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Paso 1: Selección de fecha */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 md:p-8"
                >
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <FaCalendarAlt className="text-blue-600 mr-2" /> Seleccione una fecha
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {generateAvailableDates().map((date, index) => (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(date)}
                        className={`p-3 rounded-lg border text-center transition-colors ${
                          selectedDate && selectedDate.toDateString() === date.toDateString()
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <p className="text-sm font-medium">
                          {date.toLocaleDateString('es-ES', { weekday: 'short' })}
                        </p>
                        <p className="text-lg font-bold">
                          {date.getDate()}
                        </p>
                        <p className="text-xs">
                          {date.toLocaleDateString('es-ES', { month: 'short' })}
                        </p>
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex justify-end mt-8">
                    <button
                      onClick={nextStep}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Continuar
                    </button>
                  </div>
                </motion.div>
              )}
              
              {/* Paso 2: Selección de hora */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 md:p-8"
                >
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <FaClock className="text-blue-600 mr-2" /> Seleccione una hora
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Fecha seleccionada: <span className="font-semibold">{formatDate(selectedDate)}</span>
                  </p>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {availableTimes.map((time, index) => (
                      <button
                        key={index}
                        onClick={() => handleTimeSelect(time)}
                        className={`p-3 rounded-lg border text-center transition-colors ${
                          selectedTime === time
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <button
                      onClick={prevStep}
                      className="text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={nextStep}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Continuar
                    </button>
                  </div>
                </motion.div>
              )}
              
              {/* Paso 3: Selección de servicio */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 md:p-8"
                >
                  <h3 className="text-xl font-bold mb-6">
                    Seleccione el tipo de servicio
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Cita programada para: <span className="font-semibold">{formatDate(selectedDate)}</span> a las <span className="font-semibold">{selectedTime}</span>
                  </p>
                  
                  <div className="space-y-3">
                    {legalServices.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`w-full flex items-center p-4 rounded-lg border transition-colors ${
                          selectedService === service.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          selectedService === service.id ? 'bg-blue-600 text-white' : 'bg-gray-100'
                        }`}>
                          {selectedService === service.id ? <FaCheck /> : null}
                        </div>
                        <span className="font-medium">{service.name}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <button
                      onClick={prevStep}
                      className="text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={nextStep}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Continuar
                    </button>
                  </div>
                </motion.div>
              )}
              
              {/* Paso 4: Información personal */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 md:p-8"
                >
                  <h3 className="text-xl font-bold mb-6">
                    Complete sus datos de contacto
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-6">
                    Cita programada para: <span className="font-semibold">{formatDate(selectedDate)}</span> a las <span className="font-semibold">{selectedTime}</span>
                  </p>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <FaUser className="inline-block mr-2 text-blue-600" /> Nombre Completo *
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ingrese su nombre y apellido"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <FaEnvelope className="inline-block mr-2 text-blue-600" /> Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="ejemplo@correo.com"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <FaPhone className="inline-block mr-2 text-blue-600" /> Teléfono *
                        </label>
                        <input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+593 XXXXXXXXX"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <FaCommentAlt className="inline-block mr-2 text-blue-600" /> Mensaje (Opcional)
                        </label>
                        <textarea
                          name="mensaje"
                          value={formData.mensaje}
                          onChange={handleInputChange}
                          rows="4"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Describa brevemente su caso o consulta"
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                      <p className="text-sm text-gray-700">
                        <strong>Nota:</strong> Al agendar esta cita, está reservando un espacio con el Abg. Wilson Ipiales.
                        Recibirá una confirmación por correo electrónico con los detalles de su cita.
                      </p>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Anterior
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        {loading ? 'Procesando...' : 'Confirmar Cita'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-8 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheck className="text-green-600 text-3xl" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">¡Cita Confirmada!</h3>
              
              <p className="text-gray-600 mb-6">
                Su cita ha sido programada exitosamente para el <span className="font-semibold">{formatDate(selectedDate)}</span> a las <span className="font-semibold">{selectedTime}</span>.
                Hemos enviado una confirmación a su correo electrónico. 
              </p>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
                <h4 className="font-bold text-lg mb-3">Detalles de la Cita:</h4>
                <ul className="space-y-3">
                  <li className="flex">
                    <span className="font-medium w-32">Fecha:</span>
                    <span>{formatDate(selectedDate)}</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium w-32">Hora:</span>
                    <span>{selectedTime}</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium w-32">Servicio:</span>
                    <span>{legalServices.find(s => s.id === selectedService)?.name}</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium w-32">Dirección:</span>
                    <span>Juan José Flores 4-73 y Vicente Rocafuerte, Ibarra, Ecuador</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <a
                  href="/"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Volver al Inicio
                </a>
                <a
                  href="/dashboard"
                  className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Ver Mis Citas
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import TurnstileWidget from '../TurnstileWidget';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente para programar citas con el abogado
 * Integrado con Google Calendar y Turnstile para seguridad
 */
const AppointmentScheduler = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    reason: '',
    area: 'general'
  });

  // u00c1reas legales disponibles para citas
  const legalAreas = [
    { value: 'general', label: 'Consulta General' },
    { value: 'penal', label: 'Derecho Penal' },
    { value: 'civil', label: 'Derecho Civil' },
    { value: 'laboral', label: 'Derecho Laboral' },
    { value: 'mercantil', label: 'Derecho Mercantil' },
    { value: 'familia', label: 'Derecho de Familia' },
    { value: 'transito', label: 'Derecho de Tru00e1nsito' },
    { value: 'administrativo', label: 'Derecho Administrativo' }
  ];

  // Fechas disponibles (pru00f3ximos 14 du00edas, excluyendo su00e1bados y domingos)
  useEffect(() => {
    generateAvailableDates();
  }, []);

  const generateAvailableDates = () => {
    setLoading(true);
    
    const dates = [];
    const now = new Date();
    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 20); // Mostrar disponibilidad para los pru00f3ximos 20 du00edas
    
    // Generar fechas
    for (let d = new Date(now); d <= maxDate; d.setDate(d.getDate() + 1)) {
      // Excluir fin de semana (0 = Domingo, 6 = Su00e1bado)
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        dates.push(new Date(d));
      }
    }
    
    // Convertir a formato de fecha YYYY-MM-DD
    const formattedDates = dates.map(date => {
      return {
        date: date.toISOString().split('T')[0],
        dateDisplay: formatDateDisplay(date)
      };
    });
    
    setAvailableSlots(formattedDates);
    setLoading(false);
  };

  // Formatear fecha para mostrar
  const formatDateDisplay = (date) => {
    // Formatear como "Lunes, 15 de Abril de 2025"
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  // Horarios disponibles (9am a 5pm)
  const getAvailableTimeSlots = () => {
    const slots = [];
    
    // Horarios de 9am a 5pm con intervalos de 1 hora
    for (let hour = 9; hour <= 17; hour++) {
      slots.push({
        value: `${hour}:00`,
        label: `${hour}:00${hour < 12 ? ' AM' : ' PM'}`
      });
    }
    
    return slots;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointmentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Resetear horario al cambiar fecha
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar que Turnstile estu00e9 completo
    if (!turnstileVerified) {
      toast.error('Por favor, complete la verificaciu00f3n de seguridad');
      return;
    }
    
    // Validar fecha y hora seleccionadas
    if (!selectedDate || !selectedTime) {
      toast.error('Por favor, seleccione una fecha y hora para su cita');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Preparar datos para API
      const appointmentData = {
        ...appointmentDetails,
        date: selectedDate,
        time: selectedTime,
        dateTime: `${selectedDate}T${selectedTime}:00`,
        status: 'pending'
      };
      
      // Enviar datos a la API
      const response = await fetch('/api/appointments/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al programar la cita');
      }
      
      // Mostrar mensaje de u00e9xito
      toast.success('Cita programada correctamente. Recibiru00e1 una confirmacion por correo electru00f3nico.');
      
      // Resetear formulario
      setSelectedDate('');
      setSelectedTime('');
      setTurnstileVerified(false);
      setAppointmentDetails({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        reason: '',
        area: 'general'
      });
      
    } catch (error) {
      console.error('Error al programar cita:', error);
      toast.error(error.message || 'Ha ocurrido un error al programar la cita');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Agendar una Cita</h2>
      <p className="text-gray-600 mb-6">Por favor, seleccione una fecha y hora para su cita con nuestro equipo legal.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos personales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={appointmentDetails.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electru00f3nico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={appointmentDetails.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telu00e9fono</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={appointmentDetails.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700">u00c1rea legal</label>
            <select
              id="area"
              name="area"
              value={appointmentDetails.area}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {legalAreas.map(area => (
                <option key={area.value} value={area.value}>{area.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Motivo de la consulta</label>
          <textarea
            id="reason"
            name="reason"
            rows="3"
            value={appointmentDetails.reason}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describa brevemente el asunto que desea consultar..."
            required
          ></textarea>
        </div>
        
        {/* Selecciu00f3n de fecha */}
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-2">Seleccione una fecha:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot.date}
                type="button"
                onClick={() => handleDateSelect(slot.date)}
                className={`px-3 py-2 text-sm border ${selectedDate === slot.date ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {slot.dateDisplay}
              </button>
            ))}
          </div>
        </div>
        
        {/* Selecciu00f3n de hora (solo visible si se ha seleccionado una fecha) */}
        {selectedDate && (
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Seleccione una hora:</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {getAvailableTimeSlots().map((slot) => (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => setSelectedTime(slot.value)}
                  className={`px-3 py-2 text-sm border ${selectedTime === slot.value ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Resumen de la cita */}
        {selectedDate && selectedTime && (
          <div className="bg-blue-50 p-4 rounded-lg my-4">
            <h3 className="text-md font-medium text-blue-700 mb-2">Resumen de la cita:</h3>
            <p className="text-blue-600">
              <strong>Fecha:</strong> {availableSlots.find(slot => slot.date === selectedDate)?.dateDisplay}<br />
              <strong>Hora:</strong> {getAvailableTimeSlots().find(slot => slot.value === selectedTime)?.label}
            </p>
          </div>
        )}
        
        {/* Turnstile */}
        <div className="mt-4">
          <TurnstileWidget
            onVerify={() => setTurnstileVerified(true)}
            onExpire={() => setTurnstileVerified(false)}
            onError={(msg) => {
              toast.error(`Error en verificaciu00f3n: ${msg}`);
              setTurnstileVerified(false);
            }}
            action="schedule_appointment"
            theme="light"
          />
        </div>
        
        {/* Botu00f3n de enviar */}
        <div className="mt-4">
          <button
            type="submit"
            disabled={isSubmitting || !turnstileVerified || !selectedDate || !selectedTime}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(isSubmitting || !turnstileVerified || !selectedDate || !selectedTime) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Procesando...' : 'Agendar Cita'}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Al agendar esta cita, acepta nuestra <a href="/politica-privacidad" className="text-blue-600 hover:underline">Polu00edtica de Privacidad</a> y
          los <a href="/terminos-condiciones" className="text-blue-600 hover:underline">Tu00e9rminos y Condiciones</a>.
        </p>
      </form>
    </div>
  );
};

export default AppointmentScheduler;

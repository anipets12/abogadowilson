import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaUser, FaPaperPlane, FaTimes, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
// Futura importación del servicio de Mistral
// import { mistralService } from '../../services/mistralService';

const IntelligentChatbot = () => {
  const { user } = useAuth() || { user: null };
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Scroll automático a último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    
    try {
      // Aquí llamaríamos al servicio de Mistral
      // En futuras implementaciones, cuando esté listo Mistral API
      // const response = await mistralService.generateLegalAdvice(inputMessage, "general");
      
      // Simulamos una respuesta para la demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const botResponse = {
        id: Date.now() + 1,
        text: respuestaSimulada(inputMessage),
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      // Guardar conversación en base de datos si el usuario está logueado
      if (user) {
        // Futura implementación: guardar conversación
        // saveConversation(userMessage, botResponse);
      }
      
    } catch (error) {
      console.error('Error al generar respuesta:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Lo siento, hubo un error al procesar su consulta. Por favor, intente nuevamente o contáctenos directamente por WhatsApp.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        error: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  // Función para generar respuestas simuladas basadas en palabras clave
  const respuestaSimulada = (pregunta) => {
    const preguntaLower = pregunta.toLowerCase();
    
    if (preguntaLower.includes('penal') || preguntaLower.includes('delito')) {
      return "En casos de derecho penal, es crucial contar con representación legal desde el inicio del proceso. El Abogado Wilson Ipiales puede asistirle con su amplia experiencia en defensa penal, asegurando que sus derechos sean respetados durante todo el procedimiento. ¿Desea programar una consulta para analizar su caso específico?";
    } 
    
    if (preguntaLower.includes('civil') || preguntaLower.includes('contrato') || preguntaLower.includes('demanda')) {
      return "Para asuntos de derecho civil como contratos, obligaciones o demandas, el Abogado Wilson Ipiales ofrece asesoría completa para proteger sus intereses. Cada caso civil requiere un análisis detallado de documentos y circunstancias. Le recomendamos agendar una consulta personal donde podremos evaluar su situación particular y ofrecerle las mejores estrategias legales.";
    }
    
    if (preguntaLower.includes('tránsito') || preguntaLower.includes('accidente') || preguntaLower.includes('multa')) {
      return "En asuntos de tránsito, el Abogado Wilson Ipiales puede ayudarle con impugnaciones de multas, defensa en accidentes de tránsito o procesos administrativos ante la ANT. Estos casos requieren actuar con rapidez para preservar evidencia y presentar los recursos dentro de los plazos legales. ¿Le gustaría programar una consulta para discutir su caso?";
    }
    
    if (preguntaLower.includes('precio') || preguntaLower.includes('costo') || preguntaLower.includes('cuánto')) {
      return "Las tarifas profesionales del Abogado Wilson Ipiales varían según el tipo y complejidad del caso. Ofrecemos una primera consulta gratuita para evaluar su situación y proporcionarle un presupuesto transparente. Puede programar esta consulta inicial a través de nuestro sitio web o contactándonos directamente por WhatsApp.";
    }
    
    if (preguntaLower.includes('horario') || preguntaLower.includes('disponible') || preguntaLower.includes('oficina')) {
      return "El horario de atención es de lunes a viernes de 8:00 a 18:00. Las consultas se realizan previa cita en nuestra oficina ubicada en Juan José Flores 4-73 y Vicente Rocafuerte, Ibarra, Ecuador. También ofrecemos consultas virtuales para su comodidad. ¿Desea agendar una cita?";
    }
    
    // Mensaje predeterminado
    return "¡Hola! Soy el asistente virtual del Abogado Wilson Ipiales. Puedo ayudarle con información sobre nuestros servicios legales en derecho penal, civil, tránsito y otras áreas. Para recibir asesoría legal personalizada sobre su caso específico, le recomendamos agendar una consulta con el abogado. ¿En qué puedo ayudarle hoy?";
  };
  
  const toggleChat = () => {
    setExpanded(!expanded);
    
    // Si es la primera vez que se abre, agregar mensaje inicial
    if (!expanded && messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          text: "¡Hola! Soy el asistente virtual del Abogado Wilson Ipiales. ¿En qué puedo ayudarle hoy?",
          sender: 'bot',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-white rounded-lg shadow-xl w-80 sm:w-96 mb-4 overflow-hidden border border-gray-200"
        >
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <FaRobot className="mr-2" />
              <span className="font-medium">Asistente Legal</span>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 bg-gray-50">
            <AnimatePresence>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : msg.error
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {msg.sender === 'user' ? (
                        <FaUser className="mr-1 text-xs" />
                      ) : (
                        <FaRobot className="mr-1 text-xs" />
                      )}
                      <span className="text-xs">
                        {msg.sender === 'user' ? 'Usted' : 'Asistente'}
                      </span>
                    </div>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start mb-3"
                >
                  <div className="bg-gray-200 rounded-lg px-4 py-2 text-gray-800">
                    <div className="flex items-center">
                      <FaSpinner className="animate-spin mr-2" />
                      <span className="text-sm">Generando respuesta...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>
          
          <div className="p-3 border-t border-gray-200">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Escriba su consulta..."
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 focus:outline-none disabled:opacity-50"
              >
                <FaPaperPlane />
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-1">
              {user ? 'Consulta almacenada en su perfil' : 'Inicie sesión para guardar su historial'}
            </p>
          </div>
        </motion.div>
      )}
      
      <button
        onClick={toggleChat}
        className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
      >
        {expanded ? <FaTimes /> : <FaRobot />}
      </button>
    </div>
  );
};

export default IntelligentChatbot;

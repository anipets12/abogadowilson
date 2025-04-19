import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaUser, FaPaperPlane, FaTimes, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
// Futura importaciu00f3n del servicio de Mistral
// import { mistralService } from '../../services/mistralService';

const IntelligentChatbot = () => {
  const { user } = useAuth() || { user: null };
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Scroll automu00e1tico a u00faltimo mensaje
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
      // Aquu00ed llamaru00edamos al servicio de Mistral
      // En futuras implementaciones, cuando estu00e9 listo Mistral API
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
      
      // Guardar conversaciu00f3n en base de datos si el usuario estu00e1 logueado
      if (user) {
        // Futura implementaciu00f3n: guardar conversaciu00f3n
        // saveConversation(userMessage, botResponse);
      }
      
    } catch (error) {
      console.error('Error al generar respuesta:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Lo siento, hubo un error al procesar su consulta. Por favor, intente nuevamente o contu00e1ctenos directamente por WhatsApp.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        error: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  // Funciu00f3n para generar respuestas simuladas basadas en palabras clave
  const respuestaSimulada = (pregunta) => {
    const preguntaLower = pregunta.toLowerCase();
    
    if (preguntaLower.includes('penal') || preguntaLower.includes('delito')) {
      return "En casos de derecho penal, es crucial contar con representaciu00f3n legal desde el inicio del proceso. El Abogado Wilson Ipiales puede asistirle con su amplia experiencia en defensa penal, asegurando que sus derechos sean respetados durante todo el procedimiento. u00bfDesea programar una consulta para analizar su caso especu00edfico?";
    } 
    
    if (preguntaLower.includes('civil') || preguntaLower.includes('contrato') || preguntaLower.includes('demanda')) {
      return "Para asuntos de derecho civil como contratos, obligaciones o demandas, el Abogado Wilson Ipiales ofrece asesoru00eda completa para proteger sus intereses. Cada caso civil requiere un anu00e1lisis detallado de documentos y circunstancias. Le recomendamos agendar una consulta personal donde podremos evaluar su situaciu00f3n particular y ofrecerle las mejores estrategias legales.";
    }
    
    if (preguntaLower.includes('tru00e1nsito') || preguntaLower.includes('accidente') || preguntaLower.includes('multa')) {
      return "En casos de tru00e1nsito, ya sea por accidentes, multas o impugnaciones, es importante actuar ru00e1pidamente para preservar evidencia y derechos. El Abogado Wilson Ipiales tiene amplia experiencia en la Ley Orgu00e1nica de Transporte Terrestre y puede representarlo efectivamente. Para una evaluaciu00f3n completa de su caso, le sugerimos contactarnos para una cita personal.";
    }
    
    if (preguntaLower.includes('costo') || preguntaLower.includes('precio') || preguntaLower.includes('honorarios')) {
      return "Los honorarios profesionales varu00edan segu00fan la complejidad del caso, el tiempo requerido y el tipo de servicio legal. El Abogado Wilson Ipiales ofrece una primera consulta informativa a un costo accesible donde podru00e1 conocer mu00e1s detalles. Para casos especiales, tambiu00e9n contamos con planes de pago flexibles. u00bfDesearu00eda agendar esta consulta inicial?";
    }
    
    if (preguntaLower.includes('cita') || preguntaLower.includes('consulta') || preguntaLower.includes('turno')) {
      return "Para agendar una consulta con el Abogado Wilson Ipiales, puede utilizar nuestro sistema de citas en lu00ednea en la secciu00f3n 'Agendar Cita' de este sitio web, contactarnos por WhatsApp al +593988835269, o llamar directamente a nuestras oficinas. Se recomienda mencionar brevemente el tipo de caso para una mejor preparaciu00f3n de su consulta. u00bfEn quu00e9 horario le seru00eda mu00e1s conveniente?";
    }
    
    // Respuesta genu00e9rica si no coincide con ninguna categoru00eda
    return "Gracias por su consulta. El Abogado Wilson Alexander Ipiales Guerru00f3n ofrece servicios legales especializados en derecho penal, civil, tru00e1nsito y otras u00e1reas del derecho ecuatoriano. Para recibir asesoru00eda personalizada sobre su caso especu00edfico, le recomendamos agendar una consulta donde podremos analizar en detalle su situaciu00f3n y ofrecerle las mejores opciones legales. u00bfHay algu00fan u00e1rea legal especu00edfica sobre la que tenga dudas?";
  };
  
  const toggleChat = () => {
    setExpanded(!expanded);
    
    // Si es la primera vez que se abre, agregar mensaje inicial
    if (!expanded && messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          text: "u00a1Hola! Soy el asistente virtual del Abogado Wilson Ipiales. u00bfEn quu00e9 puedo ayudarle hoy?",
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
              {user ? 'Consulta almacenada en su perfil' : 'Inicie sesiu00f3n para guardar su historial'}
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

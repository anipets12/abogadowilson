import React, { useState, useEffect, useRef } from 'react';
import { FaSpinner, FaComment, FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { tokenService } from '../../services/tokenService';

const LiveChat = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: '¡Hola! Soy el asistente legal del Abg. Wilson Ipiales. ¿En qué puedo ayudarte hoy?', sender: 'bot', timestamp: new Date() }
  ]);
  const [loading, setLoading] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    };
    
    const handleResize = () => {
      setShowMobileChat(checkMobile());
    };
    
    // Comprobar inicialmente
    handleResize();
    
    // Actualizar en cambio de tamaño
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Scroll automático al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Enviar mensaje a la API de Chat
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const userMessage = { id: Date.now(), text: message, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    
    const userInput = message;
    setMessage('');
    setLoading(true);
    
    // Verificar si el usuario está autenticado y tiene tokens (si es una consulta que los requiere)
    let tokenUsed = false;
    if (user && message.length > 50) { // Mensajes largos se consideran consultas formales
      try {
        const tokenResult = await tokenService.useToken(user.id, 'consulta-simple');
        if (!tokenResult.success && tokenResult.insufficientTokens) {
          // Si no tiene suficientes tokens
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: 'Para consultas detalladas, necesitas tokens disponibles. ¿Deseas recargar tokens o iniciar sesión?',
            sender: 'bot',
            timestamp: new Date(),
            action: 'token_needed'
          }]);
          setLoading(false);
          return;
        }
        tokenUsed = tokenResult.success;
      } catch (error) {
        console.error('Error al usar token:', error);
        // Continuar sin usar token en caso de error
      }
    }
    
    try {
      // Llamar a la API de chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userInput })
      });
      
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Agregar respuesta del bot
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: data.response || 'Lo siento, no pude procesar tu consulta.',
        sender: 'bot',
        timestamp: new Date(),
        provider: data.provider,
        tokenUsed
      }]);
      
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      // Mensaje de error
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo más tarde.',
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      }]);
      toast.error('Error de conexión con el servicio de chat');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTokenAction = () => {
    // Redireccionar a la página de tokens o iniciar sesión
    if (user) {
      window.location.href = '/tokens';
    } else {
      window.location.href = '/login?redirect=tokens';
    }
  };

  // Función para formatear la hora
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Renderizado optimizado para móvil
  return (
    <div className={`${showMobileChat ? 'fixed inset-0 z-50' : 'fixed right-4 bottom-4 z-50'}`}>
      {isOpen ? (
        <div 
          className={`bg-white shadow-xl overflow-hidden flex flex-col transition-all transform scale-100
            ${showMobileChat ? 'fixed inset-0 rounded-none' : 'rounded-lg w-80 max-h-[500px]'}`}
        >
          {/* Cabecera del chat */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <FaRobot className="mr-2 h-5 w-5" />
              <h3 className="font-medium">Asistente Legal</h3>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white focus:outline-none p-1 rounded-full hover:bg-blue-700"
              aria-label="Cerrar chat"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          
          {/* Contenedor de mensajes */}
          <div 
            ref={chatContainerRef}
            className="flex-grow p-4 bg-gray-50 overflow-y-auto"
            style={{ maxHeight: showMobileChat ? 'calc(100vh - 130px)' : '340px' }}
          >
            {/* Mensajes */}
            {messages.map((msg) => (
              <div key={msg.id} className="mb-4">
                {/* Mensaje de usuario */}
                {msg.sender === 'user' && (
                  <div className="flex flex-col items-end">
                    <div className="bg-blue-500 text-white p-3 rounded-lg rounded-tr-none max-w-[80%] break-words">
                      {msg.text}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{formatTime(msg.timestamp)}</span>
                  </div>
                )}
                
                {/* Mensaje del bot */}
                {msg.sender === 'bot' && (
                  <div className="flex flex-col items-start">
                    <div className={`p-3 rounded-lg rounded-tl-none max-w-[80%] break-words ${msg.isError ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-800'}`}>
                      {msg.text}
                      
                      {/* Botón de acción si se requieren tokens */}
                      {msg.action === 'token_needed' && (
                        <button
                          onClick={handleTokenAction}
                          className="mt-2 w-full py-1 px-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
                        >
                          {user ? 'Recargar Tokens' : 'Iniciar Sesión'}
                        </button>
                      )}
                      
                      {/* Información de proveedor de IA */}
                      {msg.provider && (
                        <div className="mt-1 text-xs text-gray-500">
                          {msg.tokenUsed && <span className="font-medium text-blue-600">(-1 token) </span>}
                          vía {msg.provider === 'google_ai' ? 'Google AI' : 'OpenRouter'}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{formatTime(msg.timestamp)}</span>
                  </div>
                )}
              </div>
            ))}
            
            {/* Indicador de carga */}
            {loading && (
              <div className="flex items-center space-x-2 text-gray-500">
                <FaSpinner className="animate-spin" />
                <span>Procesando respuesta...</span>
              </div>
            )}
            
            {/* Elemento para auto-scroll */}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Formulario de entrada */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escriba su consulta legal..."
              className="flex-grow rounded-l-lg px-3 py-2 border-t border-l border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <FaSpinner className="animate-spin h-5 w-5" /> : <FaPaperPlane className="h-5 w-5" />}
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className={`flex items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500
            ${showMobileChat ? 'bottom-4 right-4 fixed w-14 h-14' : 'w-14 h-14'}`}
          aria-label="Abrir chat"
        >
          <FaComment className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default LiveChat;

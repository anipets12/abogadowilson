import React, { useState, useEffect } from 'react';
import { WHATSAPP_CONFIG, whatsappService } from '../../services/whatsappService';
import { FaWhatsapp, FaPaperPlane, FaPhoneAlt, FaSyncAlt, FaHistory, FaRobot, FaCog, FaSearchPlus, FaKeyboard, FaDatabase, FaBell } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const WhatsAppManager = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [configValid, setConfigValid] = useState(false);
  const [messageType, setMessageType] = useState('text');
  const [messageHistory, setMessageHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [n8nWebhookStatus, setN8nWebhookStatus] = useState('unknown');
  
  useEffect(() => {
    // Verificar configuración de WhatsApp
    checkWhatsAppConfig();
    
    // Cargar plantillas de ejemplo
    const templateExamples = whatsappService.getTemplateExamples();
    setTemplates(templateExamples);
    
    // Cargar historial de mensajes
    fetchMessageHistory();
    
    // Verificar estado de webhook de n8n
    checkN8nWebhookStatus();
  }, []);
  
  const checkWhatsAppConfig = () => {
    setConfigLoading(true);
    
    // Verificar que las credenciales de WhatsApp estén configuradas
    const configured = !!WHATSAPP_CONFIG.accessToken && 
      !!WHATSAPP_CONFIG.phoneNumberId && 
      !!WHATSAPP_CONFIG.businessAccountId;
    
    setConfigValid(configured);
    setConfigLoading(false);
    
    // Mostrar mensaje con la información del estado de configuración
    if (configured) {
      console.log('Configuración de WhatsApp cargada correctamente');
    } else {
      console.warn('Configuración de WhatsApp incompleta');
    }
    
    return configured;
  };
  
  const fetchMessageHistory = async () => {
    try {
      // En un entorno real, esto se obtendría de la API
      // Simulamos historial para demo
      const mockHistory = [
        {
          id: 'wamid.123456789',
          phone: '+593987654321',
          message: 'Hola, necesito asesoría legal urgente',
          type: 'received',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'wamid.987654321',
          phone: '+593987654321',
          message: 'Gracias por contactar al Abogado Wilson. ¿En qué podemos ayudarle?',
          type: 'sent',
          timestamp: new Date(Date.now() - 3500000).toISOString()
        },
        {
          id: 'wamid.123456790',
          phone: '+593987654321',
          message: 'Tengo un problema con una multa de tránsito',
          type: 'received',
          timestamp: new Date(Date.now() - 3400000).toISOString()
        },
        {
          id: 'wamid.987654322',
          phone: '+593987654321',
          message: 'Entiendo. Le recomendamos agendar una consulta con nuestro especialista en derecho de tránsito. ¿Le gustaría programar una cita?',
          type: 'sent',
          timestamp: new Date(Date.now() - 3300000).toISOString()
        }
      ];
      
      setMessageHistory(mockHistory);
    } catch (error) {
      console.error('Error al cargar historial de mensajes:', error);
      toast.error('No se pudo cargar el historial de mensajes');
    }
  };
  
  const checkN8nWebhookStatus = async () => {
    try {
      // En un entorno real, verificaríamos la conexión con n8n
      // Para demo, simulamos una verificación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulamos éxito para demostración
      setN8nWebhookStatus('active');
    } catch (error) {
      console.error('Error al verificar estado de webhook n8n:', error);
      setN8nWebhookStatus('error');
    }
  };
  
  const handleSendMessage = async () => {
    if (!phoneNumber) {
      toast.error('Ingrese un número de teléfono válido');
      return;
    }
    
    if (messageType === 'text' && !message) {
      toast.error('Ingrese un mensaje para enviar');
      return;
    }
    
    if (messageType === 'template' && !selectedTemplate) {
      toast.error('Seleccione una plantilla para enviar');
      return;
    }
    
    if (!configValid) {
      toast.error('La configuración de WhatsApp no es válida');
      return;
    }
    
    try {
      setLoading(true);
      let response;
      
      // Almacenar los datos del token de forma segura para uso exclusivo de la API
      const token = process.env.REACT_APP_WHATSAPP_ACCESS_TOKEN || WHATSAPP_CONFIG.accessToken;
      // No almacenar el token en variables de estado o exponerlo en logs
      
      if (messageType === 'text') {
        response = await whatsappService.sendTextMessage(phoneNumber, message);
      } else if (messageType === 'template') {
        const template = templates.find(t => t.name === selectedTemplate);
        if (!template) throw new Error('Plantilla no encontrada');
        
        response = await whatsappService.sendTemplateMessage(
          phoneNumber, 
          template.name, 
          template.languageCode
        );
      }
      
      if (response.success) {
        toast.success('Mensaje enviado correctamente');
        
        // Agregar mensaje al historial
        const newMessage = {
          id: response.messageId || `local-${Date.now()}`,
          phone: phoneNumber,
          message: messageType === 'text' ? message : `Plantilla: ${selectedTemplate}`,
          type: 'sent',
          timestamp: new Date().toISOString()
        };
        
        setMessageHistory([newMessage, ...messageHistory]);
        
        // Limpiar formulario
        setMessage('');
        setSelectedTemplate('');
      } else {
        throw new Error(response.error || 'Error al enviar mensaje');
      }
    } catch (error) {
      console.error('Error al enviar mensaje WhatsApp:', error);
      toast.error(error.message || 'Error al enviar mensaje');
    } finally {
      setLoading(false);
    }
  };
  
  const formatPhoneNumber = (number) => {
    return number.startsWith('+') ? number : `+${number}`;
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <h2 className="text-xl font-bold flex items-center">
          <FaWhatsapp className="mr-2" /> WhatsApp Business API
        </h2>
        <p className="text-sm text-green-100">Envíe mensajes y gestione conversaciones con WhatsApp Business API</p>
      </div>
      
      {/* Estado de la configuración */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full mr-2 ${configValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              {configLoading ? 'Verificando configuración...' : 
               configValid ? 'API de WhatsApp configurada' : 'API de WhatsApp no configurada'}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <span className="mr-3">
              <span className="text-gray-500">ID:</span> {WHATSAPP_CONFIG.phoneNumberId?.substring(0, 8)}...
            </span>
            <button 
              onClick={checkWhatsAppConfig}
              className="text-blue-600 hover:text-blue-800"
              disabled={configLoading}
            >
              <FaSyncAlt className={`${configLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulario de envío */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Enviar mensaje</h3>
            
            {/* Selección de tipo de mensaje */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de mensaje</label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setMessageType('text')}
                  className={`flex-1 py-2 px-3 rounded-md border ${messageType === 'text' ? 'bg-green-50 text-green-700 border-green-500' : 'bg-white border-gray-300'}`}
                >
                  <FaKeyboard className="inline mr-2" />
                  Texto
                </button>
                <button
                  type="button"
                  onClick={() => setMessageType('template')}
                  className={`flex-1 py-2 px-3 rounded-md border ${messageType === 'template' ? 'bg-green-50 text-green-700 border-green-500' : 'bg-white border-gray-300'}`}
                >
                  <FaDatabase className="inline mr-2" />
                  Plantilla
                </button>
              </div>
            </div>
            
            {/* Número de teléfono */}
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Número de teléfono
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhoneAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+593987654321"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Formato internacional con código de país (ej: +593987654321)</p>
            </div>
            
            {/* Mensaje de texto */}
            {messageType === 'text' && (
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Escriba su mensaje aquí..."
                ></textarea>
                <div className="mt-1 flex justify-between">
                  <p className="text-xs text-gray-500">Máximo 1000 caracteres</p>
                  <p className="text-xs text-gray-500">{message.length}/1000</p>
                </div>
              </div>
            )}
            
            {/* Selección de plantilla */}
            {messageType === 'template' && (
              <div className="mb-4">
                <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">
                  Plantilla
                </label>
                <select
                  id="template"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Seleccione una plantilla</option>
                  {templates.map((template) => (
                    <option key={template.name} value={template.name}>
                      {template.name} - {template.description}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Las plantillas deben estar aprobadas en su cuenta de WhatsApp Business
                </p>
              </div>
            )}
            
            {/* Botón de envío */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={loading || !configValid}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading || !configValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {loading ? (
                  <>
                    <FaSyncAlt className="animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    Enviar mensaje
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Panel de monitoreo */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Monitoreo</h3>
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <FaHistory className="mr-1" />
                {showHistory ? 'Ocultar historial' : 'Ver historial'}
              </button>
            </div>
            
            {/* Estado de integración con n8n */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 flex items-center mb-2">
                <FaRobot className="mr-2 text-purple-600" />
                Integración con n8n
              </h4>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`h-2.5 w-2.5 rounded-full mr-2 ${n8nWebhookStatus === 'active' ? 'bg-green-500' : n8nWebhookStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-sm">
                    {n8nWebhookStatus === 'active' ? 'Conectado' : 
                     n8nWebhookStatus === 'error' ? 'Error de conexión' : 
                     'Verificando...'}
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={checkN8nWebhookStatus}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  <FaSyncAlt className={n8nWebhookStatus === 'unknown' ? 'animate-spin' : ''} />
                </button>
              </div>
              
              {n8nWebhookStatus === 'active' && (
                <div className="mt-3 text-xs text-green-700 flex items-center">
                  <FaBell className="mr-1" />
                  Las notificaciones automáticas están activadas
                </div>
              )}
              
              {n8nWebhookStatus === 'error' && (
                <div className="mt-3 text-xs text-red-700">
                  No se pudo conectar con el webhook de n8n. Verifique la configuración.
                </div>
              )}
            </div>
            
            {/* Historial de mensajes */}
            {showHistory && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700">Historial reciente</h4>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {messageHistory.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {messageHistory.map((item) => (
                        <li key={item.id} className="p-4 hover:bg-gray-50">
                          <div className={`flex ${item.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs sm:max-w-sm rounded-lg px-4 py-2 ${item.type === 'sent' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              <p className="text-sm">{item.message}</p>
                              <div className="mt-1 flex justify-between text-xs text-gray-500">
                                <span>{formatPhoneNumber(item.phone)}</span>
                                <span>{formatTimestamp(item.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No hay mensajes en el historial
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Acciones rápidas */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Acciones rápidas</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMessageType('text');
                    setMessage('Gracias por contactarnos. ¿En qué podemos ayudarle?');
                  }}
                  className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                >
                  <FaPaperPlane className="mr-2 text-blue-600" />
                  Mensaje de bienvenida
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMessageType('template');
                    setSelectedTemplate('hello_world');
                  }}
                  className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                >
                  <FaDatabase className="mr-2 text-purple-600" />
                  Plantilla Hello World
                </button>
              </div>
            </div>
            
            {/* Configuración */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Configuración avanzada</h4>
                <FaCog className="text-gray-400" />
              </div>
              
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600">
                <p>
                  <span className="font-medium">Phone Number ID:</span> {WHATSAPP_CONFIG.phoneNumberId}
                </p>
                <p className="mt-1">
                  <span className="font-medium">Business Account ID:</span> {WHATSAPP_CONFIG.businessAccountId}
                </p>
                <p className="mt-1">
                  <span className="font-medium">API Version:</span> v22.0
                </p>
                <p className="mt-1">
                  <span className="font-medium">Access Token:</span> ••••••••••••••••••
                </p>
                
                <p className="mt-3 text-gray-500">
                  Los tokens y claves de API están seguros y no se muestran por completo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppManager;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaFileAlt, FaPencilAlt, FaArrowRight, FaSpinner, FaCheck } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../../services/supabaseService';

const FreeConsultation = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    consultationType: 'civil',
    description: '',
    acceptTerms: false
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState(null);
  
  // Monitorear el uso de consultas gratuitas con localStorage
  const checkFreeTrialUsage = () => {
    try {
      const freeTrialCount = localStorage.getItem('freeTrial_count') || '0';
      return parseInt(freeTrialCount, 10);
    } catch (e) {
      console.error('Error al verificar uso de prueba gratuita:', e);
      return 0;
    }
  };
  
  const incrementFreeTrialUsage = () => {
    try {
      const currentCount = checkFreeTrialUsage();
      localStorage.setItem('freeTrial_count', (currentCount + 1).toString());
    } catch (e) {
      console.error('Error al incrementar contador de prueba gratuita:', e);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleNextStep = () => {
    // Validar campos según el paso actual
    if (step === 1) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
        toast.error("Por favor complete todos los campos obligatorios");
        return;
      }
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Por favor ingrese un correo electrónico válido");
        return;
      }
    }
    
    if (step === 2) {
      if (!formData.description.trim() || formData.description.length < 20) {
        toast.error("Por favor ingrese una descripción detallada de al menos 20 caracteres");
        return;
      }
      
      if (!formData.acceptTerms) {
        toast.error("Debe aceptar los términos y condiciones para continuar");
        return;
      }
    }
    
    // Avanzar al siguiente paso
    if (step < 3) {
      setStep(step + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Comprobar si ya ha usado la consulta gratuita
    const freeTrialUsed = checkFreeTrialUsage() > 0;
    if (freeTrialUsed) {
      toast.error("Ya ha utilizado su consulta gratuita. Por favor regístrese para continuar.");
      setTimeout(() => {
        navigate('/auth/register');
      }, 2000);
      return;
    }
    
    setLoading(true);
    
    try {
      // Generar documento simulado según tipo de consulta
      let documentContent = '';
      
      switch (formData.consultationType) {
        case 'civil':
          documentContent = generateCivilDocument(formData);
          break;
        case 'penal':
          documentContent = generatePenalDocument(formData);
          break;
        case 'transito':
          documentContent = generateTransitoDocument(formData);
          break;
        default:
          documentContent = generateGeneralDocument(formData);
      }
      
      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Guardar consulta en Supabase (opcional, si está conectado)
      try {
        await dataService.create('free_consultations', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          type: formData.consultationType,
          description: formData.description,
          created_at: new Date().toISOString(),
          document_generated: true
        });
      } catch (err) {
        console.log('No se pudo guardar la consulta en la base de datos, continuando en modo local');
      }
      
      // Incrementar contador de uso
      incrementFreeTrialUsage();
      
      // Establecer documento generado y marcar como enviado
      setGeneratedDocument(documentContent);
      setSubmitted(true);
      toast.success("¡Documento generado exitosamente!");
      
    } catch (error) {
      console.error('Error al generar documento:', error);
      toast.error("Hubo un error al procesar su solicitud. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };
  
  // Funciones para generar documentos según tipo
  const generateCivilDocument = (data) => {
    return {
      title: "SOLICITUD DE MEDIACIÓN EN MATERIA CIVIL",
      content: `
CENTRO DE MEDIACIÓN Y ARBITRAJE
CONSEJO DE LA JUDICATURA

SOLICITUD DE MEDIACIÓN

${new Date().toLocaleDateString()}

SOLICITANTE: ${data.name}
CONTACTO: ${data.email} / ${data.phone}

ASUNTO: Solicitud de Mediación en materia civil

De mi consideración:

Yo, ${data.name}, por mis propios derechos, me dirijo a usted para solicitar sus servicios de mediación con el fin de llegar a un acuerdo extrajudicial sobre el siguiente asunto:

${data.description}

El objetivo de esta mediación es encontrar una solución pacífica y equitativa que beneficie a todas las partes involucradas, evitando un proceso judicial prolongado.

Me comprometo a participar activamente en el proceso de mediación y a proporcionar toda la información necesaria para facilitar la resolución del conflicto.

Agradezco su atención a la presente solicitud.

Atentamente,

${data.name}
CI: [Por completar]
      `
    };
  };
  
  const generatePenalDocument = (data) => {
    return {
      title: "DENUNCIA PENAL",
      content: `
FISCALÍA GENERAL DEL ESTADO
[Unidad Especializada]

DENUNCIA

${new Date().toLocaleDateString()}

DENUNCIANTE: ${data.name}
CONTACTO: ${data.email} / ${data.phone}

Señor/a Fiscal:

Yo, ${data.name}, mayor de edad, por mis propios derechos, comparezco ante su autoridad para presentar denuncia formal por los siguientes hechos:

HECHOS:

${data.description}

ELEMENTOS DE CONVICCIÓN:
[Por completar]

FUNDAMENTACIÓN JURÍDICA:
Los hechos descritos se encuentran tipificados en el Código Orgánico Integral Penal, artículos [por especificar].

Por lo expuesto, solicito a usted, señor/a Fiscal, se sirva iniciar la investigación previa correspondiente, para el esclarecimiento de los hechos denunciados.

Autorizo al Abogado Wilson Alexander Ipiales Guerrón, para que patrocine la presente denuncia y me represente en todas las diligencias necesarias.

Atentamente,

${data.name}
CI: [Por completar]
      `
    };
  };
  
  const generateTransitoDocument = (data) => {
    return {
      title: "IMPUGNACIÓN DE MULTA DE TRÁNSITO",
      content: `
UNIDAD JUDICIAL DE TRÁNSITO
CON SEDE EN EL CANTÓN [...]

IMPUGNACIÓN

${new Date().toLocaleDateString()}

IMPUGNANTE: ${data.name}
CONTACTO: ${data.email} / ${data.phone}

Señor/a Juez/a:

Yo, ${data.name}, por mis propios derechos, respetuosamente comparezco ante su autoridad y presento IMPUGNACIÓN en contra de la citación/boleta de tránsito Nro. [Por completar], emitida por [autoridad], el día [fecha], por las siguientes consideraciones:

HECHOS:

${data.description}

FUNDAMENTOS DE DERECHO:
La presente impugnación la fundamento en lo dispuesto en el Art. 644 del Código Orgánico Integral Penal, en concordancia con los Arts. 237 y siguientes de la Ley Orgánica de Transporte Terrestre, Tránsito y Seguridad Vial.

PETICIÓN:
Con estos antecedentes, solicito a su autoridad:
1. Se califique y acepte a trámite esta impugnación.
2. Se fije día y hora para la audiencia oral de juzgamiento.
3. Se declare la nulidad de la citación/boleta impugnada.

Autorizo al Abogado Wilson Alexander Ipiales Guerrón, para que patrocine esta impugnación.

Atentamente,

${data.name}
CI: [Por completar]
      `
    };
  };
  
  const generateGeneralDocument = (data) => {
    return {
      title: "SOLICITUD GENERAL",
      content: `
${new Date().toLocaleDateString()}

SOLICITANTE: ${data.name}
CONTACTO: ${data.email} / ${data.phone}

ASUNTO: Solicitud de asesoría legal

Por medio de la presente, yo ${data.name}, me dirijo a usted para solicitar asesoría legal profesional en relación al siguiente asunto:

${data.description}

Agradezco de antemano su atención y quedo a la espera de su respuesta.

Atentamente,

${data.name}
      `
    };
  };
  
  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Información Personal</h3>
            
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="juanperez@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+593991234567"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Detalles de la Consulta</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Consulta*
                </label>
                <select
                  name="consultationType"
                  value={formData.consultationType}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="civil">Derecho Civil</option>
                  <option value="penal">Derecho Penal</option>
                  <option value="transito">Derecho de Tránsito</option>
                  <option value="general">Consulta General</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción detallada de su caso*
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FaPencilAlt className="text-gray-400" />
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describa su caso detalladamente, incluyendo fechas, personas involucradas y toda información relevante..."
                    required
                  ></textarea>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Mínimo 20 caracteres. Cuanta más información proporcione, más preciso será nuestro documento.
                </p>
              </div>
              
              <div className="flex items-start mt-4">
                <div className="flex items-center h-5">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                    Acepto los términos y condiciones
                  </label>
                  <p className="text-gray-500">
                    Al continuar, acepto que esta herramienta es informativa y no constituye asesoramiento legal. Entiendo que es necesario consultar con un abogado para un análisis completo de mi caso.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Confirmación</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">Resumen de su Solicitud</h4>
              
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Nombre:</span> {formData.name}</p>
                <p><span className="font-medium">Correo:</span> {formData.email}</p>
                <p><span className="font-medium">Teléfono:</span> {formData.phone}</p>
                <p>
                  <span className="font-medium">Tipo de Consulta:</span> {
                    formData.consultationType === 'civil' ? 'Derecho Civil' :
                    formData.consultationType === 'penal' ? 'Derecho Penal' :
                    formData.consultationType === 'transito' ? 'Derecho de Tránsito' : 
                    'Consulta General'
                  }
                </p>
                <div>
                  <p className="font-medium">Descripción:</p>
                  <p className="mt-1 italic text-gray-600 bg-white p-2 rounded border border-gray-200">
                    {formData.description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Esta función gratuita solo puede utilizarse una vez. Para servicios adicionales, será necesario registrarse y adquirir tokens.
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Si ya se ha enviado el formulario, mostrar el documento generado
  if (submitted && generatedDocument) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
            <FaCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">¡Documento Generado Exitosamente!</h2>
          <p className="text-gray-600 mt-2">
            Gracias por utilizar nuestro servicio gratuito. A continuación, puede ver y descargar su documento.
          </p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{generatedDocument.title}</h3>
          <div className="whitespace-pre-line font-mono text-sm bg-white p-4 border border-gray-300 rounded-md overflow-auto max-h-96">
            {generatedDocument.content}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={() => {
              const blob = new Blob([generatedDocument.content], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${generatedDocument.title.replace(/\s+/g, '_')}.txt`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              toast.success('Documento descargado');
            }}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Descargar Documento
          </button>
          
          <div className="flex flex-col sm:items-end">
            <p className="text-sm text-gray-600">¿Necesita asistencia profesional?</p>
            <button
              onClick={() => navigate('/auth/register')}
              className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Regístrese para servicios completos
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
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Consulta Legal Gratuita</h2>
        <p className="text-gray-600 mt-2">
          Obtenga un documento legal gratuito generado por nuestra IA.
        </p>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div
                className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= stepNumber 
                    ? 'border-blue-600 bg-blue-600 text-white' 
                    : 'border-gray-300 bg-white text-gray-500'
                }`}
              >
                {step > stepNumber ? (
                  <FaCheck className="w-5 h-5" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              
              {stepNumber < 3 && (
                <div 
                  className={`flex-1 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div className="flex justify-between mt-2 text-sm">
          <span className="w-1/3 text-center">Información</span>
          <span className="w-1/3 text-center">Consulta</span>
          <span className="w-1/3 text-center">Confirmación</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {renderFormStep()}
        
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Anterior
            </button>
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="ml-auto px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            >
              Siguiente
              <FaArrowRight className="ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="ml-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Generando documento...
                </>
              ) : (
                <>
                  Generar Documento Gratuito
                  <FaFileAlt className="ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default FreeConsultation;

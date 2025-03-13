import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { generateLegalDocument } from '../../utils/openai';

const DocumentGenerator = () => {
  const [formData, setFormData] = useState({
    documentType: 'demanda',
    nombre: '',
    cedula: '',
    direccion: '',
    descripcion: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [error, setError] = useState(null);
  const documentRef = useRef(null);

  // Opciones de documentos
  const documentTypes = [
    { value: 'demanda', label: 'Demanda Civil' },
    { value: 'contrato', label: 'Contrato de Arrendamiento' },
    { value: 'apelacion', label: 'Recurso de Apelación' },
    { value: 'poderlegal', label: 'Poder Legal' },
    { value: 'convenio', label: 'Convenio de Pago' }
  ];

  // Manejo de cambios en formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Generar documento
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.cedula.trim() || !formData.descripcion.trim()) {
      setError('Por favor complete todos los campos obligatorios');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedDocument('');

    try {
      const result = await generateLegalDocument(formData.documentType, formData);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al generar el documento');
      }
      
      setGeneratedDocument(result.document);
      
      // Desplazarse al resultado
      if (documentRef.current) {
        setTimeout(() => {
          documentRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      console.error('Error en generación de documento:', err);
      setError(err.message || 'Error al generar el documento. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Copiar al portapapeles
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDocument)
      .then(() => {
        alert('Documento copiado al portapapeles');
      })
      .catch(err => {
        console.error('Error al copiar:', err);
        alert('No se pudo copiar el documento. Por favor, selecciónelo manualmente.');
      });
  };

  return (
    <div className="bg-white py-8 px-4 shadow-md rounded-lg max-w-4xl mx-auto my-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Generador de Documentos Legales</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Genere borradores de documentos legales básicos. Complete el formulario con la información requerida
          y nuestra IA creará un borrador para usted.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <p>Nota: Los documentos generados son solo borradores y deben ser revisados por un profesional legal.</p>
          <p>Para obtener documentos legales oficiales, contacte directamente al Abg. Wilson Ipiales.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">
                Tipo de Documento
              </label>
              <select
                id="documentType"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {documentTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">
                  Cédula / RUC *
                </label>
                <input
                  type="text"
                  name="cedula"
                  id="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  id="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                  Descripción Detallada *
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows={6}
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describa su situación legal o el propósito del documento con el mayor detalle posible..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Incluya todos los detalles relevantes para generar un documento más preciso.
                </p>
              </div>
            </div>
            
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generando documento...
                  </>
                ) : 'Generar Documento'}
              </button>
            </div>
          </form>
          
          {generatedDocument && (
            <motion.div 
              ref={documentRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Borrador de Documento:</h3>
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copiar
                </button>
              </div>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap font-mono text-sm bg-white p-4 border border-gray-300 rounded overflow-auto max-h-96">
                {generatedDocument}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Este es solo un borrador. Para un documento legal oficial y personalizado, contacte al Abg. Wilson Ipiales:
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="https://wa.me/593988835269?text=Hola, necesito asistencia para preparar un documento legal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="white" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                  <a
                    href="mailto:alexip2@hotmail.com?subject=Solicitud de documento legal&body=Necesito asistencia para preparar un documento legal de tipo: [Tipo de documento]"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Documentos Disponibles</h3>
            <ul className="space-y-2 mb-6">
              {documentTypes.map((doc) => (
                <li key={doc.value} className="flex items-center text-gray-700">
                  <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {doc.label}
                </li>
              ))}
            </ul>
            
            <div className="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">Aviso Importante</h4>
              <p className="text-sm text-yellow-700 mb-4">
                Los documentos generados son solo borradores iniciales y no reemplazan el asesoramiento legal profesional. Pueden requerir modificaciones significativas para ser válidos legalmente.
              </p>
              <p className="text-sm text-yellow-700">
                Se recomienda solicitar revisión profesional antes de usar cualquier documento generado por esta herramienta.
              </p>
            </div>
            
            <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Contacto Profesional</h4>
              <p className="text-sm text-blue-700 mb-4">
                Para documentos oficiales y asesoramiento legal profesional, contacte al Abg. Wilson Ipiales.
              </p>
              <div className="text-sm text-gray-700 space-y-2">
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Juan José Flores 4-73 y Vicente Rocafuerte, Ibarra
                </p>
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +593 988835269
                </p>
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  alexip2@hotmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerator;

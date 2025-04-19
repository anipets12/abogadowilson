import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { exportService } from '../../services/exportService';
import { FaFileExcel, FaFileCsv, FaFileDownload, FaCalendarAlt, FaFilter, FaSyncAlt, FaTable, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import { SiNotion } from 'react-icons/si';
import { toast } from 'react-hot-toast';

const DataExporter = () => {
  const { user } = useAuth();
  const [exportType, setExportType] = useState('clients');
  const [exportFormat, setExportFormat] = useState('excel');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState([]);
  const [notionDatabaseId, setNotionDatabaseId] = useState(process.env.REACT_APP_NOTION_DATABASE_ID || '');
  const [includeFields, setIncludeFields] = useState('');
  const [excludeFields, setExcludeFields] = useState('');
  
  const dataTypes = [
    { id: 'clients', label: 'Clientes', description: 'Datos completos de clientes registrados' },
    { id: 'leads', label: 'Prospectos', description: 'Contactos potenciales y datos de formularios' },
    { id: 'appointments', label: 'Citas', description: 'Agenda de citas programadas' },
    { id: 'consultations', label: 'Consultas', description: 'Historial de consultas legales' },
    { id: 'transactions', label: 'Transacciones', description: 'Historial de pagos y compras' },
    { id: 'whatsapp_messages', label: 'Mensajes WhatsApp', description: 'Historial de conversaciones' }
  ];
  
  const exportFormats = [
    { id: 'excel', label: 'Excel (.xlsx)', icon: <FaFileExcel className="text-green-600" /> },
    { id: 'csv', label: 'CSV (.csv)', icon: <FaFileCsv className="text-blue-600" /> },
    { id: 'notion', label: 'Notion', icon: <SiNotion className="text-gray-800" /> }
  ];
  
  const handleAddFilter = () => {
    setFilters([...filters, { field: '', operator: 'eq', value: '' }]);
  };
  
  const handleRemoveFilter = (index) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };
  
  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    setFilters(newFilters);
  };
  
  const buildFiltersObject = () => {
    const filtersObj = {};
    
    for (const filter of filters) {
      if (!filter.field || filter.field.trim() === '') continue;
      
      // Convertir valor según el operador
      let value = filter.value;
      if (['gt', 'gte', 'lt', 'lte', 'eq', 'neq'].includes(filter.operator)) {
        if (!filtersObj[filter.field]) {
          filtersObj[filter.field] = {};
        }
        filtersObj[filter.field][filter.operator] = value;
      } else if (filter.operator === 'in' && typeof value === 'string') {
        // Convertir lista separada por comas a array
        filtersObj[filter.field] = value.split(',').map(v => v.trim());
      } else {
        filtersObj[filter.field] = value;
      }
    }
    
    return filtersObj;
  };
  
  const handleExport = async () => {
    if (!user) {
      toast.error('Debe iniciar sesión para exportar datos');
      return;
    }
    
    if (!exportType) {
      toast.error('Seleccione un tipo de datos para exportar');
      return;
    }
    
    if (exportFormat === 'notion' && !notionDatabaseId) {
      toast.error('Se requiere ID de base de datos de Notion para exportar');
      return;
    }
    
    try {
      setLoading(true);
      
      // Preparar opciones de exportación
      const options = {
        format: exportFormat,
        dateRange: {
          start: new Date(dateRange.start),
          end: new Date(dateRange.end)
        },
        filters: buildFiltersObject(),
        includeFields: includeFields.split(',').map(f => f.trim()).filter(f => f !== ''),
        excludeFields: excludeFields.split(',').map(f => f.trim()).filter(f => f !== ''),
        notionDatabaseId: notionDatabaseId
      };
      
      let result;
      
      if (exportFormat === 'notion') {
        // Exportar a Notion
        result = await exportService.exportToNotion(exportType, options);
        
        if (result.success) {
          toast.success(`Exportación a Notion completada. ${result.totalExported} registros exportados.`);
        } else {
          throw new Error(result.error || 'Error desconocido al exportar a Notion');
        }
      } else {
        // Exportar a Excel/CSV
        result = await exportService.exportToExcel(exportType, options);
        
        if (result.success) {
          // Crear enlace de descarga
          const url = URL.createObjectURL(result.data);
          const a = document.createElement('a');
          a.href = url;
          a.download = result.filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast.success('Exportación completada con éxito');
        } else {
          throw new Error(result.error || 'Error desconocido al exportar');
        }
      }
    } catch (error) {
      console.error('Error al exportar datos:', error);
      toast.error(error.message || 'Error al exportar datos');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <h2 className="text-xl font-bold flex items-center">
          <FaFileDownload className="mr-2" /> Exportación de Datos
        </h2>
        <p className="text-sm text-blue-100">Extraiga información del sistema para análisis y reportes</p>
      </div>
      
      <div className="p-6">
        {/* Tipo de datos */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de datos a exportar</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {dataTypes.map((type) => (
              <div key={type.id} className="relative">
                <input 
                  type="radio" 
                  id={`type_${type.id}`} 
                  name="exportType"
                  className="hidden peer" 
                  checked={exportType === type.id}
                  onChange={() => setExportType(type.id)}
                />
                <label 
                  htmlFor={`type_${type.id}`}
                  className="flex items-center p-3 bg-white border rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50"
                >
                  <FaTable className="text-blue-600 mr-3" />
                  <div>
                    <span className="text-sm font-medium">{type.label}</span>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Formato de exportación */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Formato de exportación</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {exportFormats.map((format) => (
              <div key={format.id} className="relative">
                <input 
                  type="radio" 
                  id={`format_${format.id}`} 
                  name="exportFormat"
                  className="hidden peer" 
                  checked={exportFormat === format.id}
                  onChange={() => setExportFormat(format.id)}
                />
                <label 
                  htmlFor={`format_${format.id}`}
                  className="flex items-center p-3 bg-white border rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50"
                >
                  <span className="mr-3">{format.icon}</span>
                  <span className="text-sm font-medium">{format.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Rango de fechas */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <FaCalendarAlt className="mr-1 text-blue-600" /> Rango de fechas
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Desde</label>
              <input 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Hasta</label>
              <input 
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Botón de filtros avanzados */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="mb-4 flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <FaFilter className="mr-1" />
          {showFilters ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
        </button>
        
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filtros avanzados</h3>
            
            {/* Lista de filtros */}
            {filters.length > 0 && (
              <div className="mb-4 space-y-3">
                {filters.map((filter, index) => (
                  <div key={index} className="flex flex-wrap gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Campo"
                      value={filter.field}
                      onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
                      className="flex-1 p-2 text-sm border border-gray-300 rounded-md"
                    />
                    <select
                      value={filter.operator}
                      onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                      className="flex-1 p-2 text-sm border border-gray-300 rounded-md"
                    >
                      <option value="eq">Igual a</option>
                      <option value="neq">Diferente de</option>
                      <option value="gt">Mayor que</option>
                      <option value="gte">Mayor o igual que</option>
                      <option value="lt">Menor que</option>
                      <option value="lte">Menor o igual que</option>
                      <option value="in">En lista</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Valor"
                      value={filter.value}
                      onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                      className="flex-1 p-2 text-sm border border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFilter(index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button
              type="button"
              onClick={handleAddFilter}
              className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-md"
            >
              + Añadir filtro
            </button>
            
            {/* Campos a incluir/excluir */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-700 mb-1">
                  Campos a incluir (separados por coma)
                </label>
                <input
                  type="text"
                  value={includeFields}
                  onChange={(e) => setIncludeFields(e.target.value)}
                  placeholder="nombre, email, teléfono"
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">
                  Campos a excluir (separados por coma)
                </label>
                <input
                  type="text"
                  value={excludeFields}
                  onChange={(e) => setExcludeFields(e.target.value)}
                  placeholder="id, created_at"
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            {/* ID de Base de datos de Notion */}
            {exportFormat === 'notion' && (
              <div className="mt-4">
                <label className="block text-xs text-gray-700 mb-1">
                  ID de Base de datos de Notion
                </label>
                <input
                  type="text"
                  value={notionDatabaseId}
                  onChange={(e) => setNotionDatabaseId(e.target.value)}
                  placeholder="d6a5fbebd06a49cab0bf54e1d9b4ecfe"
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Puedes encontrar este ID en la URL de tu base de datos de Notion
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Información de seguridad */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <FaInfoCircle className="text-yellow-600 mr-2 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Información importante</h4>
              <p className="text-xs text-yellow-700 mt-1">
                Los datos exportados pueden contener información sensible y personal de clientes. Asegúrese de:
              </p>
              <ul className="list-disc pl-4 mt-1 text-xs text-yellow-700">
                <li>Tratar esta información de manera confidencial.</li>
                <li>No compartir archivos exportados sin cifrado adecuado.</li>
                <li>Cumplir con las políticas de privacidad y protección de datos.</li>
                <li>Eliminar archivos descargados cuando ya no sean necesarios.</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Botón de exportación */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleExport}
            disabled={loading}
            className={`flex items-center justify-center py-2 px-6 rounded-md shadow-sm text-white font-medium ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? (
              <>
                <FaSyncAlt className="animate-spin mr-2" />
                Exportando...
              </>
            ) : (
              <>
                <FaFileDownload className="mr-2" />
                Exportar datos
              </>
            )}
          </button>
        </div>
        
        {/* Información sobre Notion */}
        {exportFormat === 'notion' && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex">
              <SiNotion className="text-gray-800 mr-2 flex-shrink-0 mt-1 text-lg" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Exportación a Notion</h4>
                <p className="text-xs text-blue-700 mt-1">
                  La exportación a Notion requiere una base de datos existente con las propiedades adecuadas.
                  El sistema intentará mapear los campos exportados a las propiedades de Notion.
                </p>
                <div className="mt-2 flex items-center">
                  <FaCheckCircle className="text-green-600 mr-1" />
                  <span className="text-xs text-green-700">API Key configurada: {process.env.REACT_APP_NOTION_API_KEY ? 'Sí' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataExporter;

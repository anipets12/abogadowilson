/**
 * Servicio para exportación de datos a Excel y Notion
 * Permite extraer información relevante de usuarios y formularios
 */

import { supabaseClient } from './supabaseClient';
import { Client } from '@notionhq/client';
import * as XLSX from 'xlsx';

type ExportFormat = 'excel' | 'csv' | 'notion';
type ExportTarget = 'clients' | 'leads' | 'appointments' | 'consultations' | 'transactions' | 'whatsapp_messages';

interface ExportOptions {
  format: ExportFormat;
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, any>;
  includeFields?: string[];
  excludeFields?: string[];
  notionDatabaseId?: string;
}

export const exportService = {
  /**
   * Exportar datos a Excel
   * @param target Tipo de datos a exportar
   * @param options Opciones de exportación
   */
  async exportToExcel(target: ExportTarget, options: ExportOptions) {
    try {
      // Obtener datos según el target
      const data = await this.fetchData(target, options);
      
      if (!data || data.length === 0) {
        throw new Error(`No hay datos disponibles para exportar de ${target}`);
      }
      
      // Filtrar campos según options
      const filteredData = this.filterFields(data, options);
      
      // Crear libro de Excel
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      XLSX.utils.book_append_sheet(workbook, worksheet, target);
      
      // Generar archivo
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Convertir a Blob para descarga
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      return {
        success: true,
        data: blob,
        filename: `${target}_export_${new Date().toISOString().split('T')[0]}.xlsx`
      };
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al exportar'
      };
    }
  },
  
  /**
   * Exportar datos a Notion
   * @param target Tipo de datos a exportar
   * @param options Opciones de exportación
   */
  async exportToNotion(target: ExportTarget, options: ExportOptions) {
    try {
      if (!options.notionDatabaseId) {
        throw new Error('Se requiere ID de base de datos de Notion para exportar');
      }
      
      // Obtener datos según el target
      const data = await this.fetchData(target, options);
      
      if (!data || data.length === 0) {
        throw new Error(`No hay datos disponibles para exportar de ${target}`);
      }
      
      // Filtrar campos según options
      const filteredData = this.filterFields(data, options);
      
      // Configurar cliente de Notion
      const notion = new Client({ auth: process.env.REACT_APP_NOTION_API_KEY });
      
      // Crear página en la base de datos con los datos
      const results = [];
      
      for (const item of filteredData) {
        // Convertir objeto a formato de propiedades de Notion
        const properties: Record<string, any> = {};
        
        for (const [key, value] of Object.entries(item)) {
          if (value === null || value === undefined) continue;
          
          // Adaptar según tipo de dato
          if (typeof value === 'string') {
            properties[key] = { 
              type: 'rich_text',
              rich_text: [{ type: 'text', text: { content: value } }]
            };
          } else if (typeof value === 'number') {
            properties[key] = { type: 'number', number: value };
          } else if (value instanceof Date) {
            properties[key] = { type: 'date', date: { start: value.toISOString() } };
          } else if (typeof value === 'boolean') {
            properties[key] = { type: 'checkbox', checkbox: value };
          } else {
            // Para objetos y arrays, convertir a JSON string
            properties[key] = { 
              type: 'rich_text',
              rich_text: [{ type: 'text', text: { content: JSON.stringify(value) } }]
            };
          }
        }
        
        // Añadir título para cada entrada
        properties['Title'] = {
          type: 'title',
          title: [{ type: 'text', text: { content: `${target} - ${new Date().toISOString()}` } }]
        };
        
        // Crear página en Notion
        try {
          const response = await notion.pages.create({
            parent: { database_id: options.notionDatabaseId },
            properties
          });
          
          results.push({
            id: response.id,
            success: true
          });
        } catch (itemError) {
          console.error('Error al crear página en Notion:', itemError);
          results.push({
            error: itemError instanceof Error ? itemError.message : 'Error desconocido',
            success: false,
            data: item
          });
        }
      }
      
      return {
        success: results.every(r => r.success),
        results,
        totalExported: results.filter(r => r.success).length,
        totalFailed: results.filter(r => !r.success).length
      };
    } catch (error) {
      console.error('Error al exportar a Notion:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al exportar a Notion'
      };
    }
  },
  
  /**
   * Obtener datos de la fuente según el tipo
   * @param target Tipo de datos a buscar
   * @param options Opciones de filtrado
   */
  async fetchData(target: ExportTarget, options: ExportOptions) {
    const { supabase } = supabaseClient();
    let query = supabase.from(target).select('*');
    
    // Aplicar filtros de fecha si existen
    if (options.dateRange) {
      const dateField = this.getDateFieldForTarget(target);
      query = query
        .gte(dateField, options.dateRange.start.toISOString())
        .lte(dateField, options.dateRange.end.toISOString());
    }
    
    // Aplicar filtros personalizados
    if (options.filters) {
      for (const [field, value] of Object.entries(options.filters)) {
        if (Array.isArray(value)) {
          query = query.in(field, value);
        } else if (typeof value === 'object' && value !== null) {
          if ('gt' in value) query = query.gt(field, value.gt);
          if ('gte' in value) query = query.gte(field, value.gte);
          if ('lt' in value) query = query.lt(field, value.lt);
          if ('lte' in value) query = query.lte(field, value.lte);
          if ('eq' in value) query = query.eq(field, value.eq);
          if ('neq' in value) query = query.neq(field, value.neq);
        } else {
          query = query.eq(field, value);
        }
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  },
  
  /**
   * Filtrar campos de los datos según opciones
   * @param data Datos a filtrar
   * @param options Opciones de filtrado
   */
  filterFields(data: any[], options: ExportOptions) {
    if (!data || data.length === 0) return [];
    
    return data.map(item => {
      const filtered: Record<string, any> = {};
      
      // Si hay campos específicos para incluir
      if (options.includeFields && options.includeFields.length > 0) {
        for (const field of options.includeFields) {
          if (field in item) {
            filtered[field] = item[field];
          }
        }
        return filtered;
      }
      
      // Copiar todos los campos excepto los excluidos
      for (const [key, value] of Object.entries(item)) {
        if (!options.excludeFields || !options.excludeFields.includes(key)) {
          filtered[key] = value;
        }
      }
      
      return filtered;
    });
  },
  
  /**
   * Obtener campo de fecha según el tipo de datos
   * @param target Tipo de datos
   */
  getDateFieldForTarget(target: ExportTarget): string {
    switch (target) {
      case 'clients':
      case 'leads':
        return 'created_at';
      case 'appointments':
        return 'date';
      case 'consultations':
        return 'created_at';
      case 'transactions':
        return 'date';
      case 'whatsapp_messages':
        return 'timestamp';
      default:
        return 'created_at';
    }
  }
};

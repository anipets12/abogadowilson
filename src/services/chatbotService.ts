/**
 * Servicio para integración con chatbot de WhatsApp
 * Preparado para automatización con n8n y agentes MCP
 */

import { supabaseClient } from './supabaseClient';

type WhatsAppMessage = {
  phone: string;
  message: string;
  name?: string;
  service?: string;
};

type ChatbotResponse = {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
};

type LeadInfo = {
  phone: string;
  name: string;
  email?: string;
  service?: string;
  source?: string;
  createdAt: Date;
};

export const chatbotService = {
  /**
   * Enviar mensaje a través de webhook para n8n o agente MCP
   * @param message Datos del mensaje
   */
  async sendMessage(message: WhatsAppMessage): Promise<ChatbotResponse> {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_WHATSAPP_API_KEY || ''
        },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return {
        success: false,
        message: 'Error al enviar mensaje',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  /**
   * Registrar nuevo lead desde chatbot
   * @param lead Información del lead
   */
  async registerLead(lead: LeadInfo): Promise<ChatbotResponse> {
    try {
      // Registrar en Supabase
      const { data, error } = await supabaseClient
        .from('leads')
        .insert([
          {
            phone: lead.phone,
            name: lead.name,
            email: lead.email,
            service_interest: lead.service,
            source: lead.source || 'whatsapp',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      // También enviar a webhook para automatización
      await fetch(`${process.env.REACT_APP_N8N_WEBHOOK_URL}/lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(lead)
      });

      return {
        success: true,
        message: 'Lead registrado correctamente',
        data
      };
    } catch (error) {
      console.error('Error registering lead:', error);
      return {
        success: false,
        message: 'Error al registrar lead',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  /**
   * Obtener respuesta automática para integración con agentes conversacionales
   * @param query Consulta del usuario
   * @param context Contexto adicional
   */
  async getAutomatedResponse(query: string, context: Record<string, any> = {}): Promise<ChatbotResponse> {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chat/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_CHAT_API_KEY || ''
        },
        body: JSON.stringify({
          query,
          context: {
            ...context,
            source: 'whatsapp'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting automated response:', error);
      return {
        success: false,
        message: 'Error al obtener respuesta automatizada',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  /**
   * Generar un enlace de pago para enviar por WhatsApp
   * @param service Servicio a pagar
   * @param amount Monto a pagar
   * @param clientPhone Teléfono del cliente
   */
  async generatePaymentLink(service: string, amount: number, clientPhone: string): Promise<ChatbotResponse> {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/generate-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          service,
          amount,
          clientPhone,
          source: 'whatsapp'
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating payment link:', error);
      return {
        success: false,
        message: 'Error al generar enlace de pago',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  /**
   * Programar seguimiento automático
   * @param phone Teléfono del cliente
   * @param scheduledDate Fecha de seguimiento
   * @param type Tipo de seguimiento
   */
  async scheduleFollowUp(phone: string, scheduledDate: Date, type: string): Promise<ChatbotResponse> {
    try {
      const { data, error } = await supabaseClient
        .from('follow_ups')
        .insert([
          {
            phone,
            scheduled_date: scheduledDate.toISOString(),
            type,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      // Notificar a n8n para programar el seguimiento
      await fetch(`${process.env.REACT_APP_N8N_WEBHOOK_URL}/schedule-followup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone,
          scheduledDate: scheduledDate.toISOString(),
          type
        })
      });

      return {
        success: true,
        message: 'Seguimiento programado correctamente',
        data
      };
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
      return {
        success: false,
        message: 'Error al programar seguimiento',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

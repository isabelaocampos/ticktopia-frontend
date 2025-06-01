import axiosClient from '@/shared/lib/axiosClient';
import { BuyTicketDto, Ticket } from '@/shared/types/ticket';

const prefix = '/tickets';

/**
 * Compra de tickets con Stripe Checkout
 */
export async function buyTickets(ticket: BuyTicketDto): Promise<{ url: string }> {
  console.log('🎫 Comprando tickets:', ticket);
  console.log('🌐 URL del API:', `${prefix}/buy`);
  
  try {
    const res = await axiosClient.post(`${prefix}/buy`, ticket);
    console.log('✅ Respuesta exitosa:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('❌ Error en buyTickets:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    throw error;
  }
}

/**
 * Obtener tickets del usuario autenticado (activos)
 */
export async function getMyTickets(): Promise<Ticket[]> {
  try {
    const res = await axiosClient.get(`${prefix}`);
    return res.data;
  } catch (error: any) {
    console.error('❌ Error obteniendo mis tickets:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Obtener tickets históricos del usuario (usados o inactivos)
 */
export async function getMyHistoricTickets(): Promise<Ticket[]> {
  try {
    const res = await axiosClient.get(`${prefix}/historic`);
    return res.data;
  } catch (error: any) {
    console.error('❌ Error obteniendo tickets históricos:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Obtener un ticket específico por ID
 */
export async function getTicketById(id: string): Promise<Ticket> {
  try {
    const res = await axiosClient.get(`${prefix}/${id}`);
    return res.data;
  } catch (error: any) {
    console.error('❌ Error obteniendo ticket por ID:', error.response?.data || error.message);
    throw error;
  }
}
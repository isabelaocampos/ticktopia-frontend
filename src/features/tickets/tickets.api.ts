"use server"

import { cookies } from 'next/headers';
import { BuyTicketDto, Ticket } from '@/shared/types/ticket';

const prefix = '/tickets';

// Función helper para obtener headers con autenticación
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Compra de tickets con Stripe Checkout - Server Action
 */
export async function buyTickets(ticket: BuyTicketDto): Promise<{ url: string; success: boolean; error?: string }> {
  try {
    console.log("Server: Comprando tickets para:", ticket);
    
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${prefix}/buy`, {
      method: 'POST',
      headers,
      body: JSON.stringify(ticket),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Error ${response.status}:`, errorData);
      
      if (response.status === 401) {
        return { url: '', success: false, error: 'No estás autenticado' };
      }
      if (response.status === 404) {
        return { url: '', success: false, error: 'Presentación no encontrada' };
      }
      
      return { url: '', success: false, error: 'Error al procesar la compra' };
    }

    const data = await response.json();
    return { url: data.url, success: true };
    
  } catch (error) {
    console.error('Error en buyTickets:', error);
    return { url: '', success: false, error: 'Error de conexión' };
  }
}

/**
 * Obtener tickets del usuario autenticado (activos) - Server Action
 */
export async function getMyTickets(): Promise<{ tickets: Ticket[]; success: boolean; error?: string }> {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${prefix}/`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      return { tickets: [], success: false, error: 'Error al obtener tickets' };
    }

    const tickets = await response.json();
    return { tickets, success: true };
    
  } catch (error) {
    console.error('Error en getMyTickets:', error);
    return { tickets: [], success: false, error: 'Error de conexión' };
  }
}

/**
 * Obtener tickets históricos del usuario - Server Action
 */
export async function getMyHistoricTickets(): Promise<{ tickets: Ticket[]; success: boolean; error?: string }> {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${prefix}/historic`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      return { tickets: [], success: false, error: 'Error al obtener tickets históricos' };
    }

    const tickets = await response.json();
    return { tickets, success: true };
    
  } catch (error) {
    console.error('Error en getMyHistoricTickets:', error);
    return { tickets: [], success: false, error: 'Error de conexión' };
  }
}

/**
 * Obtener un ticket específico por ID - Server Action
 */
export async function getTicketById(id: string): Promise<{ ticket: Ticket | null; success: boolean; error?: string }> {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${prefix}/${id}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      return { ticket: null, success: false, error: 'Ticket no encontrado' };
    }

    const ticket = await response.json();
    return { ticket, success: true };
    
  } catch (error) {
    console.error('Error en getTicketById:', error);
    return { ticket: null, success: false, error: 'Error de conexión' };
  }
}
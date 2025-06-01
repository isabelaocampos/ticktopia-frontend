"use client"
import axiosClient from '@/shared/lib/axiosClient';
import { BuyTicketDto, Ticket } from '@/shared/types/ticket';

const prefix = '/tickets';

/**
 * Compra de tickets con Stripe Checkout
 */
export async function buyTickets(ticket: BuyTicketDto): Promise<{ url: string }> {
  const res = await axiosClient.post(`${prefix}/buy`, ticket);
  return res.data;
}

/**
 * Obtener tickets del usuario autenticado (activos)
 */
export async function getMyTickets(): Promise<Ticket[]> {
  const res = await axiosClient.get(`${prefix}`);
  return res.data;
}

/**
 * Obtener tickets históricos del usuario (usados o inactivos)
 */
export async function getMyHistoricTickets(): Promise<Ticket[]> {
  const res = await axiosClient.get(`${prefix}/historic`);
  return res.data;
}

/**
 * Obtener un ticket específico por ID
 */
export async function getTicketById(id: string): Promise<Ticket> {
  const res = await axiosClient.get(`${prefix}/${id}`);
  return res.data;
}

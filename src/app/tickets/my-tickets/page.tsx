// app/tickets/my-tickets/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { getMyTickets } from "@/features/tickets/tickets.api"
import { TicketCard } from '@/features/tickets/components/TicketCard'
import type { Ticket } from '@/shared/types/ticket'

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTickets = async () => {
    try {
      setLoading(true)
      setError('')
      const ticketsData = await getMyTickets()
      setTickets(ticketsData)
    } catch (err: any) {
      setError(err.message || 'Error al cargar los tickets')
      console.error('Error fetching tickets:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
    
    // Auto-refresh cada 30 segundos
    const interval = setInterval(fetchTickets, 30000)
    
    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [])

  // Función para refrescar manualmente
  const handleRefresh = () => {
    fetchTickets()
  }

  if (loading && tickets.length === 0) {
    return (
      <main className="p-4">
        <h1 className="text-xl font-bold mb-4">Mis Tickets</h1>
        <p>Cargando tickets...</p>
      </main>
    )
  }

  return (
    <main className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Mis Tickets</h1>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {tickets.length === 0 ? (
        <p>No tienes tickets aún.</p>
      ) : (
        <div className="grid gap-4">
          {tickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </main>
  )
}
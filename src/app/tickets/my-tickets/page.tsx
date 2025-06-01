// app/tickets/my-tickets/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { getMyTickets } from "@/features/tickets/tickets.api";  // Este servicio lo defines tú
import { TicketCard } from '@/features/tickets/components/TicketCard' // Opcional
import type { Ticket } from  '@/shared/types/ticket' // Ajusta la ruta según donde esté tu tipo Ticket

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])

  useEffect(() => {
    getMyTickets().then(setTickets).catch(console.error)
  }, [])

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Mis Tickets</h1>
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

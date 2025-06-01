'use client'

import { useEffect, useState } from 'react';
import { getMyHistoricTickets } from '@/features/tickets/tickets.api';
import { Ticket } from '@/shared/types/ticket';
import { TicketCard } from '@/features/tickets/components/TicketCard';

export default function MyHistoricTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyHistoricTickets()
      .then(setTickets)
      .catch(err => console.error('❌ Error al cargar tickets históricos:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
    if (tickets.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
        {/* <img
            src="/no-tickets.svg"
            alt="No tickets"
            className="w-40 h-40 mb-6 opacity-70"
        /> */}
        <h2 className="text-xl font-semibold">You don't have any historic tickets yet</h2>
        <p className="text-sm mt-2">When you attend events, your used tickets will appear here.</p>
        </div>
    );
    }


  return (
    <div className="grid gap-4 p-4">
      {tickets.map(ticket => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}

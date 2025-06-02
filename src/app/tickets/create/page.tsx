'use client'

import { TicketCreateForm } from '@/features/tickets/components/TicketCreateForm'

export default function CreateTicketPage() {
  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Create Ticket</h1>
      <TicketCreateForm />
    </div>
  )
}

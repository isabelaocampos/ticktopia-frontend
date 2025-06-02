'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTicket, getUsers, getPresentations } from '@/features/tickets/tickets.api'
import { TicketInput, UserOption, PresentationOption } from '@/shared/types/ticket'

export function TicketCreateForm() {
  const router = useRouter()
  const [form, setForm] = useState<TicketInput>({
    userId: '',
    presentationId: '',
  })
  const [users, setUsers] = useState<UserOption[]>([])
  const [presentations, setPresentations] = useState<PresentationOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [u, p] = await Promise.all([
          getUsers(),
          getPresentations(),
        ])
        setUsers(u)
        setPresentations(p)
      } catch (err) {
        setError('Error al cargar los datos.')
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    
    try {
      await createTicket(form)
      setSuccess(true)
      setForm({ userId: '', presentationId: '' })
    } catch (err: any) {
      setError(err.message || 'No se pudo crear el ticket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Crear Nuevo Ticket</h2>

      {success && (
        <div className="bg-green-100 text-green-700 border border-green-300 p-3 rounded">
          ✅ El ticket fue creado exitosamente.
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded">
          ❌ {error}
        </div>
      )}

      <div>
        <label htmlFor="userId" className="block text-sm font-semibold text-gray-700 mb-1">
          Usuario (email)
        </label>
        <select
          id="userId"
          value={form.userId}
          onChange={(e) => setForm(prev => ({ ...prev, userId: e.target.value }))}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500"
          disabled={loading}
          required
        >
          <option value="">Selecciona un usuario</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.email}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="presentationId" className="block text-sm font-semibold text-gray-700 mb-1">
          Presentación
        </label>
        <select
          id="presentationId"
          value={form.presentationId}
          onChange={(e) => setForm(prev => ({ ...prev, presentationId: e.target.value }))}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500"
          disabled={loading}
          required
        >
          <option value="">Selecciona una presentación</option>
          {presentations.map((p) => (
            <option key={p.idPresentation} value={p.idPresentation}>
              {(p.event?.name || 'Evento sin título')} — {p.startDate ? new Date(p.startDate).toLocaleString() : 'Sin fecha'}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading || !form.userId || !form.presentationId}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Creando ticket...' : 'Crear Ticket'}
      </button>
    </form>
  )
}

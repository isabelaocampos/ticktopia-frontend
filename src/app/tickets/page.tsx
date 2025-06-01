'use client'

import { useRouter } from 'next/navigation';
import React from 'react';

export default function TicketsPage() {
  const router = useRouter();

  const handleBuy = () => {
    router.push('/tickets/checkout');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Información del Evento</h1>
      <p className="mb-2">Nombre del Evento: Concierto de prueba</p>
      <p className="mb-2">Precio: $50.000</p>
      <p className="mb-4">Lugar: Estadio</p>
      <button
        onClick={handleBuy}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Comprar Boletas
      </button>
    </div>
  );
}

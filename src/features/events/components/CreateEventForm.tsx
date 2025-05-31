'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent } from '../events.api';

export default function CreateEventForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [bannerPhoto, setBannerPhoto] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!bannerPhoto) {
        throw new Error('Debe seleccionar una imagen para el banner');
      }

      // URL falsa de prueba solo para verificar el flujo
      const bannerPhotoUrl = 'https://via.placeholder.com/600x300.png?text=Banner+de+Prueba';

      await createEvent({ name, bannerPhotoUrl, isPublic });
      router.push('/event/findAll');
    } catch (err: any) {
      setError(err.message || 'Error al crear el evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800">Crear nuevo evento</h2>

      <div>
        <label className="block font-medium mb-1">Nombre del evento</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Banner del evento</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBannerPhoto(e.target.files?.[0] || null)}
          className="w-full"
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        <label htmlFor="isPublic" className="text-sm">Evento público</label>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-brand to-violet text-white py-3 px-4 rounded-lg font-semibold hover:from-violet hover:to-brand transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? 'Creando...' : 'Crear evento'}
      </button>
    </form>
  );
}

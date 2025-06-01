'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent } from '../events.api';
import { uploadToCloudinary } from '@/shared/utils/uploadToCloudinary';

export default function CreateEventForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [bannerPhoto, setBannerPhoto] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Ejemplo de cómo usar en tu CreateEventForm
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. Subir imagen a Cloudinary primero
      const imageFile = bannerPhoto;
      if (!imageFile) {
        throw new Error('No se seleccionó una imagen para el banner.');
      }
      const cloudinaryUrl = await uploadToCloudinary(imageFile);
      
      // 2. Crear evento con la URL
      await createEvent(
        name,
        isPublic,
        cloudinaryUrl // Pasar la URL de Cloudinary
      );

      alert('Evento creado exitosamente');

      
      router.push('/'); // Redirigir a la lista de eventos
      
      
      // Redirigir o mostrar success
    } catch (error) {
      console.error('Error:', error);
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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Event } from '@/shared/types/event';
import { updateEvent } from '../events.api';
import { UpdateEventDto } from '@/shared/types/event';

interface UpdateEventFormProps {
  event: Event;
}

export default function UpdateEventForm({ event }: UpdateEventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: event.name,
    isPublic: event.isPublic,
    bannerPhotoUrl: event.bannerPhotoUrl || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const updateData: UpdateEventDto = {};
      
      // Solo incluir campos que han cambiado
      if (formData.name !== event.name) {
        updateData.name = formData.name;
      }
      if (formData.isPublic !== event.isPublic) {
        updateData.isPublic = formData.isPublic;
      }
      if (formData.bannerPhotoUrl !== (event.bannerPhotoUrl || '')) {
        updateData.bannerPhotoUrl = formData.bannerPhotoUrl;
      }

      // Si no hay cambios, no hacer la petición
      if (Object.keys(updateData).length === 0) {
        setError('No has realizado ningún cambio');
        setIsLoading(false);
        return;
      }

      await updateEvent(event.id, updateData);
      setSuccess(true);
      
      // Redirect después de 2 segundos
      setTimeout(() => {
        router.push('/event/my-events');
      }, 2000);

    } catch (err: any) {
      console.error('Error updating event:', err);
      setError(err.response?.data?.message || 'Error al actualizar el evento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <h2 className="text-lg font-semibold text-green-800 mb-2">
            ¡Evento actualizado exitosamente!
          </h2>
          <p className="text-green-600">
            Redirigiendo a tus eventos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Actualizar Evento
        </h1>
        <p className="text-gray-600">
          Modifica los detalles de tu evento
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre del evento */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del evento *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ingresa el nombre del evento"
          />
        </div>

        {/* URL del banner */}
        <div>
          <label htmlFor="bannerPhotoUrl" className="block text-sm font-medium text-gray-700 mb-2">
            URL del Banner
          </label>
          <input
            type="url"
            id="bannerPhotoUrl"
            name="bannerPhotoUrl"
            value={formData.bannerPhotoUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/imagen.jpg"
          />
          
          {/* Preview de la imagen */}
          {formData.bannerPhotoUrl && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
              <div className="relative w-full h-40 border rounded-lg overflow-hidden">
                <img
                  src={formData.bannerPhotoUrl}
                  alt="Preview del banner"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/600x300.png?text=Error+de+Imagen';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Visibilidad */}
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Evento público
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1 ml-7">
            Los eventos públicos son visibles para todos los usuarios
          </p>
        </div>

        {/* Botones */}
        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Actualizando...' : 'Actualizar Evento'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/event/my-events')}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
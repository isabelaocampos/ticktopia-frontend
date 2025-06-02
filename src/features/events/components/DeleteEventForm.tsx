'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@/shared/types/event';
import { deleteEvent } from '../events.api';

interface DeleteEventFormProps {
  event: Event;
}

export default function DeleteEventForm({ event }: DeleteEventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationText, setConfirmationText] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar confirmación
    if (confirmationText !== event.name) {
      setError('El nombre del evento no coincide. Por favor, escríbelo exactamente como aparece.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await deleteEvent(event.id);
      setSuccess(true);
      
      // Redirect después de 2 segundos
      setTimeout(() => {
        router.push('/event/find/user');
      }, 2000);

    } catch (err: any) {
      console.error('Error deleting event:', err);
      setError(err.response?.data?.message || 'Error al eliminar el evento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back(); // Volver a la página anterior
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <h2 className="text-lg font-semibold text-green-800 mb-2">
            ¡Evento eliminado exitosamente!
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
        <h1 className="text-2xl font-bold text-red-600 mb-2">
          Eliminar Evento
        </h1>
        <p className="text-gray-600">
          Esta acción no se puede deshacer
        </p>
      </div>

      {/* Información del evento */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Información del evento
        </h2>
        
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-500">Nombre:</span>
            <p className="text-gray-800">{event.name}</p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Visibilidad:</span>
            <p className="text-gray-800">
              {event.isPublic ? 'Público' : 'Privado'}
            </p>
          </div>
          
          {event.bannerPhotoUrl && (
            <div>
              <span className="text-sm font-medium text-gray-500">Banner:</span>
              <div className="mt-2 relative w-full h-32 border rounded-lg overflow-hidden">
                <img
                  src={event.bannerPhotoUrl}
                  alt="Banner del evento"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/600x200.png?text=Error+de+Imagen';
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advertencia */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              ¡Atención! Esta acción es irreversible
            </h3>
            <p className="mt-1 text-sm text-red-700">
              Al eliminar este evento, se eliminarán permanentemente todos los datos asociados, 
              incluyendo invitaciones, participantes y cualquier información relacionada.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Formulario de confirmación */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-2">
            Para confirmar la eliminación, escribe el nombre del evento: 
            <span className="font-semibold text-red-600"> "{event.name}"</span>
          </label>
          <input
            type="text"
            id="confirmation"
            value={confirmationText}
            onChange={(e) => {
              setConfirmationText(e.target.value);
              if (error) setError(null); // Limpiar error al escribir
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Escribe el nombre exacto del evento"
          />
        </div>

        {/* Botones */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isLoading || confirmationText !== event.name}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Eliminando...' : 'Confirmar Eliminación'}
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Información adicional */}
      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>
          Si tienes dudas sobre esta acción, puedes cancelar y consultar con tu equipo.
        </p>
      </div>
    </div>
  );
}
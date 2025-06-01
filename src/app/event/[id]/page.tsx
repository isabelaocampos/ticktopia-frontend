import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getEventById } from '@/features/events/events.api';
import { use } from 'react';

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = use(params);
  
  // Validación del ID antes de hacer la llamada al API
  if (!id) {
    console.error('Event ID is undefined');
    return notFound();
  }
  
  const event = use(getEventById(id));
  
  if (!event) return notFound();

  return (
    <div className="container mx-auto p-6">
      {/* Título */}
      <h1 className="text-4xl font-bold mb-6">{event.name}</h1>
      
      {/* Banner */}
      <div className="mb-6">
        <Image
          src={event.bannerPhotoUrl || '/placeholder-banner.jpg'}
          alt={event.name}
          width={800}
          height={400}
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>
      
      {/* Estado */}
      <div className="mb-4">
        <span className="text-lg font-semibold">Estado: </span>
        <span className={`px-3 py-1 rounded-full text-sm ${
          event.isPublic 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {event.isPublic ? 'Público' : 'Privado'}
        </span>
      </div>
      
      {/* Organizador */}
      <div className="mb-6">
        <span className="text-lg font-semibold">Organizado por: </span>
        <span>{event.user?.name} {event.user?.lastname}</span>
      </div>
      
      {/* Lista de presentaciones */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Presentaciones Disponibles</h2>
        
        {Array.isArray(event.presentations) && event.presentations.length > 0 ? (
          <div className="space-y-4">
            {event.presentations.map((presentation: any, index: number) => (
              <div 
                key={presentation.id || `presentation-${index}`} 
                className="border rounded-lg p-4 mb-4 shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-2">{presentation.place}</h3>
                
                <div className="space-y-2 mb-4">
                  <p><strong>Ciudad:</strong> {presentation.city}</p>
                  <p><strong>Fecha:</strong> {new Date(presentation.startDate).toLocaleString()}</p>
                  <p><strong>Precio:</strong> ${presentation.price}</p>
                </div>
                
                <Link
                  href={`/event/${id}/checkout?presentationId=${presentation.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Comprar Boletas
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay presentaciones asociadas aún.</p>
        )}
      </div>
    </div>
  );
}
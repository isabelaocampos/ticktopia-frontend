import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getEventById } from '@/features/events/events.api';

interface EventDetailPageProps {
  params: {
    id: string;
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = params;

  const event = await getEventById(id);
  if (!event) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Título */}
      <h1 className="text-4xl font-bold mb-4">{event.name}</h1>

      {/* Banner */}
      <div className="relative w-full h-64 mb-6">
        <Image
          src={event.bannerPhotoUrl}
          alt={event.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Estado */}
      <p className="text-sm text-gray-600 mb-2">
        Estado:{" "}
        <span className={`font-semibold ${event.isPublic ? 'text-green-600' : 'text-red-600'}`}>
          {event.isPublic ? 'Público' : 'Privado'}
        </span>
      </p>

      {/* Organizador */}
      <p className="text-md text-gray-800 mb-6">
        Organizado por: {event.user?.name} {event.user?.lastname}
      </p>

      {/* Botón de compra */}
      <Link href={`/event/${id}/checkout`}>
        <button className="bg-brand text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-all">
          Comprar Entradas
        </button>
      </Link>
    </div>
  );
}

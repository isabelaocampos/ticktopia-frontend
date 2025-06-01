// app/event/update/[eventId]/page.tsx
import { getCurrentUser } from '@/features/auth/server/getCurrentUser';
import { getEventById } from '@/features/events/events.api';
import UpdateEventForm from '@/features/events/components/UpdateEventForm';
import { notFound, redirect } from 'next/navigation';

interface UpdateEventPageProps {
  params: {
    eventId: string;
  };
}

export default async function UpdateEventPage({ params }: UpdateEventPageProps) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  try {
    const event = await getEventById(params.eventId);
    
    // Verificar que el usuario sea el propietario del evento
    if (event.user?.id !== user.id) {
      return (
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Acceso Denegado
            </h2>
            <p className="text-red-600">
              Solo puedes editar tus propios eventos.
            </p>
          </div>
        </div>
      );
    }

    return <UpdateEventForm event={event} />;
    
  } catch (error) {
    console.error('Error loading event:', error);
    notFound();
  }
}
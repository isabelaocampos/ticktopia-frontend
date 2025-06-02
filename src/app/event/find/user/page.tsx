import { getCurrentUser } from '@/features/auth/server/getCurrentUser';
import EventList from '@/features/events/components/EventList';
import { getEventsByUserId } from '@/features/events/events.api';

export default async function MyEventsPage() {
  const user = await getCurrentUser(); // obtiene el user del token/cookie
  if (!user) return <div>Unauthorized</div>;

  // No necesitas pasar user.id porque el backend lo obtiene del token
  const events = await getEventsByUserId();

  return (
    <EventList
      initialEvents={events}
      showControls={true}
    />
  );
}
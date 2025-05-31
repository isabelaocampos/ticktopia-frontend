// app/event/my-events/page.tsx
import { getCurrentUser } from '@/features/auth/server/getCurrentUser';
import EventList from '@/features/events/components/EventList';
import { getEventsByUserId } from '@/features/events/events.api';


export default async function MyEventsPage() {
  const user = await getCurrentUser(); // obtiene el user del token/cookie
  if (!user) return <div>Unauthorized</div>;

  const events = await getEventsByUserId(user.id);

  return (
    <EventList
      initialEvents={events}
      showControls={true}
    />
  );
}

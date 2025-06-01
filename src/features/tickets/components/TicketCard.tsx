import { Ticket } from '@/shared/types/ticket';
import Image from 'next/image';
import { format } from 'date-fns';

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const { presentation, isActive, isRedeemed } = ticket;
  const event = presentation.event;

  return (
    <div className="w-full flex items-center gap-4 p-4 border rounded-xl shadow-md bg-white">
      <Image
        src={event.bannerPhotoUrl}
        alt={event.name}
        width={100}
        height={100}
        className="rounded-lg object-cover"
      />

      <div className="flex-1">
        <h2 className="text-lg font-semibold">{event.name}</h2>
        <p className="text-sm text-gray-600">{presentation.place}</p>
        <p className="text-sm text-gray-500">
          {format(new Date(presentation.startDate), 'PPPpp')}
        </p>

        <div className="mt-2 flex gap-2 text-sm">
          <span
            className={`px-2 py-1 rounded-full ${
              isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {isActive ? 'Activo' : 'Inactivo'}
          </span>
          <span
            className={`px-2 py-1 rounded-full ${
              isRedeemed ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {isRedeemed ? 'Redimido' : 'No redimido'}
          </span>
        </div>
      </div>
    </div>
  );
}

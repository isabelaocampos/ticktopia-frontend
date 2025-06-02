"use client"
import { useEffect, useState } from "react";
import { getEvents } from "@/features/events/events.api";
import { Event } from "@/shared/types/event";
import EventList from "../features/events/components/EventList";
import EventsHeroSection from "@/features/events/components/EventHeroSection";

export default function HomePage() {
  const [initialEvents, setInitialEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialEvents = async () => {
      try {
        const result = await getEvents({ limit: 10, offset: 0 });
        
        if ('error' in result) {
          setError(result.error);
        } else {
          setInitialEvents(result);
        }
      } catch (err) {
        console.error('Error fetching initial events:', err);
        setError('Error al cargar eventos');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialEvents();
  }, []);

  if (loading) {
    return (
      <main className="">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando eventos...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                Error al cargar eventos
              </h2>
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="">
      {/* Hero Section con carrusel de banners */}
      <EventsHeroSection events={initialEvents} />

      {/* Lista de eventos */}
      <div className="mt-8">
        <EventList initialEvents={initialEvents} />
      </div>
    </main>
  );
}
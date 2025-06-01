"use server"
import axiosServer from "@/shared/lib/axiosServer";
import { CreateEventDto, Event, GetEventsParams, User } from "@/shared/types/event";
import { cookies } from 'next/headers';

const prefix = "/event"

export async function getEvents(params: GetEventsParams = {}): Promise<Event[]> {
  const { limit = 10, offset = 0 } = params;

  const res = await axiosServer.get(`${prefix}/findAll`, {
    params: {
      limit: limit.toString(),
      offset: offset.toString(),
    },
  });
  console.log(res);
  return res.data;
}

export async function getEventsByUserId(userId: string): Promise<Event[]> {
  const res = await axiosServer.get(`/event/find/user/${userId}`);
  return res.data;
}

// OPCIÓN 1: Enviar solo la URL después de subir a Cloudinary
export async function createEvent(
  name: string,
  isPublic: boolean,
  bannerPhotoUrl: string
): Promise<Event> {
  const payload = {
    name,
    isPublic,
    bannerPhotoUrl
  };

  console.log('Payload enviado:', payload); // Debug

  const res = await axiosServer.post(`${prefix}/create`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('Respuesta del servidor:', res.data); // Debug
  return res.data;
}

export async function getEventById(id: string): Promise<Event> {
  const res = await axiosServer.get(`${prefix}/find/${id}`);
  return res.data;
}







"use client"
import axiosClient from "@/shared/lib/axiosClient";
import { CreateEventDto, Event, GetEventsParams, User, UpdateEventDto } from "@/shared/types/event";

const prefix = "/event"

export async function getEvents(params: GetEventsParams = {}): Promise<Event[] | { error: string }> {
  try {
    const { limit = 10, offset = 0 } = params;

    const res = await axiosClient.get(`${prefix}/findAll`, {
      params: {
        limit: limit.toString(),
        offset: offset.toString(),
      },
    });
    
    console.log("eventos obtenidos:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Error al obtener eventos:", error);
    const errorMessage = error.response?.data?.message || error.message || "Error al obtener los eventos";
    return { error: errorMessage };
  }
}

export async function getEventsByUserId(): Promise<Event[] | { error: string }> {
  try {
    const res = await axiosClient.get(`/event/find/user`);
    console.log("eventos del usuario:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Error al obtener eventos del usuario:", error);
    const errorMessage = error.response?.data?.message || error.message || "Error al obtener los eventos del usuario";
    return { error: errorMessage };
  }
}

export async function createEvent(
  name: string,
  isPublic: boolean,
  bannerPhotoUrl: string
): Promise<Event | { error: string }> {
  try {
    const payload = {
      name,
      isPublic,
      bannerPhotoUrl
    };

    console.log('Payload enviado:', payload);

    const res = await axiosClient.post(`${prefix}/create`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Evento creado:', res.data);
    return res.data;
  } catch (error: any) {
    console.error("Error al crear evento:", error);
    const errorMessage = error.response?.data?.message || error.message || "Error al crear el evento";
    return { error: errorMessage };
  }
}

export async function getEventById(term: string): Promise<Event | { error: string }> {
  try {
    const res = await axiosClient.get(`${prefix}/find/${term}`);
    console.log("evento encontrado:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Error al obtener evento:", error);
    
    // Manejar diferentes tipos de errores
    if (error.response?.status === 404) {
      return { error: "Evento no encontrado" };
    }
    if (error.response?.status === 403) {
      return { error: "No tienes permisos para ver este evento" };
    }
    if (error.response?.status === 401) {
      return { error: "Debes iniciar sesión para ver este evento" };
    }
    
    const errorMessage = error.response?.data?.message || error.message || "Error al obtener el evento";
    return { error: errorMessage };
  }
}

export async function updateEvent(eventId: string, updateData: UpdateEventDto): Promise<Event | { error: string }> {
  try {
    const res = await axiosClient.put(`/event/update/${eventId}`, updateData);
    console.log("evento actualizado:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Error al actualizar evento:", error);
    
    // Manejar diferentes tipos de errores
    if (error.response?.status === 404) {
      return { error: "Evento no encontrado" };
    }
    if (error.response?.status === 403) {
      return { error: "No tienes permisos para editar este evento" };
    }
    if (error.response?.status === 401) {
      return { error: "Debes iniciar sesión para editar este evento" };
    }
    
    const errorMessage = error.response?.data?.message || error.message || "Error al actualizar el evento";
    return { error: errorMessage };
  }
}

export const deleteEvent = async (eventId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await axiosClient.delete(`/event/delete/${eventId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting event:', error);
    
    // Manejar diferentes tipos de errores
    if (error.response?.status === 404) {
      return { success: false, error: "Evento no encontrado" };
    }
    if (error.response?.status === 403) {
      return { success: false, error: "No tienes permisos para eliminar este evento" };
    }
    if (error.response?.status === 401) {
      return { success: false, error: "Debes iniciar sesión para eliminar este evento" };
    }
    
    const errorMessage = error.response?.data?.message || error.message || "Error al eliminar el evento";
    return { success: false, error: errorMessage };
  }
};

// Función específica para obtener eventos para edición (sin restricción de visibilidad)
export async function getEventForEditing(eventId: string): Promise<Event | { error: string }> {
  try {
    const res = await axiosClient.get(`/event/find/manager/${eventId}`);
    console.log("evento encontrado para edición:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Error al obtener evento para edición:", error);
    
    // Manejar diferentes tipos de errores
    if (error.response?.status === 404) {
      return { error: "Evento no encontrado" };
    }
    if (error.response?.status === 403) {
      return { error: "No tienes permisos para editar este evento" };
    }
    if (error.response?.status === 401) {
      return { error: "Debes iniciar sesión para editar este evento" };
    }
    
    const errorMessage = error.response?.data?.message || error.message || "Error al obtener el evento";
    return { error: errorMessage };
  }
}
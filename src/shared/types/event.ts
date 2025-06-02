export interface User {
  id: string;
  email: string;
  name: string;
  lastname: string;
  isActive: boolean;
  roles: Role[];
}

// Define aquí la interfaz Presentation
export interface Presentation {
  idPresentation: string;
  place: string;
  capacity: number;
  openDate: string;
  startDate: string;
  price: number;
  latitude: number;
  longitude: number;
  description: string;
  ticketAvailabilityDate: string;
  ticketSaleAvailabilityDate: string;
  city: string;
}

export interface Event {
  id: string;
  name: string;
  bannerPhotoUrl: string;
  isPublic: boolean;
  user: User;

  // 👇 Aquí agregas el arreglo de presentaciones
  presentations?: Presentation[];
}

export interface GetEventsParams {
  limit?: number;
  offset?: number;
}

export interface CreateEventDto {
  name: string;
  bannerPhotoUrl: string;
  isPublic: boolean;
}

export type UpdateEventDto = {
  name?: string;
  isPublic?: boolean;
  bannerPhotoUrl?: string;
};


// shared/types/presentation.ts
export interface CreatePresentationDto {
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
  eventId: string;
}

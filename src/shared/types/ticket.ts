export interface User {
  id: string;
  email: string;
  name: string;
  lastname: string;
  isActive: boolean;
  roles: string[];
}

export interface Ticket {
  id: string;
  user: {
    id: string;
    email: string;
    name: string;
    lastname: string;
  };
  presentation: {
    idPresentation: string;
    place: string;
    startDate: string;
    event: {
      id: string;
      name: string;
      bannerPhotoUrl: string;
    };
  };
  isActive: boolean;
  isRedeemed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BuyTicketDto {
  presentationId: string;
  quantity: number;
}

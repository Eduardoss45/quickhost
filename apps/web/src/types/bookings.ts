export interface Booking {
  id: string;
  accommodationId: string;
  hostId: string;
  guestId: string;
  checkInDate: string;
  checkOutDate: string;
  totalDays: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFeeMultiplier: number;
  finalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
  createdAt: string;
}

export interface CreateBookingPayload {
  accommodationId: string;
  hostId: string;
  checkInDate: string;
  checkOutDate: string;
}

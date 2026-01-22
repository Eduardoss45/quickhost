export type BookingNotificationType = 'booking:created' | 'booking:confirmed' | 'booking:canceled';

export interface BookingNotificationEvent {
  type: BookingNotificationType;
  payload: unknown;
}

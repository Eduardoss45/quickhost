import { Accommodation } from 'src/types';

export type CreateAccommodationCommand = Accommodation & {
  creator_id: string;
};

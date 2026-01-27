import { Accommodation } from 'src/types';

export type UpdateAccommodationCommand = {
  id: string;
  data: Partial<Accommodation>;
  creatorId: string;
};

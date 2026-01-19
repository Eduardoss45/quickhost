export interface Amenities {
  wifi: boolean;
  tv: boolean;
  kitchen: boolean;
  washing_machine: boolean;
  parking_included: boolean;
  air_conditioning: boolean;
  pool: boolean;
  jacuzzi: boolean;
  grill: boolean;
  private_gym: boolean;
  beach_access: boolean;
  smoke_detector: boolean;
  fire_extinguisher: boolean;
  first_aid_kit: boolean;
  outdoor_camera: boolean;
}

export type AmenitiesResourceKey = keyof Amenities;

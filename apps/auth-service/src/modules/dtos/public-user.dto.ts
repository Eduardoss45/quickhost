export interface PublicUserDto {
  id: string;
  username: string;
  social_name?: string;
  profile_picture_url?: string | null;
  phone_number?: string;
}

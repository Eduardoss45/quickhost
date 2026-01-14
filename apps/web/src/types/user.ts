export interface UpdateUserPayload {
  username?: string;
  social_name?: string;
  cpf?: string;
  birth_date?: string;
  phone_number?: string;
}

export interface ProfileImageFile {
  buffer: string;
  originalName: string;
  mimetype: string;
}

export interface PublicUser {
  id: string;
  username: string;
  social_name?: string;
  profile_picture_url?: string | null;
}

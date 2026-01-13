export class UpdateUserProfileDto {
  username?: string;
  social_name?: string;
  cpf?: string;
  birth_date?: string;
  phone_number?: string;

  remove_profile_picture?: boolean;
}

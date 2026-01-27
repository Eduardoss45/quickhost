import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateCommentCommand {
  @IsNotEmpty()
  content: string;

  @IsNumber()
  rating: number;

  @IsUUID()
  accommodationId: string;

  @IsUUID()
  authorId: string;

  @IsString()
  authorName: string;
}

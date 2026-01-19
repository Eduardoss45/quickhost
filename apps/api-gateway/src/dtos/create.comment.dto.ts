import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  content: string = '';

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsString()
  authorName?: string;
}

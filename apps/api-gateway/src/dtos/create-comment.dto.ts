import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comentário do usuário',
    example: 'Ótima acomodação, muito limpa!',
  })
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Avaliação do imóvel',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}

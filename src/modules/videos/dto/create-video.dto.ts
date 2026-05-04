import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  youtubeId: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsString()
  @IsNotEmpty()
  idade: string;

  @IsInt()
  @IsOptional()
  duracao?: number;
}

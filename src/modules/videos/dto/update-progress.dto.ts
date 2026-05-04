import { IsInt, IsNumber, Min, Max } from 'class-validator';

export class UpdateProgressDto {
  @IsInt()
  videoId: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;
}

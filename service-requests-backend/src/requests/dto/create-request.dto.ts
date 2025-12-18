import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsInt()
  clientId: number;

  @IsString()
  climateTechType: string;

  @IsString()
  climateTechModel: string;

  @IsString()
  problemDescription: string;

  @IsOptional()
  @IsInt()
  masterId?: number;
}

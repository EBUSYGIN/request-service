import { IsInt } from 'class-validator';

export class AssignMasterDto {
  @IsInt()
  masterId: number;
}

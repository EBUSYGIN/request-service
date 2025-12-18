import { IsString } from 'class-validator';

export class AddCommentDto {
  @IsString()
  message: string;
}


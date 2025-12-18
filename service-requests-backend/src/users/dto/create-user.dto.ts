import { IsString, IsPhoneNumber, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  fio: string;

  @IsPhoneNumber('RU')
  phone: string;

  @IsString()
  login: string;

  @IsString()
  password: string;

  @IsIn(['Админ', 'Менеджер'])
  roleName: string;
}

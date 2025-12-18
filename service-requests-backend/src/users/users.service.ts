import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      include: { role: true },
      orderBy: { id: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  findClients() {
    return this.prisma.user.findMany({
      where: { role: { name: 'Заказчик' } },
      include: { role: true },
      orderBy: { id: 'asc' },
    });
  }

  async createUser(dto: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          fio: dto.fio,
          phone: dto.phone,
          login: dto.login,
          passwordHash: dto.password,
          role: { connect: { name: dto.roleName } },
        },
        include: { role: true },
      });

      return {
        id: user.id,
        fio: user.fio,
        phone: user.phone,
        login: user.login,
        role: user.role.name,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          'Пользователь с таким логином уже существует',
        );
      }
      throw error;
    }
  }
}

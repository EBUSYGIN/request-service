import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(login: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { login },
      include: { role: true },
    });

    if (!user || user.passwordHash !== password) {
      // пока без bcrypt — как в seed, потом заменим
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    return user;
  }

  async login(login: string, password: string) {
    const user = await this.validateUser(login, password);

    const payload = { sub: user.id, role: user.role.name };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        fio: user.fio,
        role: user.role.name,
      },
    };
  }
}

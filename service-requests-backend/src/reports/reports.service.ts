import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCompletedCount(from?: Date, to?: Date) {
    const where: {
      completionDate?: { gte?: Date; lte?: Date | undefined };
    } = {};

    if (from || to) {
      where.completionDate = {};
      if (from) where.completionDate.gte = from;
      if (to) where.completionDate.lte = to;
    }

    const count = await this.prisma.serviceRequest.count({
      where: {
        completionDate: where.completionDate,
      },
    });

    return { count };
  }

  async getAvgCompletionTime() {
    const completed = await this.prisma.serviceRequest.findMany({
      where: { completionDate: { not: null } },
      select: { startDate: true, completionDate: true },
    });

    if (completed.length === 0) {
      return { avgHours: 0 };
    }

    const totalMs = completed.reduce((sum, r) => {
      const end = r.completionDate as Date;
      return sum + (end.getTime() - r.startDate.getTime());
    }, 0);

    const avgMs = totalMs / completed.length;
    const avgHours = avgMs / (1000 * 60 * 60);

    return { avgHours };
  }

  async getStatsByProblemDescription() {
    const stats = await this.prisma.serviceRequest.groupBy({
      by: ['problemDescription'],
      _count: { _all: true },
    });

    return stats.map((row) => ({
      problemDescription: row.problemDescription,
      count: row._count?._all ?? 0,
    }));
  }
}

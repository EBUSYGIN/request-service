import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('completed')
  @Roles('Менеджер')
  getCompleted(@Query('from') from?: string, @Query('to') to?: string) {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;
    return this.reportsService.getCompletedCount(fromDate, toDate);
  }

  @Get('avg-completion-time')
  @Roles('Менеджер')
  getAvgCompletionTime() {
    return this.reportsService.getAvgCompletionTime();
  }

  @Get('by-problem')
  @Roles('Менеджер')
  getByProblem() {
    return this.reportsService.getStatsByProblemDescription();
  }
}

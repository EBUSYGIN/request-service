import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AssignMasterDto } from './dto/assign-master.dto';
import { AddCommentDto } from './dto/add-comment.dto';

import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  findAll() {
    return this.requestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.requestsService.findOne(id);
  }

  @Post()
  @Roles('Оператор', 'Менеджер')
  create(@Body() dto: CreateRequestDto) {
    return this.requestsService.create(dto);
  }

  @Patch(':id/status')
  @Roles('Специалист', 'Менеджер')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.requestsService.updateStatus(id, dto);
  }

  @Patch(':id/assign-master')
  @Roles('Менеджер')
  assignMaster(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignMasterDto,
  ) {
    return this.requestsService.assignMaster(id, dto);
  }

  @Post(':id/comments')
  @Roles('Специалист', 'Менеджер')
  addComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddCommentDto,
    @Req() req: { user: { userId: number } },
  ) {
    return this.requestsService.addComment(id, dto, req.user.userId);
  }
}

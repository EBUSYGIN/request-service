import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AssignMasterDto } from './dto/assign-master.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService) {}

  private async findOrCreateEquipment(typeName: string, modelName: string) {
    const type = await this.prisma.equipmentType.upsert({
      where: { name: typeName }, // здесь ок, name @unique
      create: { name: typeName },
      update: {},
    });

    const model = await this.prisma.equipmentModel.upsert({
      where: {
        name_equipmentTypeId: {
          name: modelName,
          equipmentTypeId: type.id,
        },
      },
      create: {
        name: modelName,
        equipmentTypeId: type.id,
      },
      update: {},
    });

    const equipment = await this.prisma.equipment.create({
      data: { modelId: model.id },
    });

    return equipment;
  }

  async create(dto: CreateRequestDto) {
    const client = await this.prisma.user.findUnique({
      where: { id: dto.clientId },
    });
    if (!client) {
      throw new NotFoundException('Клиент не найден');
    }

    const equipment = await this.findOrCreateEquipment(
      dto.climateTechType,
      dto.climateTechModel,
    );

    let status = await this.prisma.requestStatus.findFirst({
      where: { name: 'Новая заявка' },
    });
    if (!status) {
      status = await this.prisma.requestStatus.create({
        data: { name: 'Новая заявка' },
      });
    }

    const agg = await this.prisma.serviceRequest.aggregate({
      _max: { number: true },
    });
    const nextNumber = (agg._max.number ?? 0) + 1;

    let masterId: number | null = null;
    if (dto.masterId !== undefined) {
      const master = await this.prisma.user.findUnique({
        where: { id: dto.masterId },
      });
      if (!master) {
        throw new NotFoundException('Мастер не найден');
      }
      masterId = master.id;
    }

    return this.prisma.serviceRequest.create({
      data: {
        number: nextNumber,
        startDate: new Date(),
        problemDescription: dto.problemDescription,
        statusId: status.id,
        equipmentId: equipment.id,
        clientId: client.id,
        masterId,
      },
    });
  }

  findAll() {
    return this.prisma.serviceRequest.findMany({
      include: {
        client: true,
        master: true,
        status: true,
        equipment: {
          include: { model: { include: { equipmentType: true } } },
        },
        comments: { include: { author: true } },
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        client: true,
        master: true,
        status: true,
        equipment: {
          include: { model: { include: { equipmentType: true } } },
        },
        comments: { include: { author: true } },
      },
    });

    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    return request;
  }

  async updateStatus(id: number, dto: UpdateStatusDto) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
    });
    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    let status = await this.prisma.requestStatus.findFirst({
      where: { name: dto.statusName },
    });
    if (!status) {
      status = await this.prisma.requestStatus.create({
        data: { name: dto.statusName },
      });
    }

    const data: {
      statusId: number;
      completionDate?: Date | null;
    } = {
      statusId: status.id,
    };

    const lower = dto.statusName.toLowerCase();
    if (lower.includes('готов') || lower.includes('заверш')) {
      data.completionDate = new Date();
    }

    return this.prisma.serviceRequest.update({
      where: { id },
      data,
    });
  }

  async assignMaster(id: number, dto: AssignMasterDto) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
    });
    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    const master = await this.prisma.user.findUnique({
      where: { id: dto.masterId },
    });
    if (!master) {
      throw new NotFoundException('Мастер не найден');
    }

    return this.prisma.serviceRequest.update({
      where: { id },
      data: { masterId: master.id },
    });
  }

  async addComment(id: number, dto: AddCommentDto, authorId: number) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
    });
    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    return this.prisma.requestComment.create({
      data: {
        message: dto.message,
        requestId: request.id,
        authorId,
      },
    });
  }
}

// Статус заявки
export interface RequestStatus {
  id: number;
  name: string;
}

// Тип оборудования
export interface EquipmentType {
  id: number;
  name: string;
}

// Модель оборудования
export interface EquipmentModel {
  id: number;
  name: string;
  equipmentTypeId: number;
  equipmentType?: EquipmentType;
}

// Оборудование (структура с бэка: equipment.model.equipmentType)
export interface Equipment {
  id: number;
  modelId: number;
  model?: EquipmentModel;
}

// Пользователь в заявке (с role как объект)
export interface RequestUser {
  id: number;
  fio: string;
  phone: string;
  login: string;
  roleId: number;
  role: {
    id: number;
    name: string;
  };
}

// Комментарий к заявке
export interface RequestComment {
  id: number;
  message: string;
  createdAt: string;
  requestId: number;
  authorId: number;
  author?: RequestUser;
}

// Заявка на ремонт
export interface ServiceRequest {
  id: number;
  number: number;
  startDate: string;
  completionDate: string | null;
  problemDescription: string;
  repairParts: string | null;
  statusId: number;
  status: RequestStatus;
  equipmentId: number | null;
  equipment: Equipment | null;
  clientId: number;
  client: RequestUser;
  masterId: number | null;
  master: RequestUser | null;
  comments?: RequestComment[];
}

// DTO для создания заявки (бэк использует climateTechType и climateTechModel!)
export interface CreateRequestDTO {
  clientId: number;
  climateTechType: string;
  climateTechModel: string;
  problemDescription: string;
  masterId?: number;
}

// DTO для обновления статуса (бэк принимает statusName - строку!)
export interface UpdateStatusDTO {
  statusName: string;
}

// DTO для назначения мастера
export interface UpdateMasterDTO {
  masterId: number;
}

// DTO для добавления комментария
export interface CreateCommentDTO {
  message: string;
}

// Фильтры для заявок (клиентские, бэк не поддерживает фильтры)
export interface RequestFilters {
  status?: string;
  from?: string;
  to?: string;
  clientId?: number;
  masterId?: number;
}

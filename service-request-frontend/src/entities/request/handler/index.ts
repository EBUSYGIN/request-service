import { axiosInstance } from '@/shared/lib/axiosInstance';
import { RequestsAPI } from '../api';
import type {
  ServiceRequest,
  RequestComment,
  CreateRequestDTO,
  UpdateStatusDTO,
  UpdateMasterDTO,
  CreateCommentDTO,
} from '../types';

// Заявки
const getAllRequests = async (): Promise<ServiceRequest[]> => {
  const response = await axiosInstance.get(RequestsAPI.getAll());
  return response.data;
};

const getRequestById = async (id: number): Promise<ServiceRequest> => {
  const response = await axiosInstance.get(RequestsAPI.getById(id));
  return response.data;
};

const createRequest = async (data: CreateRequestDTO): Promise<ServiceRequest> => {
  const response = await axiosInstance.post(RequestsAPI.create(), data);
  return response.data;
};

const updateRequestStatus = async (id: number, data: UpdateStatusDTO): Promise<ServiceRequest> => {
  const response = await axiosInstance.patch(RequestsAPI.updateStatus(id), data);
  return response.data;
};

const assignMaster = async (id: number, data: UpdateMasterDTO): Promise<ServiceRequest> => {
  const response = await axiosInstance.patch(RequestsAPI.assignMaster(id), data);
  return response.data;
};

// Комментарии
const addComment = async (requestId: number, data: CreateCommentDTO): Promise<RequestComment> => {
  const response = await axiosInstance.post(RequestsAPI.addComment(requestId), data);
  return response.data;
};

export const RequestsHandler = {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequestStatus,
  assignMaster,
  addComment,
};

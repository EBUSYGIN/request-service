import { axiosInstance } from '@/shared/lib/axiosInstance';
import { UsersAPI } from '../api';
import type { User, CreateUserDTO } from '../types';

const getAllUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get(UsersAPI.getAll());
  return response.data;
};

const getUserById = async (id: number): Promise<User> => {
  const response = await axiosInstance.get(UsersAPI.getById(id));
  return response.data;
};

const createUser = async (data: CreateUserDTO): Promise<User> => {
  const response = await axiosInstance.post(UsersAPI.create(), data);
  return response.data;
};

// Получить всех клиентов (заказчиков)
const getClients = async (): Promise<User[]> => {
  const response = await axiosInstance.get(UsersAPI.getClients());
  return response.data;
};

// Получить всех специалистов (мастеров) - фильтруем на клиенте
const getSpecialists = async (): Promise<User[]> => {
  const users = await getAllUsers();
  return users.filter((u) => u.role.name === 'Специалист');
};

export const UsersHandler = {
  getAllUsers,
  getUserById,
  createUser,
  getClients,
  getSpecialists,
};

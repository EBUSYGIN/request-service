import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UsersHandler } from '../handler';
import type { CreateUserDTO, UpdateUserRoleDTO } from '../types';

export const useUsers = (role?: string) =>
  useQuery({
    queryKey: ['users', role],
    queryFn: () => UsersHandler.getAllUsers(role),
  });

export const useUser = (id: number) =>
  useQuery({
    queryKey: ['user', id],
    queryFn: () => UsersHandler.getUserById(id),
    enabled: !!id,
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserDTO) => UsersHandler.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRoleDTO }) =>
      UsersHandler.updateUserRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};


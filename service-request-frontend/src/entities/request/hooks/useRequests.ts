import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RequestsHandler } from '../handler';
import type { CreateRequestDTO, UpdateStatusDTO, UpdateMasterDTO, CreateCommentDTO } from '../types';

export const useRequests = () =>
  useQuery({
    queryKey: ['requests'],
    queryFn: () => RequestsHandler.getAllRequests(),
  });

export const useRequest = (id: number) =>
  useQuery({
    queryKey: ['request', id],
    queryFn: () => RequestsHandler.getRequestById(id),
    enabled: !!id,
  });

// Mutations
export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRequestDTO) => RequestsHandler.createRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStatusDTO }) =>
      RequestsHandler.updateRequestStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['request', id] });
    },
  });
};

export const useAssignMaster = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMasterDTO }) =>
      RequestsHandler.assignMaster(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['request', id] });
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: number; data: CreateCommentDTO }) =>
      RequestsHandler.addComment(requestId, data),
    onSuccess: (_, { requestId }) => {
      queryClient.invalidateQueries({ queryKey: ['request', requestId] });
    },
  });
};

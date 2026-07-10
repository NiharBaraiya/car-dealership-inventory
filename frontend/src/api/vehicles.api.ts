import apiClient from './client';
import {
  ApiResponse,
  Vehicle,
  VehicleSearchParams,
  CreateVehicleInput,
} from '../types';

export const vehiclesApi = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<Vehicle[]>>('/vehicles');
    return data.data;
  },

  search: async (params: VehicleSearchParams) => {
    const { data } = await apiClient.get<ApiResponse<Vehicle[]>>(
      '/vehicles/search',
      { params }
    );
    return data.data;
  },

  create: async (input: CreateVehicleInput) => {
    const { data } = await apiClient.post<ApiResponse<Vehicle>>(
      '/vehicles',
      input
    );
    return data.data;
  },

  update: async (id: string, input: Partial<CreateVehicleInput>) => {
    const { data } = await apiClient.put<ApiResponse<Vehicle>>(
      `/vehicles/${id}`,
      input
    );
    return data.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/vehicles/${id}`);
  },

  purchase: async (id: string) => {
    const { data } = await apiClient.post<ApiResponse<Vehicle>>(
      `/vehicles/${id}/purchase`
    );
    return data.data;
  },

  restock: async (id: string, amount: number) => {
    const { data } = await apiClient.post<ApiResponse<Vehicle>>(
      `/vehicles/${id}/restock`,
      { amount }
    );
    return data.data;
  },
};

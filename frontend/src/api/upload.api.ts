import apiClient from './client';
import { ApiResponse } from '../types';

export const uploadApi = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await apiClient.post<ApiResponse<{ imageUrl: string }>>(
      '/upload/image',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    return data.data.imageUrl;
  },
};

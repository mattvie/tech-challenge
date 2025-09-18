import api from './api';
import { UploadResponse } from '../types';

export const uploadService = {
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<UploadResponse>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async deleteImage(key: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/upload/image/${key}`);
    return response.data;
  },
};
import { useState } from 'react';
import { uploadService } from '../services/uploadService';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<any>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);
    
    try {
      const response = await uploadService.uploadImage(file);
      setUploadedFile(response.file);
      return response.file;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to upload file';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (key: string) => {
    try {
      await uploadService.deleteImage(key);
      setUploadedFile(null);
    } catch (err: any) {
      throw err;
    }
  };

  const clearError = () => setError(null);
  const clearUploadedFile = () => setUploadedFile(null);

  return {
    uploading,
    error,
    uploadedFile,
    uploadFile,
    deleteFile,
    clearError,
    clearUploadedFile,
  };
};
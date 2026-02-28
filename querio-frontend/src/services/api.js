import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Unified query
export const queryUnified = async (question, top_k = 3) => {
  try {
    const response = await api.post('/query', null, {
      params: { question, top_k },
    });
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.detail || 'Query failed');
    throw error;
  }
};

// Upload document
export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    toast.success('File uploaded successfully');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.detail || 'Upload failed');
    throw error;
  }
};

// Clear vectors (optional)
export const clearVectors = async () => {
  try {
    await api.delete('/vectors/clear');
    toast.success('Vector store cleared');
  } catch (error) {
    toast.error(error.response?.data?.detail || 'Failed to clear vectors');
  }
};
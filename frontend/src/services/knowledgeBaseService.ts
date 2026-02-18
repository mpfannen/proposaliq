import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface KBDocument {
  id: number;
  user_id: number;
  filename: string;
  document_type: string;
  file_size: number | null;
  created_at: string;
  updated_at: string;
}

const knowledgeBaseService = {
  uploadDocument: async (
    file: File,
    documentType: string,
    onProgress?: (progress: number) => void
  ): Promise<KBDocument> => {
    const formData = new FormData();
    formData.append('kb_file', file);
    formData.append('document_type', documentType);

    const token = localStorage.getItem('token');

    const response = await axios.post(
      `${API_URL}/api/knowledge-base/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(pct);
          }
        },
      }
    );

    return response.data.data;
  },

  getDocuments: async (): Promise<KBDocument[]> => {
    const token = localStorage.getItem('token');

    const response = await axios.get(`${API_URL}/api/knowledge-base`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data.documents;
  },

  deleteDocument: async (id: number): Promise<void> => {
    const token = localStorage.getItem('token');

    await axios.delete(`${API_URL}/api/knowledge-base/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default knowledgeBaseService;

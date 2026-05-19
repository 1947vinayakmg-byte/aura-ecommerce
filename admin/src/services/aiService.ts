import api from './api';

export const aiService = {
  getInsights: async (data: any) => {
    const response = await api.post('/ai/insights', { data });
    return response.data;
  }
};

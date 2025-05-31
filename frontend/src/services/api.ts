import axios from 'axios';
import { getAuth } from 'firebase/auth';

// APIクライアントの作成
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター - 認証トークンの追加
apiClient.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// レスポンスインターセプター - エラーハンドリング
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// テキスト生成API
export const generateText = async (prompt: string, maxTokens: number = 1024) => {
  try {
    const response = await apiClient.post('/generate-text', {
      prompt,
      max_tokens: maxTokens,
    });
    return response.data;
  } catch (error) {
    console.error('Text generation error:', error);
    throw error;
  }
};

// チャットAPI
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const sendChatMessage = async (messages: ChatMessage[]) => {
  try {
    const response = await apiClient.post('/chat', {
      messages,
    });
    return response.data;
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
};

export default apiClient;
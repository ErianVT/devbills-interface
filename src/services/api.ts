import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { firebaseAuth } from "../config/firebase"; // ✅ Importa o auth

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// ✅ ADICIONA O INTERCEPTOR:
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const user = firebaseAuth.currentUser;

    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
        console.log("🔑 Token enviado:", `${token.substring(0, 30)}...`);
      } catch (error) {
        console.error("❌ Erro ao obter o token do usuário:", error);
      }
    } else {
      console.warn("⚠ Usuário não autenticado!");
    }

    return config;
  },
);

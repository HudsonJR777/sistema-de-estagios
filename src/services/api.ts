import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  timeout: 10000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

console.log("API Base URL:", api.defaults.baseURL);

api.interceptors.request.use(
  (config) => {
    // Adicione token de autenticação se necessário
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para responses (opcional - para tratamento de erros)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Erro na API:", error);
    return Promise.reject(error);
  },
);

export default api;

import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";

/* ─── TYPES ──────────────────────────────────────────────────── */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}



export interface Userdata {
  name: string;
  username: string;
  email: string;
  avatar: {
    url: string;
    publicId: string;
  }
  bio: string;
  settings: {
    pushNotifications: boolean;
    privateProfile: boolean;
    theme: "light" | "dark"
  }
}

export interface HangoutsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  hangouts: Hangout[];
}

export interface Hangout {
  _id: string;
  title: string;
  description: string;
  vibe: string;
  category: string;
  location: {
    type: string;
    coordinates: [number, number];
    name: string;
    address: string;
  };
  startTime: string;
  endTime?: string;
  host: {
    _id: string;
    name: string;
    username: string;
    bio?: string;
    avatar: { url: string; publicId: string };
  };
  maxParticipants: number;
  participants: {
    _id: string;
    name: string;
    username: string;
    avatar: { url: string; publicId: string };
  }[];
  approvalRequired: boolean;
  tags: string[];
  ageLimit: number;
  customVibe: string;
  restrictions: string;
  status: "active" | "full" | "ended";
  message: string;
  image: { url: string; publicId: string };
  participantCount?: number;
  isFull?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetHangoutsParams {
  page?: number;
  limit?: number;
  category?: string;
  vibe?: string;
  sort?: string;
  lat?: number;
  lng?: number;
}

/* ─── BASE INSTANCE ──────────────────────────────────────────── */
const ApiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

/* ─── REQUEST INTERCEPTOR — attach token if present ─────────── */
ApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ─── RESPONSE INTERCEPTOR — unwrap / handle errors ─────────── */
ApiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

/* ─── AUTH API ───────────────────────────────────────────────── */
export const authApi = {
  login: (data: { email: string; password: string }): Promise<{ success: boolean; token: string; user: any }> =>
    ApiClient.post("/auth/login", data),

  register: (data: { name: string; username: string; email: string; password: string }): Promise<{ success: boolean; token: string; user: any }> =>
    ApiClient.post("/auth/register", data),

  getMe: (): Promise<{ success: boolean; user: any }> =>
    ApiClient.get("/auth/me"),

  logout: (): Promise<ApiResponse> =>
    ApiClient.post("/auth/logout"),
};

/* ─── HANGOUTS API ───────────────────────────────────────────── */
export const hangoutsApi = {
  getAll: (params: GetHangoutsParams = {}): Promise<HangoutsResponse> =>
    ApiClient.get("/hangouts/", { params }),

  getById: (id: string): Promise<{ success: boolean; hangout: Hangout }> =>
    ApiClient.get(`/hangouts/${id}`),

  create: (data: FormData): Promise<{ success: boolean; hangout: Hangout }> =>
    ApiClient.post("/hangouts/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id: string, data: FormData | Record<string, any>): Promise<{ success: boolean; hangout: Hangout }> => {
    const isFormData = data instanceof FormData;
    return ApiClient.put(`/hangouts/${id}`, data, {
      ...(isFormData && { headers: { "Content-Type": "multipart/form-data" } }),
    });
  },

  delete: (id: string): Promise<ApiResponse> =>
    ApiClient.delete(`/hangouts/${id}`),

  join: (id: string, message?: string): Promise<ApiResponse & { hangout?: Hangout; notification?: any }> =>
    ApiClient.post(`/hangouts/${id}/join`, { message }),

  leave: (id: string): Promise<ApiResponse> =>
    ApiClient.post(`/hangouts/${id}/leave`),

  getNearby: (params: { lat: number; lng: number; radius?: number; limit?: number }): Promise<{ success: boolean; count: number; hangouts: Hangout[] }> =>
    ApiClient.get("/hangouts/nearby", { params }),
};

/* ─── NOTIFICATIONS API ──────────────────────────────────────── */
export const notificationsApi = {
  getAll: (tab?: string): Promise<any> =>
    ApiClient.get("/notifications", { params: { tab } }),

  respond: (id: string, action: "accepted" | "rejected"): Promise<any> =>
    ApiClient.put(`/notifications/${id}/respond`, { action }),

  markRead: (id: string): Promise<any> =>
    ApiClient.put(`/notifications/${id}/read`),
};

/* ─── USERS API ──────────────────────────────────────────────── */
export const usersApi = {
  getProfile: (id: string): Promise<any> =>
    ApiClient.get(`/users/${id}`),

  updateProfile: (data: FormData | Record<string, any>): Promise<any> => {
    const isFormData = data instanceof FormData;
    return ApiClient.put("/users/me", data, {
      ...(isFormData && { headers: { "Content-Type": "multipart/form-data" } }),
    });
  },

  getMyHangouts: (tab?: string): Promise<any> =>
    ApiClient.get("/users/me/hangouts", { params: { tab } }),
};

export default ApiClient;
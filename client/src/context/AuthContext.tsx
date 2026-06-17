import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authApi } from "../api/ApiClient";

/* ─── TYPES ──────────────────────────────────────────────────── */
export interface User {
  _id: string;
  id?: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatar: { url: string; publicId: string };
  settings?: {
    pushNotifications: boolean;
    privateProfile: boolean;
    theme: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

/* ─── SYNC INIT from localStorage (avoids flash-redirect on refresh) ── */
const getInitialAuth = (): { user: User | null; token: string | null } => {
  try {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      return { user: JSON.parse(storedUser), token: storedToken };
    }
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  return { user: null, token: null };
};

/* ─── CONTEXT ────────────────────────────────────────────────── */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ─── PROVIDER ───────────────────────────────────────────────── */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize synchronously from localStorage — no flash of unauthenticated state
  const initial = getInitialAuth();
  const [user, setUser] = useState<User | null>(initial.user);
  const [token, setToken] = useState<string | null>(initial.token);
  const [isLoading, setIsLoading] = useState(false);

  /* ── Optional: validate token on mount (background, non-blocking) ── */
  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    authApi
      .getMe()
      .then((res) => {
        // Update user with fresh data from server
        const freshUser = res.user;
        setUser(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));
      })
      .catch(() => {
        // Token expired or invalid — clear session
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []); // Only on mount

  /* ── Login ─────────────────────────────────────────────────── */
  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    const { token: newToken, user: newUser } = res;

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
  };

  /* ── Register ──────────────────────────────────────────────── */
  const register = async (
    name: string,
    username: string,
    email: string,
    password: string
  ) => {
    const res = await authApi.register({ name, username, email, password });
    const { token: newToken, user: newUser } = res;

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
  };

  /* ── Logout ────────────────────────────────────────────────── */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);

    // Fire-and-forget server-side logout
    authApi.logout().catch(() => {});
  };

  /* ── Update user (after profile edit) ──────────────────────── */
  const updateUser = (updatedUser: User) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ─── HOOK ───────────────────────────────────────────────────── */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

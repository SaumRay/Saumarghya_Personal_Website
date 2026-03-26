import { createContext, useContext, useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface AdminAuthContextType {
  token: string | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  isAuthed: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  token: null,
  login: async () => false,
  logout: () => {},
  isAuthed: false,
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("admin_token"));

  useEffect(() => {
    if (token) localStorage.setItem("admin_token", token);
    else localStorage.removeItem("admin_token");
  }, [token]);

  const login = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        setToken(data.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => setToken(null);

  return (
    <AdminAuthContext.Provider value={{ token, login, logout, isAuthed: !!token }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
export const API_BASE = API;

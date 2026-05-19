import API from "./api";

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await API.post("/auth/login", {
      email,
      password,
    });

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    // Map the backend response fields correctly
    const userData = {
      id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      status: 'active' // Default status for admin
    };

    return { user: userData };
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminInfo");
  },

  forgotPassword: async (email: string) => {
    const { data } = await API.post("/auth/forgot-password", { email });
    return data;
  },

  resetPassword: async (token: string, password: string) => {
    const { data } = await API.put(`/auth/reset-password/${token}`, { password });
    return data;
  },

  getCurrentUser: async () => {
    const { data } = await API.get("/auth/profile");
    return {
      ...data,
      id: data._id,
      status: data.status || 'active',
      totalOrders: data.totalOrders || 0,
      totalSpent: data.totalSpent || 0,
      createdAt: data.createdAt || new Date().toISOString()
    };
  },
};

// Keeping loginAdmin for compatibility if needed, but using the service is preferred
export const loginAdmin = authService.login;
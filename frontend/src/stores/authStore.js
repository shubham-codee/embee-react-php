import { create } from "zustand";
import axios from "../api/axiosInstance";

const useAuthStore = create((set) => ({
  user: null,

  setUser: (userData) => set({ user: userData }),

  fetchUser: async () => {
    try {
      const res = await axios.get("/me.php");
      if (res.data.success) {
        set({ user: res.data.data });
      } else {
        set({ user: null });
      }
    } catch (err) {
      set({ user: null });
    }
  },

  logout: async () => {
    try {
      await axios.post("/logout.php", null);
      set({ user: null });
    } catch (err) {
      console.error("Logout failed", err);
    }
  },
}));

export default useAuthStore;

import { create } from 'zustand';

const useErrorStore = create((set) => ({
  errorMessage: null,
  errorCode: null,

  setError: (message, statusCode) => {
    console.log("Logged Error:", message); 
    set({ errorMessage: message, errorCode: statusCode });
  },

  resetError: () => set({ errorMessage: null }),
}));

export default useErrorStore;

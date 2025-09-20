import { create } from "zustand";

const useDraftStore = create((set, get) => ({
  drafts: [],
  setDrafts: (data) => {
    set({ drafts: data });
  },
}));

export default useDraftStore;

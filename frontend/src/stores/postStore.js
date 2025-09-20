import { create } from "zustand";

const usePostStore = create((set, get) => ({
  posts: [],
  setPosts: (data) => {
    set({ posts: data });
  },
  addPost: (newPost) => {
    set((state) => ({ posts: [newPost, ...state.posts] }));
  },
  updatePost: (updatedPost) => {
    set((state) => ({
      posts: state.posts.map((currPost) =>
        currPost.id == updatedPost.id ? updatedPost : currPost
      ),
    }));
  },
  deletePost: (id) => {
    set((state) => ({
      posts: state.posts.filter((currPost) => currPost.id != id),
    }));
  },
}));

export default usePostStore;

import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from "./layouts/MainLayout";
import AllPosts from "./components/AllPosts";
import CreatePostForm from "./components/CreatePostForm";
import PostDetails from "./components/PostDetails";
import EditPostForm from "./components/EditPostForm";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import useAuthStore from "./stores/authStore";
import ErrorPage from "./pages/ErrorPage";
import FavouritesPage from "./pages/FavouritesPage";
import DraftsPage from "./pages/DraftsPage";
import DraftDetailsPage from "./pages/DraftDetailsPage";
import CreateDraftForm from "./components/CreateDraftForm";
import EditDraftForm from "./components/EditDraftForm";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<AllPosts />} />
          <Route path="/posts/new" element={<CreatePostForm />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/posts/:id/edit" element={<EditPostForm />} />
          <Route path="/favourites" element={<FavouritesPage />} />
          <Route path="/drafts" element={<DraftsPage />} />
          <Route path="/drafts/new" element={<CreateDraftForm />} />
          <Route path="/drafts/:id" element={<DraftDetailsPage />} />
          <Route path="/drafts/:id/edit" element={<EditDraftForm />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

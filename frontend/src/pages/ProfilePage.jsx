import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import PostCard from "../components/PostCard";
import useErrorStore from "../stores/errorStore";
import axios from "../api/axiosInstance";
import {
  DescriptionOutlined,
  NoteAddOutlined,
  AddBox,
} from "@mui/icons-material";
import { Button } from "@mui/material";

function ProfilePage() {
  const [userPosts, setUserPosts] = useState([]);
  const setError = useErrorStore((state) => state.setError);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/getPostsByUser.php");
        setUserPosts(res.data.data);
      } catch (err) {
        setError(
          "ProfilePage: " + err.response?.data?.error,
          err.response?.status
        );
        navigate("/error");
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1976d2]">
            Your Posts
          </h1>

          <Button
            variant="contained"
            color="primary"
            size="medium"
            component={Link}
            to="/posts/new"
            startIcon={<AddBox />}
            className="cursor-pointer hidden sm:inline-flex"
          >
            New Post
          </Button>
        </div>

        <p className="text-gray-600 text-sm sm:text-base">
          {userPosts.length === 0
            ? "No posts yet"
            : `${userPosts.length} post${userPosts.length > 1 ? "s" : ""}`}
        </p>

        {userPosts.length === 0 ? (
          <div className="mt-1 rounded-xl border border-gray-200 bg-gray-50 p-6 flex flex-col items-center justify-center text-center">
            <DescriptionOutlined
              className="text-gray-400 mb-2"
              fontSize="large"
            />
            <p className="text-gray-600 text-sm sm:text-base mb-3">
              You haven’t created any post yet.
            </p>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/drafts/new"
              startIcon={<NoteAddOutlined />}
              className="cursor-pointer"
            >
              Create your first post
            </Button>
          </div>
        ) : (
          <div className="flex flex-row gap-4 py-4 justify-center">
            {userPosts.map((post) => (
              <Link to={`/posts/${post.id}`} key={post.id}>
                <PostCard post={post} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ProfilePage;

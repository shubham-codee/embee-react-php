import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import usePostStore from "../stores/postStore";
import useErrorStore from "../stores/errorStore";
import { Link, useNavigate } from "react-router";

import axios from "../api/axiosInstance";

function AllPosts() {
  const { posts, setPosts } = usePostStore();
  const setError = useErrorStore((state) => state.setError);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/getPosts.php");
        setPosts(res.data.data);
      } catch (err) {
        setError(
          "AllPosts: " + err.response?.data?.error,
          err.response?.status
        );
        navigate("/error");
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <div className="max-w-7xl flex flex-wrap justify-center gap-4 py-4 mx-auto">
        {posts.map((post) => (
          <Link to={`/posts/${post.id}`} key={post.id}>
            <PostCard post={post} />
          </Link>
        ))}
      </div>
    </>
  );
}

export default AllPosts;

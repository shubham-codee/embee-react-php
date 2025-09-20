import React, { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router";
import axios from "../api/axiosInstance";
import usePostStore from "../stores/postStore";
import useErrorStore from "../stores/errorStore";
import useAuthStore from "../stores/authStore";

import {
  AccountCircle,
  ChatBubbleOutline,
  Check,
  Close,
  DeleteOutline,
  Edit,
  Send,
  Star,
  StarBorder,
} from "@mui/icons-material";

function PostDetails() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isFavourite, setIsFavourite] = useState();
  const [editedContent, setEditedContent] = useState("");
  const [editedCommentId, setEditedCommentId] = useState(null);

  const setError = useErrorStore((state) => state.setError);
  const deletePost = usePostStore((state) => state.deletePost);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/getPostById.php?id=${id}`);
        setPost(res.data.data);
      } catch (err) {
        setError(
          "EditPostForm: " + err.response?.data?.error,
          err.response?.status
        );
        navigate("/error");
      }
    };

    fetchPost();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/getComments.php?post_id=${id}`);
        setComments(res.data.data);
      } catch (err) {
        setError(
          "Fetch Comments: " + err.response?.data?.error,
          err.response?.status
        );
        navigate("/error");
      }
    };

    fetchComments();
  }, []);

  useEffect(() => {
    if (user) {
      const checkFavourite = async () => {
        try {
          const res = await axios.post(`/checkFavourite.php`, {
            post_id: id,
          });
          setIsFavourite(res.data.data.isFavourite);
        } catch (err) {
          setError(
            "CheckFavourite: " + err.response?.data?.error,
            err.response?.status
          );
          navigate("/error");
        }
      };

      checkFavourite();
    }
  }, [user, id]);

  const handleEditClick = (comment) => {
    setEditedCommentId(comment.id);
    setEditedContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditedCommentId(null);
    setEditedContent("");
  };

  const handleSaveEdit = async (commentId) => {
    try {
      const res = await axios.put("/editComment.php", {
        comment_id: commentId,
        post_id: id,
        content: editedContent,
      });

      setComments(res.data.data);

      setEditedCommentId(null);
      setEditedContent("");
    } catch (err) {
      setError(
        "Edit Comment: " + err.response?.data?.error,
        err.response?.status
      );
      navigate("/error");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axios.delete("/deleteComment.php", {
        data: {
          comment_id: commentId,
          post_id: id,
        },
      });

      setComments(res.data.data);
    } catch (err) {
      setError(
        "Delete Comment: " + err.response?.data?.error,
        err.response?.status
      );
      navigate("/error");
    }
  };

  const handleNewCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleNewCommentSubmit = async (e) => {
    e.preventDefault();

    if (user) {
      try {
        const res = await axios.post("/addComment.php", {
          post_id: id,
          content: newComment,
        });

        setComments(res.data.data);
        setNewComment("");
      } catch (err) {
        setError(
          "NewComment Submit: " + err.response?.data?.error,
          err.response?.status
        );
        navigate("/error");
      }
    }
  };

  const handleToggleFavourite = async () => {
    try {
      if (isFavourite) {
        const res = await axios.delete(`/removeFavourite.php`, {
          data: { post_id: id },
        });

        if (res.data.success) {
          setIsFavourite(false);
        }
      } else {
        const res = await axios.post(`/addFavourite.php`, {
          post_id: id,
        });

        if (res.data.success) {
          setIsFavourite(true);
        }
      }
    } catch (err) {
      setError(
        "ToggleFavourite: " + err.response?.data?.error,
        err.response?.status
      );
      navigate("/error");
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`/deletePost.php?id=${id}`);

      const fileName = post.image.split("/").pop();
      await axios.delete(`/deleteImage.php?filename=${fileName}`);

      deletePost(id);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        "DeletePost: " + err.response?.data?.error,
        err.response?.status
      );
      navigate("/error");
    }
  };

  return (
    <>
      {post && (
        <div className="max-w-3xl mx-auto my-10 bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover rounded-t-md mb-4"
          />
          <div className="p-6">
            <h1 className="text-2xl font-bold text-blue-700 mb-2">
              {post.title}
            </h1>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">by {post.username}</p>

              {user && (
                <button
                  onClick={handleToggleFavourite}
                  className="flex items-center gap-1 cursor-pointer text-gray-500 hover:text-yellow-500 transition-colors"
                >
                  {isFavourite ? (
                    <Star className="text-yellow-500" fontSize="small" />
                  ) : (
                    <StarBorder className="text-yellow-500" fontSize="small" />
                  )}
                  <span className="hidden sm:inline text-sm font-medium">
                    {isFavourite ? "Favourited" : "Favourite"}
                  </span>
                </button>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed">{post.content}</p>
          </div>
          {user && user?.id === post.user_id && (
            <div className="flex justify-between px-4 pb-4">
              <Button
                variant="outlined"
                size="small"
                sx={{ color: "#1976d2", borderColor: "#1976d2" }}
              >
                <Link to={`/posts/${id}/edit`}>Edit</Link>
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={{ color: "#d32f2f", borderColor: "#d32f2f" }}
                onClick={() => handleDeleteClick(post.id)}
              >
                Delete
              </Button>
            </div>
          )}

          <div className="px-6 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <ChatBubbleOutline className="text-blue-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Comments
              </h2>
            </div>

            {user && (
              <div className="flex items-center gap-2 mb-6">
                <AccountCircle className="text-gray-400" fontSize="large" />
                <form
                  onSubmit={handleNewCommentSubmit}
                  className="flex-1 flex items-center bg-gray-50 rounded-full px-4 py-2 shadow-sm border border-gray-200"
                >
                  <input
                    type="text"
                    value={newComment}
                    onChange={handleNewCommentChange}
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent outline-none text-sm sm:text-base text-gray-700"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-colors"
                    onClick={handleNewCommentSubmit}
                  >
                    <Send fontSize="small" />
                    <span className="hidden sm:inline text-sm">Post</span>
                  </button>
                </form>
              </div>
            )}

            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm sm:text-base">
                No comments yet
              </p>
            ) : (
              <ul className="space-y-4">
                {comments.map((c) => {
                  const isEditing = editedCommentId === c.id;
                  return (
                    <li
                      key={c.id}
                      className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg shadow-sm"
                    >
                      <AccountCircle
                        className="text-gray-400"
                        fontSize="large"
                      />

                      <div className="flex-1">
                        <p className="text-sm sm:text-base font-semibold text-gray-700">
                          {c.username}
                        </p>

                        {isEditing ? (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                            <input
                              type="text"
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSaveEdit(c.id);
                                }
                              }}
                              className="flex-1 px-3 py-1 text-sm sm:text-base border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex gap-2">
                              <IconButton
                                size="small"
                                onClick={() => handleSaveEdit(c.id)}
                                className="cursor-pointer"
                              >
                                <Check
                                  className="text-green-600"
                                  fontSize="small"
                                />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={handleCancelEdit}
                                className="cursor-pointer"
                              >
                                <Close
                                  className="text-gray-500"
                                  fontSize="small"
                                />
                              </IconButton>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-1">
                            {c.content}
                          </p>
                        )}
                      </div>

                      {user && user.id === c.user_id && !isEditing && (
                        <div className="flex items-center gap-2 ml-2">
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(c)}
                            className="cursor-pointer"
                          >
                            <Edit className="text-blue-600" fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteComment(c.id)}
                            className="cursor-pointer"
                          >
                            <DeleteOutline
                              className="text-red-600"
                              fontSize="small"
                            />
                          </IconButton>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default PostDetails;

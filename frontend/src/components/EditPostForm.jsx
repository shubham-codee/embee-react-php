import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router";
import usePostStore from "../stores/postStore";
import useErrorStore from "../stores/errorStore";

function EditPostForm() {
  const navigate = useNavigate();

  const setError = useErrorStore((state) => state.setError);

  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    content: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);

  const updatePost = usePostStore((state) => state.updatePost);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/getPostById.php?id=${id}`);
        setFormData(res.data.data);
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

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setImageChanged(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let updatedPostData = { ...formData };

      if (imageChanged) {
        const fileName = formData.image.split("/").pop();
        await axios.delete(`/deleteImage.php?filename=${fileName}`);

        const imageData = new FormData();
        imageData.append("file", imageFile);
        const res = await axios.post("/uploadImage.php", imageData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        updatedPostData.image = res.data.url;
      }

      await axios.put(`/editPost.php?id=${id}`, updatedPostData);
      updatePost(updatedPostData);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        "EditPostForm: " + err.response?.data?.error,
        err.response?.status
      );
      navigate("/error");
    }
  };

  return (
    <>
      {formData && (
        <div className="max-w-7xl mx-auto mt-3 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-[#1976d2] mb-4">
            Edit Blog Post
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#1976d2] mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1976d2]"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#1976d2] mb-1">
                Image
              </label>
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Current Post Image"
                  className="w-48 h-32 object-cover my-2 rounded-md border"
                />
              )}
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1976d2]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1976d2] mb-1">
                Content
              </label>
              <textarea
                name="content"
                rows="6"
                value={formData.content}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1976d2]"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-[#1976d2] text-white px-6 py-2 rounded-md hover:bg-[#115293] transition cursor-pointer"
            >
              Edit Post
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default EditPostForm;

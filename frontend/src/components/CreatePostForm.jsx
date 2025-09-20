import React, { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router";
import usePostStore from "../stores/postStore";
import useErrorStore from "../stores/errorStore";
import { fileSchema, postSchema } from "../validations/postSchema";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function CreatePostForm() {
  const navigate = useNavigate();

  const setError = useErrorStore((state) => state.setError);

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    content: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const addPosts = usePostStore((state) => state.addPost);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadImage = async () => {
    const imageData = new FormData();
    imageData.append("file", imageFile);

    const res = await axios.post("/uploadImage.php", imageData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = "";

    try {
      const formResult = postSchema.safeParse(formData);

      if (!formResult.success) {
        const errors = {};
        formResult.error.issues.forEach((err) => {
          errors[err.path[0]] = err.message;
        });

        setValidationErrors(errors);
        return;
      }

      const fileResult = fileSchema.safeParse(imageFile);

      if (!fileResult.success) {
        const errors = {};
        fileResult.error.issues.forEach((err) => {
          errors["file"] = err.message;
        });

        setValidationErrors((prev) => ({ ...prev, ...errors }));
        return;
      }

      imageUrl = await uploadImage();

      const postData = {
        ...formData,
        image: imageUrl,
      };

      await axios.post("/addPost.php", postData);
      addPosts(postData);
      navigate("/", { replace: true });
    } catch (err) {
      const fileName = imageUrl?.split("/").pop();

      try {
        await axios.delete(`/deleteImage.php?filename=${fileName}`);
      } catch (deleteError) {
        console.error("Failed to delete image:", deleteError);
      }

      setError(
        "CreatePostForm: " + err.response?.data?.error,
        err.response?.status
      );
      navigate("/error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-3 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-[#1976d2] mb-4">
        Create Blog Post
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1976d2] mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1976d2]"
          />
          {validationErrors.title && (
            <p className="flex items-center text-sm text-red-500 mt-1">
              <ErrorOutlineIcon className="mr-1 text-base" />
              {validationErrors.title}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1976d2] mb-1">
            Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1976d2]"
          />
          {validationErrors.file && (
            <p className="flex items-center text-sm text-red-500 mt-1">
              <ErrorOutlineIcon className="mr-1 text-base" />
              {validationErrors.file}
            </p>
          )}
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
          ></textarea>
          {validationErrors.content && (
            <p className="flex items-center text-sm text-red-500 mt-1">
              <ErrorOutlineIcon className="mr-1 text-base" />
              {validationErrors.content}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-[#1976d2] text-white px-6 py-2 rounded-md hover:bg-[#115293] transition cursor-pointer"
        >
          Publish Post
        </button>
      </form>
    </div>
  );
}

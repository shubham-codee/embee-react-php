import React, { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router";
import useDraftStore from "../stores/draftStore";
import useErrorStore from "../stores/errorStore";
import { fileSchema, postSchema } from "../validations/postSchema";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ImageIcon from "@mui/icons-material/Image";
import ArticleIcon from "@mui/icons-material/Article";

export default function CreateDraftForm() {
  const navigate = useNavigate();
  const setError = useErrorStore((state) => state.setError);

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    content: "",
    status: "draft",
  });
  const [imageFile, setImageFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const setDrafts = useDraftStore((state) => state.setDrafts);

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
      headers: { "Content-Type": "multipart/form-data" },
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

      const draftData = {
        ...formData,
        image: imageUrl,
      };

      const res = await axios.post("/addDraft.php", draftData);
      setDrafts(res.data.data);
      navigate("/drafts", { replace: true });
    } catch (err) {
      const fileName = imageUrl?.split("/").pop();
      try {
        await axios.delete(`/deleteImage.php?filename=${fileName}`);
      } catch (deleteError) {
        console.error("Failed to delete image:", deleteError);
      }

      setError(
        "CreateDraftForm: " + err.response?.data?.error,
        err.response?.status
      );
      navigate("/error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4 py-8 rounded-2xl shadow-lg bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-[#1976d2] mb-6 flex items-center gap-2">
        <ArticleIcon fontSize="large" className="text-[#1976d2]" />
        New Draft
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center text-sm md:text-base font-medium text-gray-700 mb-2">
            <DriveFileRenameOutlineIcon className="mr-2 text-[#1976d2]" />
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a catchy draft title..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1976d2] cursor-text text-sm md:text-base"
          />
          {validationErrors.title && (
            <p className="flex items-center text-sm text-red-500 mt-1">
              <ErrorOutlineIcon className="mr-1 text-base" />
              {validationErrors.title}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-center text-sm md:text-base font-medium text-gray-700 mb-2">
            <ImageIcon className="mr-2 text-[#1976d2]" />
            Upload Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1976d2] cursor-pointer text-sm md:text-base"
          />
          {validationErrors.file && (
            <p className="flex items-center text-sm text-red-500 mt-1">
              <ErrorOutlineIcon className="mr-1 text-base" />
              {validationErrors.file}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-center text-sm md:text-base font-medium text-gray-700 mb-2">
            <ArticleIcon className="mr-2 text-[#1976d2]" />
            Content
          </label>
          <textarea
            name="content"
            rows="6"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your draft content here..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] cursor-text text-sm md:text-base"
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
          className="w-full md:w-auto bg-[#1976d2] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#115293] transition shadow-md cursor-pointer text-sm md:text-base"
        >
          Save Draft
        </button>
      </form>
    </div>
  );
}

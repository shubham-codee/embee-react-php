import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate, useParams, Link } from "react-router";
import useDraftStore from "../stores/draftStore";
import useErrorStore from "../stores/errorStore";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TitleOutlinedIcon from "@mui/icons-material/TitleOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

export default function EditDraftPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const setError = useErrorStore((s) => s.setError);

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    content: "",
    status: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);

  const setDrafts = useDraftStore((s) => s.setDrafts);

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const res = await axios.get("/getDraftById.php", { params: { id } });
        setFormData(res.data.data);
      } catch (err) {
        setError(
          "EditDraftForm: " + err.response?.data?.error,
          err.response?.status
        );
        navigate("/error");
      }
    };

    fetchDraft();
  }, [id]);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setImageChanged(true);
  };

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let updatedDraftData = { ...formData };

      if (imageChanged) {
        const fileName = formData.image.split("/").pop();
        await axios.delete(`/deleteImage.php?filename=${fileName}`);

        const imageData = new FormData();
        imageData.append("file", imageFile);
        const res = await axios.post("/uploadImage.php", imageData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        updatedDraftData.image = res.data.url;
      }

      const res = await axios.put(`/editDraft.php?id=${id}`, updatedDraftData);
      setDrafts(res.data.data);
      navigate("/drafts", { replace: true });
    } catch (err) {
      setError(
        "EditDraftForm: " + err.response?.data?.error,
        err.response?.status
      );
      navigate("/error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer"
            aria-label="Back"
          >
            <ArrowBackIcon fontSize="small" />
            <span className="text-sm sm:text-base font-medium">Back</span>
          </button>

          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 ml-2">
            Edit Draft
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/drafts/${id}`}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 cursor-pointer text-sm"
            aria-label="View draft"
          >
            <VisibilityOutlinedIcon fontSize="small" />
            <span className="hidden sm:inline">Preview</span>
          </Link>

          <button
            onClick={() => navigate("/drafts")}
            className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <TitleOutlinedIcon
              className="text-[#1976d2] sm:mr-2"
              fontSize="medium"
            />
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="A good headline helps — keep it short"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1976d2] text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label className="text-sm font-medium text-[#1976d2]">
              <ImageOutlinedIcon /> Cover Image
            </label>

            {formData.image && (
              <img
                src={formData.image}
                alt="Current Cover"
                className="w-48 h-32 object-cover rounded-md border my-2"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1976d2] cursor-pointer text-sm sm:text-base"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <NotesOutlinedIcon className="text-[#1976d2]" />
              <span className="text-sm font-medium text-gray-700">Content</span>
            </div>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              required
              placeholder="Write the body of your draft... paragraph breaks will be preserved"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1976d2] text-sm sm:text-base resize-vertical"
            />
          </div>

          {/* Action row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(`/drafts/${id}`)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
              >
                <VisibilityOutlinedIcon fontSize="small" />
                <span className="hidden sm:inline">Preview</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 bg-[#1976d2] text-white px-5 py-2 rounded-lg hover:bg-[#115293] transition cursor-pointer text-sm sm:text-base"
              >
                <SaveOutlinedIcon fontSize="small" />
                <span>Save Draft</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

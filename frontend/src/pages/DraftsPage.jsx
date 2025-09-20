import { useEffect, useState } from "react";
import DraftCard from "../components/DraftCard";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router";
import useErrorStore from "../stores/errorStore";
import useDraftStore from "../stores/draftStore";

import { Link } from "react-router";
import { Button, Fab } from "@mui/material";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

export default function DraftsPage() {
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { drafts, setDrafts } = useDraftStore();
  const setError = useErrorStore((state) => state.setError);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const res = await axios.get("/getDrafts.php");
        if (res.data.success) {
          setDrafts(res.data.data);
        }
      } catch (err) {
        setError(
          "DraftsPage: " + err.response?.data?.error,
          err.response?.status
        );
        navigate("/error");
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading drafts...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1976d2]">
          Your Drafts
        </h1>

        <Button
          variant="contained"
          color="primary"
          size="medium"
          component={Link}
          to="/drafts/new"
          startIcon={<NoteAddOutlinedIcon />}
          className="cursor-pointer hidden sm:inline-flex"
        >
          New Draft
        </Button>
      </div>

      <p className="text-gray-600 text-sm sm:text-base">
        {drafts.length === 0
          ? "No drafts yet"
          : `${drafts.length} draft${drafts.length > 1 ? "s" : ""}`}
      </p>

      {drafts.length === 0 ? (
        <div className="mt-1 rounded-xl border border-gray-200 bg-gray-50 p-6 flex flex-col items-center justify-center text-center">
          <DescriptionOutlinedIcon
            className="text-gray-400 mb-2"
            fontSize="large"
          />
          <p className="text-gray-600 text-sm sm:text-base mb-3">
            You haven’t saved any drafts yet.
          </p>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/drafts/new"
            startIcon={<NoteAddOutlinedIcon />}
            className="cursor-pointer"
          >
            Create your first draft
          </Button>
        </div>
      ) : (
        drafts.map((draft) => <DraftCard key={draft.id} draft={draft} />)
      )}
    </div>
  );
}

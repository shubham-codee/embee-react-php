import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import axios from "../api/axiosInstance";
import {
  ArrowBack,
  ArticleOutlined,
  DeleteOutline,
  EditOutlined,
  PublishOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  Chip,
  Skeleton,
  IconButton,
  Tooltip,
} from "@mui/material";
import useErrorStore from "../stores/errorStore";
import useDraftStore from "../stores/draftStore";
import usePostStore from "../stores/postStore";

export default function DraftDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);

  const { setDrafts } = useDraftStore();
  const setPosts = usePostStore((state) => state.setPosts);
  const setError = useErrorStore((state) => state.setError);

  useEffect(() => {
    async function fetchDraftById() {
      try {
        const res = await axios.get("/getDraftById.php", { params: { id } });
        setDraft(res.data?.data);
      } catch (e) {
        setError(
          "DraftDetailsPage: " + err.response?.data?.error,
          err.response?.status
        );
        navigate("/error");
      } finally {
        setLoading(false);
      }
    }

    fetchDraftById();
  }, [id]);

  const handleDeleteClick = async (id) => {
    try {
      const res = await axios.delete(`/deleteDraft.php?id=${id}`);

      const fileName = draft.image.split("/").pop();
      await axios.delete(`/deleteImage.php?filename=${fileName}`);

      setDrafts(res.data.data);
      navigate("/drafts", { replace: true });
    } catch (err) {
      setError(
        "DeleteDraft: " + err.response?.data?.error,
        err.response?.status
      );
      navigate("/error");
    }
  };

  const handlePublishClick = async (id) => {
    try {
      const res = await axios.post(`/publishDraft.php?id=${id}`);

      setPosts(res.data.data);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        "PublishDraft: " + err.response?.data?.error,
        err.response?.status
      );
      navigate("/error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer"
          aria-label="Go back"
        >
          <ArrowBack fontSize="small" />
          <span className="text-sm sm:text-base font-medium">Back</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-gray-500">
          <VisibilityOutlined fontSize="small" />
          <span className="text-sm">Draft preview</span>
        </div>
      </div>

      <Card className="rounded-2xl shadow-md">
        {loading ? (
          <CardContent className="flex flex-col gap-4">
            <Skeleton
              variant="rectangular"
              height={220}
              className="rounded-xl"
            />
            <Skeleton variant="text" height={32} />
            <Skeleton variant="text" height={24} />
            <Skeleton variant="text" height={24} />
          </CardContent>
        ) : !draft ? (
          <CardContent className="py-16 text-center">
            <p className="text-gray-600">Draft not found.</p>
            <Link
              to="/drafts"
              className="inline-block mt-3 text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Back to drafts
            </Link>
          </CardContent>
        ) : (
          <>
            <div className="w-full">
              {draft.image ? (
                <img
                  src={draft.image}
                  alt={draft.title}
                  className="w-full h-56 sm:h-72 md:h-80 object-cover rounded-t-2xl"
                />
              ) : (
                <div className="w-full h-56 sm:h-72 md:h-80 flex items-center justify-center bg-gray-100 rounded-t-2xl">
                  <ArticleOutlined className="text-gray-400" fontSize="large" />
                </div>
              )}
            </div>

            <CardContent className="flex flex-col gap-4">
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {draft.title}
                  </h1>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Chip
                    label={draft.status}
                    size="small"
                    color={draft.status === "draft" ? "default" : "success"}
                    className="!rounded-full"
                  />
                  <Tooltip title="Edit draft">
                    <IconButton
                      className="cursor-pointer"
                      component={Link}
                      to={`/drafts/${draft.id}/edit`}
                    >
                      <EditOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Publish">
                    <IconButton
                      className="cursor-pointer"
                      onClick={() => {
                        handlePublishClick(draft.id);
                      }}
                    >
                      <PublishOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete draft">
                    <IconButton
                      className="cursor-pointer"
                      onClick={() => {
                        handleDeleteClick(draft.id);
                      }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {draft.content}
                </p>
              </div>

              <div className="flex items-center justify-end pt-2">
                <Link
                  to="/drafts"
                  className="text-blue-600 hover:text-blue-700 text-sm sm:text-base font-medium cursor-pointer"
                >
                  Back to drafts
                </Link>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}

import {
  Card,
  CardContent,
  CardActionArea,
  Chip,
  IconButton,
} from "@mui/material";
import {
  ArticleOutlined,
  EditOutlined,
  VisibilityOutlined,
  DeleteOutline,
} from "@mui/icons-material";

import { Link, useNavigate } from "react-router";
import useDraftStore from "../stores/draftStore";
import useErrorStore from "../stores/errorStore";
import axios from "../api/axiosInstance";

export default function DraftCard({ draft }) {
  const navigate = useNavigate();

  const { setDrafts } = useDraftStore();
  const setError = useErrorStore((state) => state.setError);

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

  return (
    <Card className="rounded-xl shadow-md hover:shadow-lg transition w-full">
      <CardContent className="flex items-start justify-between gap-4">
        <CardActionArea
          component={Link}
          to={`/drafts/${draft.id}`}
          className="flex items-start gap-4 p-2 -m-2 rounded-lg"
        >
          {draft.image ? (
            <img
              src={draft.image}
              alt={draft.title}
              className="w-16 h-16 rounded-md object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md">
              <ArticleOutlined className="text-gray-500 text-3xl" />
            </div>
          )}

          <div className="flex-1 flex flex-col gap-1 text-left">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              {draft.title}
            </h2>
            <Chip
              label={draft.status}
              size="small"
              color={draft.status === "draft" ? "default" : "success"}
              className="w-fit"
            />
            <p className="text-sm text-gray-600 line-clamp-2">
              {draft.content}
            </p>
          </div>
        </CardActionArea>

        <div className="flex gap-1 sm:gap-2 ml-2">
          <IconButton
            size="small"
            className="cursor-pointer"
            component={Link}
            to={`/drafts/${draft.id}/edit`}
          >
            <EditOutlined fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            className="cursor-pointer"
            component={Link}
            to={`/drafts/${draft.id}`}
          >
            <VisibilityOutlined fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            className="cursor-pointer"
            onClick={() => {
              handleDeleteClick(draft.id);
            }}
          >
            <DeleteOutline fontSize="small" />
          </IconButton>
        </div>
      </CardContent>
    </Card>
  );
}

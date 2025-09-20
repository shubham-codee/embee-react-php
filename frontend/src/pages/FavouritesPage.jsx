import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { SentimentDissatisfied } from "@mui/icons-material";

import FavouriteItem from "../components/FavouriteItem";
import axios from "../api/axiosInstance";
import useErrorStore from "../stores/errorStore";

function FavouritesPage() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const setError = useErrorStore((state) => state.setError);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await axios.get("/getFavourites.php");
        setFavourites(res.data.data);
      } catch (err) {
        setError(
          "FavouritesPage: " + err.response?.data?.error,
          err.response?.status
        );
        navigate("/error");
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading favourites...</p>
      </div>
    );
  }

  if (favourites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <SentimentDissatisfied className="text-gray-400" fontSize="large" />
        <p className="mt-2 text-gray-600 text-lg">
          You don’t have any favourite posts yet.
        </p>
        <Link
          to="/"
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
        >
          Browse Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Your Favourites
      </h1>
      <div className="flex flex-col gap-3">
        {favourites.map((fav) => (
          <Link to={`/posts/${fav.id}`} key={fav.id}>
            <FavouriteItem favourite={fav} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default FavouritesPage;

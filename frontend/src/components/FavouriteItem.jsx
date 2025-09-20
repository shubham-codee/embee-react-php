import { StarBorder } from "@mui/icons-material";

function FavouriteItem({ favourite }) {
  return (
    <div className="flex items-center justify-between w-full max-w-2xl bg-white shadow-md rounded-xl px-4 py-3 hover:shadow-lg transition cursor-pointer">
      <div className="flex items-center gap-3">
        <StarBorder className="text-yellow-500" />
        <span className="text-gray-800 font-medium text-base sm:text-lg">
          {favourite.title}
        </span>
      </div>
    </div>
  );
}

export default FavouriteItem;

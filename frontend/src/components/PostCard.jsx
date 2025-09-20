export default function PostCard({ post }) {
  return (
    <div className="bg-white max-w-sm rounded-xl shadow-md border border-gray-200 overflow-hidden transition hover:shadow-lg hover:scale-[1.02] duration-200">
      <div className="overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full object-cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-blue-700 hover:underline">
          {post.title}
        </h2>
      </div>
    </div>
  );
}

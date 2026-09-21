import Link from "next/link";

export default function PostSummary({ post }: any) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
        <span className="text-gray-300">•</span>
        <span className="text-[10px] font-bold text-brand-secondary uppercase">
          Verified Update
        </span>
      </div>
      <Link
        href={`/legislative-office/post/${post.id}`}
        className="font-bold text-gray-900 hover:text-brand-primary block text-lg font-playfair leading-tight mb-2"
      >
        {post.title}
      </Link>
      <p className="text-sm text-gray-600 line-clamp-2">
        {post.content.replace(/<[^>]*>?/gm, "")}
      </p>
    </div>
  );
}

import Link from "next/link";
import { FaLandmark, FaFileAlt, FaFlag } from "react-icons/fa";
import ShareButtons from "@/components/common/ShareButtons";

export default function PostCard({ post, office, onReport }: any) {
  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
            {office.officeImageUrl ? (
              <img
                src={office.officeImageUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaLandmark className="text-gray-400 m-auto mt-2" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">
              {office.representativeName}
            </h4>
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <Link
          href={`/legislative-office/post/${post.id}`}
          className="group block"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-3 font-playfair group-hover:text-brand-primary transition-colors">
            {post.title}
          </h3>
          <div
            className="prose prose-stone max-w-none text-gray-600 text-sm mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Link>

        {post.documents && post.documents.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.documents.map((doc: string, i: number) => (
              <a
                key={i}
                href={doc}
                target="_blank"
                className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded text-xs font-bold text-icon-on-light flex items-center gap-2"
              >
                <FaFileAlt /> Attachment {i + 1}
              </a>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            href={`/legislative-office/post/${post.id}`}
            className="text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-brand-primary"
          >
            Read Full Update ↗
          </Link>
          <div className="flex gap-3">
            <button
              onClick={() => onReport(post.id)}
              className="text-gray-400 hover:text-red-500"
            >
              <FaFlag />
            </button>
            <ShareButtons
              url={`/legislative-office/post/${post.id}`}
              title={post.title}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

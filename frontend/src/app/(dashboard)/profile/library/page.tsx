"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { FaBookOpen, FaSpinner, FaArrowLeft } from "react-icons/fa6";
import DynamicBookCover from "@/components/common/DynamicBookCover";

interface Publication {
  id: string;
  title: string;
  subtitle: string;
  imagePath: string;
  slug: string;
  purchaseDate: string;
  author?: string;
  category?: string;
  isbn?: string;
  isbnStatus?: string;
  edition?: string;
  publisher?: string;
  tableOfContents?: string[];
  features?: any;
}

export default function MyLibraryPage() {
  const [books, setBooks] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const { data } = await api.get("/publications/my-library");
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch library", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner data-ui-icon  className="animate-spin text-3xl " />
      </div>
    );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center gap-4">
        <Link
          href="/profile"
          className="text-stone-400 hover:text-stone-600 transition-colors"
        >
          <FaArrowLeft />
        </Link>
        <div>
          <h1 className="text-3xl font-playfair font-bold text-stone-900">
            My Library
          </h1>
          <p className="text-stone-600 mt-1">
            Access your saved and bookmarked research resources.
          </p>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 text-3xl">
            <FaBookOpen />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-2">
            Library is Empty
          </h3>
          <p className="text-stone-500 max-w-md mx-auto mb-8">
            Start bookmarking research publications, best practices, and eBooks to build your personal library list here.
          </p>
          <Link
            href="/publications"
            className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-brand-dark transition-colors inline-block"
          >
            Browse Publications
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
          {books.map((book) => (
            <div
              key={book.id}
              className="group w-48 bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                <DynamicBookCover
                  title={book.title}
                  subtitle={book.subtitle || ""}
                  author={book.author || ""}
                  category={book.category}
                  size="sm"
                  className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                  isbn={book.isbn}
                  isbnStatus={book.isbnStatus}
                  edition={book.edition}
                  publisher={book.publisher}
                  summaryPoints={book.tableOfContents || (Array.isArray(book.features) ? book.features : undefined)}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <Link
                    href={`/publications/read/${book.slug}`}
                    className="bg-white text-brand-dark px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    Read Now
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-brand-dark mb-1 line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">
                  {book.subtitle}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-100 pt-4">
                  <span>
                    Saved:{" "}
                    {new Date(book.purchaseDate).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/publications/reader/${book.slug}`}
                    className="text-brand-primary font-bold uppercase tracking-wider hover:text-brand-dark"
                  >
                    Read &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

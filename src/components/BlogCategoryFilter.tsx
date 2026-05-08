"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/blog-types";
import { CATEGORIES } from "@/lib/blog-types";

interface BlogCategoryFilterProps {
  posts: BlogPost[];
}

export function BlogCategoryFilter({ posts }: BlogCategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPosts =
    activeCategory === "all"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Category pills */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeCategory === cat.key
                ? "bg-cz-red text-white shadow-md"
                : "bg-white text-cz-blue border border-gray-200 hover:border-cz-red hover:text-cz-red"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Posts grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute top-4 left-4">
                <span className="inline-block bg-cz-red text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {post.categoryName}
                </span>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-3 text-xs text-cz-gray-light mb-3">
                <time dateTime={post.date}>{post.dateFormatted}</time>
                <span className="w-1 h-1 rounded-full bg-cz-gray-light" />
                <span>{post.readTime} min</span>
              </div>

              <h3 className="text-lg font-bold text-cz-blue leading-snug mb-3 group-hover:text-cz-red transition-colors duration-300">
                {post.title}
              </h3>

              <p className="text-sm text-cz-gray-light leading-relaxed flex-1">
                {post.excerpt}
              </p>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm font-semibold text-cz-red group-hover:underline">
                  {"Pokračovat ve čtení →"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-cz-gray-light text-lg">
            {"V této kategorii zatím nejsou žádné články."}
          </p>
        </div>
      )}
    </>
  );
}

import fs from "fs";
import path from "path";

export type { BlogPost } from "./blog-types";
export { CATEGORIES } from "./blog-types";

import type { BlogPost } from "./blog-types";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");
const POSTS_JSON = path.join(POSTS_DIR, "posts.json");

export function getAllPosts(): BlogPost[] {
  try {
    const data = JSON.parse(fs.readFileSync(POSTS_JSON, "utf-8"));
    const posts: BlogPost[] = (data.posts || []).map((p: BlogPost) => ({
      ...p,
      id: p.id || p.slug,
    }));
    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch {
    return [];
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug || p.id === slug) || null;
}

export function getPostContent(slug: string): string | null {
  const htmlPath = path.join(POSTS_DIR, `${slug}.html`);
  try {
    return fs.readFileSync(htmlPath, "utf-8");
  } catch {
    return null;
  }
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === "all") return getAllPosts();
  return getAllPosts().filter((p) => p.category === category);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const post = getPostBySlug(slug);
  if (!post) return [];
  return getAllPosts()
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, limit);
}


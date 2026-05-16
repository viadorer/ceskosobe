import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  getAllPosts,
  getPostBySlug,
  getPostContent,
  getRelatedPosts,
} from "@/lib/blog";
import { TrikoloraCentered } from "@/components/Trikolora";
import { ShareButtons } from "./ShareButtons";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Článek nenalezen" };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.image, alt: post.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const content = getPostContent(slug);

  if (!post || !content) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, 3);

  return (
    <article className="bg-cz-bg min-h-screen">
      {/* Hero */}
      <div className="bg-cz-blue text-white pt-32 pb-12">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors mb-8"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {"Zpět na blog"}
          </Link>

          <div className="flex items-center gap-3 text-sm text-gray-300 mb-4">
            <span className="inline-block bg-cz-red text-white text-xs font-semibold px-3 py-1 rounded-full">
              {post.categoryName}
            </span>
            <time dateTime={post.date}>{post.dateFormatted}</time>
            <span className="w-1 h-1 rounded-full bg-gray-400" />
            <span>{post.readTime} min</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Cover image */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 -mt-6">
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        <div
          className="prose prose-lg max-w-none text-cz-gray"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm font-semibold text-cz-blue mb-4">
            {"Sdílet článek"}
          </p>
          <ShareButtons title={post.title} slug={post.slug} />
        </div>
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-white py-16">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-10">
              <TrikoloraCentered />
              <h2 className="text-2xl font-bold text-cz-blue mt-4">
                {"Související články"}
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group bg-cz-bg rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={related.image}
                      alt={related.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-cz-gray-light mb-2">
                      <time dateTime={related.date}>
                        {related.dateFormatted}
                      </time>
                      <span className="w-1 h-1 rounded-full bg-cz-gray-light" />
                      <span>{related.readTime} min</span>
                    </div>
                    <h3 className="text-base font-bold text-cz-blue leading-snug group-hover:text-cz-red transition-colors">
                      {related.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-cz-blue py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <TrikoloraCentered />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-6 mb-4">
            {"Zajistěte si důstojné stáří"}
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">
            {"Přidejte se ke komunitě lidí, kteří se rozhodli být aktivní. Získejte přístup k faktům, číslům a zkušenostem."}
          </p>
          <Link
            href="/#signup-form"
            className="inline-block bg-cz-red hover:bg-cz-red-dark text-white font-bold px-8 py-4 rounded-xl transition-colors duration-300 shadow-lg"
          >
            {"Chci se zapojit"}
          </Link>
        </div>
      </div>
    </article>
  );
}

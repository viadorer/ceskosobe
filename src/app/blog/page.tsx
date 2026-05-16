import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { TrikoloraCentered } from "@/components/Trikolora";
import { BlogCategoryFilter } from "@/components/BlogCategoryFilter";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Články o finanční gramotnosti, investicích do nemovitostí a zajištění na stáří. Praktické rady a zkušenosti komunity Česko Sobě.",
  openGraph: {
    title: "Blog | Česko Sobě",
    description:
      "Články o finanční gramotnosti, investicích do nemovitostí a zajištění na stáří.",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <section className="bg-cz-bg min-h-screen">
      {/* Hero */}
      <div className="bg-cz-blue text-white pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <TrikoloraCentered />
          <h1 className="text-4xl md:text-5xl font-extrabold mt-6 mb-4 tracking-tight">
            Blog
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Praktické články o finanční gramotnosti, investicích do nemovitostí
            a zajištění na stáří. Fakta, čísla a zkušenosti komunity.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
        <BlogCategoryFilter posts={posts} />
      </div>
    </section>
  );
}

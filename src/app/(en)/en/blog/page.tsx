import type { Metadata } from "next";
import BlogIndexRoute from "@/components/features/blog/BlogIndexRoute";
import { BLOG_HEADING, BLOG_INTRO, POSTS } from "@/lib/content/blog";
import { pageMetadata } from "@/lib/seo";

/** `/en/blog`. See `src/app/(en)/en/page.tsx` for why this file exists. */
export const metadata: Metadata = {
  ...pageMetadata({
    path: "/blog",
    title: BLOG_HEADING,
    description: BLOG_INTRO,
    locale: "en",
  }),
  ...(POSTS.length === 0 ? { robots: { index: false, follow: true } } : {}),
};

export default async function BlogPageEn({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string | string[] }>;
}) {
  const { topic } = await searchParams;
  return <BlogIndexRoute locale="en" topic={typeof topic === "string" ? topic : undefined} />;
}

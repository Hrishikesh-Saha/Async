import LoadingBlogsSkeleton from "@/components/skeletons/loadingBlogsSkeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Blogs | Explore other peoples thoughts and enrich your knowledge ",
  description:
    "A multi-topic blog covering ideas, learning, creativity, technology, and reflections on everyday life—written without limits.",
  authors: [{ name: "Hrishikesh Saha" }],
};

const BlogsPage = async () => {
  return (
    <div className="py-12  space-y-14">
      <div className="flex flex-col items-center justify-start space-y-2">
        <h1 className="text-4xl font-bold">All Blogs</h1>
        <p className="text-muted-foreground max-w-lg text-center">
          Explore thoughts from voices around the world.
        </p>
      </div>

      <Suspense fallback={<LoadingBlogsSkeleton />}>
        <LoadBlogs />
      </Suspense>
    </div>
  );
};

async function LoadBlogs() {
  // 'use cache'
  // cacheLife("hours")
  // cacheTag("blogs-list")
  await connection()
  const data = await fetchQuery(api.blogs.getBlogs);
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((blog) => (
        <Card key={blog._id} className="pt-0">
          <div className="w-full h-48 relative">
            <Image
              src={
                blog.imgUrl ??
                "https://swapithub.com/wp-content/uploads/2023/05/Behind-the-scenes-core-elements-of-web-development.jpg"
              }
              alt="missing"
              fill
              className="rounded-t-xl object-cover object-center"
            />
          </div>
          <CardContent className="space-y-4">
            <CardTitle className="hover:text-secondary transition-colors duration-200">
              <Link href={`/blogs/${blog._id}`}>{blog.title}</Link>
            </CardTitle>
            <CardDescription className="line-clamp-4">
              {blog.description}
            </CardDescription>
            <Link
              href={`/blogs/${blog._id}`}
              className={buttonVariants({ className: "w-full" })}
            >
              Read More
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default BlogsPage;

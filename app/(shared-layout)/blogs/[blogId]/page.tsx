import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BlogPresence from "@/components/web/blogPresence";
import CommentSection from "@/components/web/commentSection";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";

import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ blogId: Id<"blogs"> }>;
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { blogId } = await params;
  const blog = await fetchQuery(api.blogs.getBlogById, { id: blogId });

  if (!blog) {
    return {
      title: "Blog not found",
      description: "Search for another blog",
    };
  }
  return {
    title: blog.title,
    description: blog.description,
  };
}

const page = async ({
  params,
}: {
  params: Promise<{ blogId: Id<"blogs"> }>;
}) => {
  const { blogId } = await params;

  const token = await getToken();

  const userId = await fetchQuery(api.auth.getUserId, {}, { token });

  if (!userId) {
    return redirect("/auth/sign-in");
  }

  const [blog, comments] = await Promise.all([
    fetchQuery(api.blogs.getBlogById, { id: blogId }),
    preloadQuery(api.comments.getCommentsByBlogId, { blogId: blogId }),
  ]);

  if (!blog) {
    return (
      <div>
        <h1 className="text-5xl">Blog not found</h1>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link
        href={"/blogs"}
        className={buttonVariants({ variant: "secondary" })}
      >
        <ArrowLeft className="size-4 " />
        Back to blogs
      </Link>

      <div className="relative w-full h-110 overflow-hidden shadow-sm rounded-xl mt-4 mb-8">
        <Image
          src={blog.blogImg ?? ""}
          alt="missing"
          fill
          className="object-cover object-center hover:scale-105 duration-500"
        />
      </div>

      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {blog.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Posted on: {new Date(blog._creationTime).toLocaleDateString()}
        </p>
        {userId && <BlogPresence roomId={blog._id} userId={userId} />}
      </div>

      <Separator className="my-8" />

      <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {blog.description}
      </p>
      <Separator className="my-8" />

      <CommentSection preloadedComments={comments} />
    </div>
  );
};

export default page;

"use server";

import z from "zod";
import { blogSchema } from "./schema/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { revalidatePath, updateTag } from "next/cache";

export const createBlogAction = async (data: z.infer<typeof blogSchema>) => {
  const parsed = blogSchema.safeParse(data);

  if (!parsed.success) throw new Error("Invalid data");

  const token = await getToken();

  try {
    const imageUploadUrl = await fetchMutation(
      api.blogs.getImageUploadUrl,
      {},
      { token }
    );
    const res = await fetch(imageUploadUrl, {
      method: "POST",
      headers: {
        "Content-type": data.image.type,
      },
      body: data.image,
    });
    const { storageId } = await res.json();
    await fetchMutation(
      api.blogs.createBlog,
      {
        title: data.title,
        description: data.description,
        imageStorageId: storageId,
      },
      { token }
    );
  } catch (error) {
    console.log(
      "Error in createBlogAction: ",
      error instanceof Error ? error : "Unknown error"
    );
    throw new Error("Failed to create new blog");
  }

  updateTag("blogs-list");
};

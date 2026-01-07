import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { Doc, Id } from "./_generated/dataModel";

export const createBlog = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) throw new ConvexError("Authenticate kor bkl");

    const newBlog = await ctx.db.insert("blogs", {
      title: args.title,
      description: args.description,
      authorId: user._id,
      imageStorageId: args.imageStorageId,
    });

    return newBlog;
  },
});

export const getBlogs = query({
  handler: async (ctx) => {
    const blogs = await ctx.db.query("blogs").order("desc").collect();
    return await Promise.all(
      blogs.map(async (blog) => ({
        ...blog,
        imgUrl:
          blog.imageStorageId !== undefined
            ? await ctx.storage.getUrl(blog.imageStorageId)
            : null,
      }))
    );
  },
});

export const getImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) throw new Error("Unauthencated user");

    const imageUploadUrl = await ctx.storage.generateUploadUrl();

    return imageUploadUrl;
  },
});

export const getBlogById = query({
  args: {
    id: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get("blogs", args.id);
    if (!blog) return null;
    const blogImg =
      blog.imageStorageId !== undefined
        ? await ctx.storage.getUrl(blog.imageStorageId)
        : null;
    return { ...blog, blogImg };
  },
});

export const searchBlogs = query({
  args: {
    term: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const limit = args.limit;
    const result: Array<{
      _id: Id<"blogs">;
      title: string;
      description: string;
    }> = [];

    const seen = new Set<Id<"blogs">>();

    const pushDocs = async (docs: Array<Doc<"blogs">>) => {
      for (const doc of docs) {
        if (seen.has(doc._id)) continue;

        seen.add(doc._id);
        result.push({
          _id: doc._id,
          description: doc.description,
          title: doc.title,
        });

        if (result.length >= limit) break;
      }
    };

    const titleSearch = await ctx.db
      .query("blogs")
      .withSearchIndex("search_title", (q) => q.search("title", args.term))
      .take(limit);

    await pushDocs(titleSearch);

    if (result.length < limit) {
      const descriptionSearch = await ctx.db
        .query("blogs")
        .withSearchIndex("search_description", (q) =>
          q.search("description", args.term)
        )
        .take(limit);
      await pushDocs(descriptionSearch);
    }
    
    return result;
  },
});

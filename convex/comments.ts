import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getCommentsByBlogId = query({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_blogId", (q) => q.eq("blogId", args.blogId))
      .order("desc")
      .collect();
    return comments;
  },
});

export const createComment = mutation({
  args: {
    blogId: v.id("blogs"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Unauthenticated user");
    }

    return await ctx.db.insert("comments", {
      blogId: args.blogId,
      body: args.body,
      authorId: user._id,
      authorName: user.name,
    });
  },
});

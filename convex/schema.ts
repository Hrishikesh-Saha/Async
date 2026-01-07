import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  blogs: defineTable({
    title: v.string(),
    description: v.string(),
    authorId: v.string(),
    imageStorageId: v.id("_storage"),
  })
    .searchIndex("search_title", {
      searchField: "title",
    })
    .searchIndex("search_description", {
      searchField: "description",
    }),
  comments: defineTable({
    blogId: v.id("blogs"),
    authorId: v.string(),
    authorName: v.string(),
    body: v.string(),
  }).index("by_blogId", ["blogId"]),
});

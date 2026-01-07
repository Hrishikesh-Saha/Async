import { Id } from "@/convex/_generated/dataModel";
import z from "zod";

export const commentSchema = z.object({
  blogId: z.custom<Id<"blogs">>(),
  body: z.string().min(3),
});

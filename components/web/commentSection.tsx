"use client";
import  { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Divide, Loader2, MessageSquare } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/schema/comment";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import z from "zod";
import { toast } from "sonner";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

const CommentSection = ({
  preloadedComments,
}: {
  preloadedComments: Preloaded<typeof api.comments.getCommentsByBlogId>;
}) => {
  const comments = usePreloadedQuery(preloadedComments);
  const [isPending, startTransition] = useTransition();
  const params = useParams<{ blogId: Id<"blogs"> }>();
  const mutation = useMutation(api.comments.createComment);
  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: "",
      blogId: params.blogId,
    },
  });
  const onSubmit = (data: z.infer<typeof commentSchema>) => {
    startTransition(async () => {
      try {
        await mutation(data);
        toast.success("Successfully posted new comment");
        form.reset();
      } catch (error) {
        toast.error("Failed to post comment");
      }
    });
  };
  return (
    <Card>
      <CardHeader className="flex gap-2 border-b items-center">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">{comments.length} Comments</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={form.control}
            name="body"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="body">Write you comment</FieldLabel>
                <Textarea
                  id="body"
                  {...field}
                  placeholder="Type your comment..."
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button>
            {isPending ? (
              <>
                <Loader2 className="animate-spin size-4" />
                Loading...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </form>

        <Separator />

        {comments.length === 0 ? (
          <h1 className="text-center text-xl text-primary font-semibold">No comments yet. Be the first one</h1>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={"https://avatar.vercel.sh/rauchg"} />
                <AvatarFallback>
                  {comment.authorName.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
                <div className=" w-full">
                  <div className="flex justify-between w-full">
                    <h1>{comment.authorName}</h1>
                  <span className="text-muted-foreground">
                    {new Date(comment._creationTime).toLocaleDateString()}
                  </span>
                  </div>
                <p>{comment.body}</p>

              </div>

            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CommentSection;

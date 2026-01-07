"use client";

import { createBlogAction } from "@/app/actions";
import { blogSchema } from "@/app/schema/blog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const CreateBlogPage = () => {
  const [isPending, startTransition] = useTransition();
  const [img, setImg] = useState<string>("");

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = (data: z.infer<typeof blogSchema>) => {
    startTransition(async () => {
      try {
        await createBlogAction(data);
        form.reset();
        router.push("/blogs");
        toast.success("Create new blog successfully");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to create new blog"
        );
      }
    });
  };
  return (
    <div className="py-12 md:py-16 max-w-xl max-w mx-auto space-y-14">
      <div className="flex flex-col items-center justify-start space-y-2">
        <h1 className="text-4xl font-bold">Create New Blog</h1>
        <p className="text-muted-foreground max-w-lg text-center">
          Every thought has the power to inspire. Share yours with the world and
          make it better.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Blog Article</CardTitle>
          <CardDescription>
            Ideas change everything. Share yours with the world.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-y-4">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input id="title" placeholder="Blog title..." {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      id="description"
                      placeholder="Blog description...."
                      {...field}
                    />{" "}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="image">Image</FieldLabel>
                    {img && (
                      <div className="relative  h-62">
                        <Image
                          src={img}
                          alt="missing"
                          className="rounded-md object-cover object-center"
                          fill
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={(e) => {
                        setImg("");
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          setImg(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                        field.onChange(file);
                      }}
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
                    <Loader2 className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBlogPage;

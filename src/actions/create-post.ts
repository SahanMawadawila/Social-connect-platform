"use server";

import type { Post } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import paths from "@/paths";

//validate form data using zod. createPostSchema is a schema that defines the shape of the data that we expect to receive from the form
const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

//for frontend to show the errors
interface CreatePostFormState {
  errors: {
    title?: string[];
    content?: string[];
    _form?: string[];
  };
}

export async function createPost(
  slug: string,
  formState: CreatePostFormState,
  formData: FormData
): Promise<CreatePostFormState> {

  //applying the schema to the submitted form data
  const result = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  //if the validation fails, return the errors
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    }; 
  }

  //if the user is not signed in, return an error
  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to do this"],
      },
    };
  }

  //getting id of the topic
  const topic = await db.topic.findFirst({
    where: { slug },
  });

  //if the topic is not found, return an error
  if (!topic) {
    return {
      errors: {
        _form: ["Cannot find topic"],
      },
    };
  }

  let post: Post;
  try {
    post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        userId: session.user.id,
        topicId: topic.id,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Failed to create post"],
        },
      };
    }
  }

  revalidatePath(paths.topicShow(slug));
  redirect(paths.postShow(slug, post.id));
}

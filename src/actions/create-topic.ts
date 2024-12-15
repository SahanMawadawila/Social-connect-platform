"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { Topic } from "@prisma/client"; //importing Topic type from prisma client
import { redirect } from "next/navigation";
import { db } from "@/db";
import paths from "@/paths";
import { revalidatePath } from "next/cache";

const createTopicSchema = z.object({
  //validate form data using zod
  name: z
    .string()
    .min(3)
    .regex(/[a-z-]/, {
      message: "Must be lowercase letters or dashes without spaces",
    }),
  description: z.string().min(10),
});

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    __form__?: string[]; //this is for sending database connection errors, non authentication errors back to form
  };
}

export async function createTopic(
  formState: CreateTopicFormState,
  formData: FormData
): Promise<CreateTopicFormState> {
  //promise of that type because we are using async function

  //validate form data from schema defined above
  const result = createTopicSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  const session = await auth();

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors, //returning errors if validation fails
    };
  }

  if (!session || !session.user) {
    return {
      errors: {
        __form__: ["You must be signed in to create a topic"],
      },
    };
  }

  let topic: Topic;
  try {
    //throw new Error("An error occurred"); //for testing error handling
    topic = await db.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description,
      },
    });
  } catch (err: unknown) {
    return {
      errors: {
        __form__: [err instanceof Error ? err.message : "An error occurred"],
      },
    };
  }

  revalidatePath("/");
  redirect(paths.topicShow(topic.slug));
}

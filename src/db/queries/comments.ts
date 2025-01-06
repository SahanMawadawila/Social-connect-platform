import type { Comment } from "@prisma/client";
import { db } from "@/db";

//type intersection of Comment with the user

export type CommentWithAuthor = Comment & {
  user: { name: string | null; image: string | null };
};

//fetch all the comments of a post

export function fetchCommentsByPostId(
  postId: string
): Promise<CommentWithAuthor[]> {
  return db.comment.findMany({
    where: { postId },
    include: {
      user: { select: { name: true, image: true } },
    },
  });
}

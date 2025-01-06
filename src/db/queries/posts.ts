import type { Post } from "@prisma/client";
import { db } from "@/db";

//time combination of Post with the topic, user, and comment count
export type PostWithData = Post & {
  topic: { slug: string };
  user: { name: string | null };
  _count: { comments: number };
};

//when we given the slug of a topic, it will return all the posts of that topic including
export function fetchPostsByTopicSlug(slug: string): Promise<PostWithData[]> {
  return db.post.findMany({
    where: { topic: { slug } }, //retrieve only posts it has slug with its topicid
    include: {
      //this is same as JOIN in sql
      topic: { select: { slug: true } }, //include topic table(  relation name given), this say only slug value is retrieved
      user: { select: { name: true } }, //relationship to user table
      _count: { select: { comments: true } }, //this will count records related to each post. its also given by prisma
    },
  });
} //this funtion imported to posts list component

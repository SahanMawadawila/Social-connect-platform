import type { PostWithData } from "@/db/queries/posts";
import Link from "next/link";
import paths from "@/paths";

interface PostListProps {
  //fetchData is a function that returns a promise of an array of PostWithData
  fetchData: () => Promise<PostWithData[]>;
}

export default async function PostList({ fetchData }: PostListProps) {
  //in here its calling. but to call its need the slug of the topic. so it will be passed from page.tsx
  const posts = await fetchData();

  const renderedPosts = posts.map((post) => {
    const topicSlug = post.topic.slug;

    if (!topicSlug) {
      throw new Error("Need a slug to link to a post");
    }

    return (
      <div key={post.id} className="border rounded p-2">
        <Link href={paths.postShow(topicSlug, post.id)}>
          <h3 className="text-lg font-bold">{post.title}</h3>
          <div className="flex flex-row gap-8">
            <p className="text-xs text-gray-400">By {post.user.name}</p>
            <p className="text-xs text-gray-400">
              {post._count.comments} comments
            </p>
          </div>
        </Link>
      </div>
    );
  });

  return <div className="space-y-2">{renderedPosts}</div>;
}

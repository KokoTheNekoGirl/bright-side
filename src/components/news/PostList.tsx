import type { Post } from '@/lib/news/get-posts';
import EmptyState from './EmptyState';
import PostCard from './PostCard';

/** A list of post cards, or the empty state when there are none. */
export default function PostList({ posts, emptyMessage }: { posts: Post[]; emptyMessage?: string }) {
  if (!posts.length) return <EmptyState message={emptyMessage} />;

  return (
    <ul role="list" className="post-list flex flex-col items-center gap-10">
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}

import React from 'react';
import PostCard from './PostCard';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  thumbnail?: string;
  date: string;
  category: string;
  href: string;
}

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 py-10">
      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}

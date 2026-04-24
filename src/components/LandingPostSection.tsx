'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  thumbnail: string | null;
  category: string;
  createdAt: string;
}

interface LandingPostSectionProps {
  category: 'REHAB' | 'BANKRUPTCY' | 'SUCCESS_STORY';
  title: string;
  subtitle: string;
  href: string;
  limit?: number;
}

export default function LandingPostSection({ category, title, subtitle, href, limit = 3 }: LandingPostSectionProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`/api/posts?category=${category}&limit=${limit}`);
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [category]);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="py-12 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--primary)]">{title}</h2>
            <p className="text-[var(--primary)]/60 mt-4 font-medium">{subtitle}</p>
          </div>
          <Link href={href} className="group flex items-center gap-2 text-[var(--primary)] font-bold hover:text-[var(--secondary)] transition-colors">
            더 보기
            <span className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--secondary)] group-hover:bg-[var(--secondary)] group-hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-96 animate-pulse border border-[var(--border)]"></div>
            ))
          ) : (
            posts.map((post) => (
              <Link 
                key={post.id} 
                href={`${category === 'REHAB' ? '/rehab' : '/bankruptcy'}/posts/${post.id}`}
                className="group bg-white rounded-3xl overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  {post.thumbnail ? (
                    <img 
                      src={post.thumbnail} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--primary)]/5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-[var(--primary)]/20">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c1.052 0 2.062.18 3 .512v-14.25A8.987 8.987 0 0112 6.042m0 12.084a8.967 8.967 0 006-3.75c1.052 0 2.062.18 3 .512v-14.25A8.987 8.987 0 0018 3.75c-1.052 0-2.062.18-3 .512v14.25z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-5 left-5">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[var(--secondary)] text-[10px] font-black rounded-lg border border-[var(--secondary)]/10 shadow-sm uppercase tracking-widest">
                      {category === 'REHAB' ? '회생 정보' : '파산 정보'}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-bold text-[var(--primary)] text-lg mb-4 line-clamp-2 group-hover:text-[var(--secondary)] transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[var(--primary)]/50 leading-relaxed line-clamp-2 mb-6">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
                    <span></span>
                    <span className="text-xs font-medium text-[var(--primary)]/40">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

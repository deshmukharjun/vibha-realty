'use client'

import { useBlogPosts } from "@/hooks/useCMS";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

export function BlogList() {
  const { posts, loading, error } = useBlogPosts(true);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading blogs: {error}</p>
        <p className="text-gray-600">Please check your Firebase configuration.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No blogs published yet.</p>
        <p className="text-sm text-gray-500">Check back soon for updates from Charushila!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((blog) => (
        <article key={blog.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-green-600 uppercase">
                {blog.category.replace('-', ' ')}
              </span>
              <span className="text-sm text-gray-500">{blog.readingTime} min read</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-green-600 transition">
              {blog.title}
            </h2>

            <p className="text-gray-600 mb-4 line-clamp-3">
              {blog.excerpt}
            </p>

            <div className="flex gap-2 mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {blog.area}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <Link href="/contact">
                <Button variant="primary" size="sm">
                  <Image src="/whatsapp_green.svg" alt="WhatsApp" width={16} height={16} />
                  Read & Inquire
                </Button>
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

'use client'

import { useState } from 'react'
import { useBlogPosts } from "@/hooks/useCMS";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import type { BlogPost } from "@/types/cms";

export function BlogList() {
  const { posts, loading, error } = useBlogPosts(true);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

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
    <>
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
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setSelectedBlog(blog)}
                >
                  Read
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Blog Modal */}
      {selectedBlog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedBlog(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-green-600 uppercase">
                  {selectedBlog.category.replace('-', ' ')}
                </span>
                <span className="text-sm text-gray-500">{selectedBlog.readingTime} min read</span>
              </div>
              <button
                onClick={() => setSelectedBlog(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="Close modal"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {selectedBlog.title}
              </h2>

              <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {selectedBlog.area}
                </span>
                <span>
                  {new Date(selectedBlog.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span>By {selectedBlog.author}</span>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 mb-6 font-medium">
                  {selectedBlog.excerpt}
                </p>
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedBlog.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

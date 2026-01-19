'use client'

import { useState } from 'react'
import { useBlogPosts, updateBlogPost, deleteBlogPost } from '@/hooks/useCMS'
import Link from 'next/link'
import type { BlogPost } from '@/types/cms'

export default function BlogsPage() {
  const { posts, loading, error, refresh } = useBlogPosts(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return

    setDeleting(id)
    try {
      await deleteBlogPost(id)
      refresh() // Refresh after delete
    } catch (error) {
      alert('Failed to delete blog: ' + error)
    } finally {
      setDeleting(null)
    }
  }

  const togglePublish = async (post: BlogPost) => {
    try {
      await updateBlogPost(post.id, {
        status: post.status === 'published' ? 'draft' : 'published',
      })
      refresh() // Refresh after status change
    } catch (error) {
      alert('Failed to update blog: ' + error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => refresh()}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition"
            disabled={loading}
          >
            🔄 Refresh
          </button>
          <Link
            href="/admin/dashboard/blogs/new"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
          >
            + New Blog
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading blogs: {error}
        </div>
      )}

      {!loading && posts.length === 0 && !error && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          No blogs found. Make sure your blogs have the correct status field set.
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Area</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Published</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{post.title}</p>
                </td>
                <td className="px-6 py-4 text-gray-700">{post.area}</td>
                <td className="px-6 py-4 text-gray-700">{post.category}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => togglePublish(post)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    {post.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <Link
                    href={`/admin/dashboard/blogs/${post.id}`}
                    className="text-green-600 hover:text-green-900 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
                  >
                    {deleting === post.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts yet.</p>
            <Link
              href="/admin/dashboard/blogs/new"
              className="text-blue-600 hover:text-blue-900 mt-2 inline-block"
            >
              Create your first blog post
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

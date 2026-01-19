'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { addBlogPost, updateBlogPost, getBlogPost } from '@/hooks/useCMS'
import { useAreas } from '@/hooks/useCMS'
import Link from 'next/link'
import type { BlogPost } from '@/types/cms'

interface Props {
  params: Promise<{ id?: string }>
}

export default function BlogEditor({ params }: Props) {
  const router = useRouter()
  const { areas } = useAreas()
  const { id } = use(params)
  const isEditMode = id && id !== 'new'

  const [formData, setFormData] = useState<{
    title: string
    slug: string
    excerpt: string
    content: string
    category: 'residential-updates' | 'investment-guide' | 'commercial-insights' | 'market-trends'
    area: string
    publishedAt: string
    readingTime: number
    author: string
    featured: boolean
    status: 'draft' | 'published'
  }>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'residential-updates',
    area: '',
    publishedAt: new Date().toISOString().split('T')[0],
    readingTime: 5,
    author: 'Charushila Bhalerao',
    featured: false,
    status: 'draft',
  })

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPost = async () => {
      if (isEditMode && id) {
        setFetching(true)
        try {
          const post = await getBlogPost(id)
          if (post) {
            const postData = {
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              content: post.content,
              category: post.category,
              area: post.area,
              publishedAt: post.publishedAt.split('T')[0],
              readingTime: post.readingTime,
              author: post.author,
              featured: post.featured,
              status: post.status,
            }
            setFormData(postData)
          } else {
            setError('Blog post not found')
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load blog post')
        } finally {
          setFetching(false)
        }
      }
    }
    loadPost()
  }, [isEditMode, id])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isEditMode && !id) {
      setError('Invalid blog post ID')
      setLoading(false)
      return
    }

    try {
      const postData = {
        ...formData,
        status: (publish ? 'published' : 'draft') as 'draft' | 'published',
        readingTime: parseInt(formData.readingTime.toString()),
      }

      if (isEditMode && id) {
        await updateBlogPost(id, postData)
      } else {
        await addBlogPost(postData as any)
      }

      router.push('/admin/dashboard/blogs')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save blog')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/dashboard/blogs" className="text-blue-600 hover:text-blue-900">
          ← Back to Blogs
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h1>

      {fetching && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
          Loading blog post...
        </div>
      )}

      <form className="bg-white rounded-lg shadow p-6 max-w-4xl">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              placeholder="Blog post title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              placeholder="auto-generated"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black h-24"
              placeholder="Brief summary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black h-64"
              placeholder="Full blog content (Markdown supported)"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as any,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              >
                <option value="residential-updates">Residential Updates</option>
                <option value="investment-guide">Investment Guide</option>
                <option value="commercial-insights">Commercial Insights</option>
                <option value="market-trends">Market Trends</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
              <select
                value={formData.area}
                onChange={(e) => setFormData((prev) => ({ ...prev, area: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              >
                <option value="">Select an area</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.name}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Published Date</label>
              <input
                type="date"
                value={formData.publishedAt}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    publishedAt: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reading Time (min)</label>
              <input
                type="number"
                min="1"
                value={formData.readingTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    readingTime: parseInt(e.target.value),
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  featured: e.target.checked,
                }))
              }
              className="w-4 h-4"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
              Feature this blog post on homepage
            </label>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={(e) => handleSubmit(e, false)}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded transition disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  )
}

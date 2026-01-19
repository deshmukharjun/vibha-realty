'use client'

import { useTestimonials } from "@/hooks/useCMS";

export function TestimonialsList() {
  const { testimonials, loading, error } = useTestimonials();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading testimonials: {error}</p>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No testimonials yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="bg-gray-50 border border-gray-200 rounded-lg p-8">
          <div className="flex mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star} 
                className={`text-lg ${
                  star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-gray-700 mb-6 italic">"{testimonial.testimonial}"</p>
          <div>
            <p className="font-bold text-gray-900">{testimonial.clientName}</p>
            <p className="text-gray-600 text-sm">Purchased in {testimonial.area}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

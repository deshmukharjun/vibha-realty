"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { TestimonialSubmitForm } from "@/components/forms/TestimonialSubmitForm";

export function TestimonialCTA() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="mt-12 text-center">
        <p className="text-gray-700 mb-4">
          Bought a home with Charushila?
        </p>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 rounded-lg bg-(--color-accent) text-white font-semibold hover:brightness-90 transition-colors"
        >
          Write a testimonial
        </button>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto scrollbar-hide bg-black/20 pt-8 pb-20"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
          role="presentation"
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide rounded-xl bg-(--color-primary) shadow-xl mx-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="testimonial-modal-title"
          >
            <div className="sticky top-0 bg-(--color-primary) border-b border-gray-200 px-4 py-3 flex items-center justify-between rounded-t-xl">
              <h2 id="testimonial-modal-title" className="text-lg font-semibold text-gray-900">
                Write a testimonial
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <TestimonialSubmitForm onSuccess={() => setModalOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

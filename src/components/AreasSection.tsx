"use client";

import Image from "next/image";
import { useAreas } from "@/hooks/useCMS";
import { Container } from "@/components/ui/Container";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919881199152";
const DEFAULT_PREFILL = (areaName: string) =>
  `Hi Charushila, I'm interested in ${areaName}. Would love to hear your recommendations.`;

export function AreasSection() {
  const { areas, loading, error } = useAreas();

  return (
    <section id="areas" className="scroll-mt-20 py-16 md:py-24 bg-[var(--color-primary)]">
      <Container>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
          Areas of Operation
        </h2>
        <p className="text-xl text-gray-700 mb-12 text-center">
          I specialize in all major areas of Pune. Each area has unique characteristics and
          investment potential.
        </p>

        {error && (
          <div className="mb-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm text-center">
            Could not load areas. Try again later.
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[var(--color-secondary)] border border-gray-200 rounded-lg p-8 animate-pulse">
                <div className="h-7 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-10 bg-gray-200 rounded w-full mt-6" />
              </div>
            ))}
          </div>
        ) : areas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {areas.map((area) => {
              const href = area.whatsappBroadcastLink
                ? area.whatsappBroadcastLink
                : `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_PREFILL(area.name))}`;
              return (
                <div
                  key={area.id}
                  className="bg-[var(--color-secondary)] border border-gray-200 rounded-lg p-8"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{area.name}</h3>
                  <p className="text-gray-700 mb-6">
                    {area.shortDescription || area.fullDescription?.slice(0, 200) || ""}
                  </p>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full font-semibold rounded-lg bg-[var(--color-accent)] text-white hover:brightness-90 px-4 py-2 text-sm transition-all duration-200"
                  >
                    <Image src="/whatsapp.svg" alt="WhatsApp" width={16} height={16} />
                    Get added to  {area.name} Broadcast
                  </a>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-12 text-center text-gray-600 text-sm">
            No areas added yet. Add areas in the admin panel.
          </div>
        )}
      </Container>
    </section>
  );
}

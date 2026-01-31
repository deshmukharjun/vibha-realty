'use client'

import { useChannelPartners } from "@/hooks/useCMS";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

export function PartnersList() {
  const { partners, loading, error } = useChannelPartners();

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
        <p className="text-red-600 mb-4">Error loading partners: {error}</p>
      </div>
    );
  }

  if (partners.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No channel partners available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {partners.map((partner) => (
        <div key={partner.id} className="bg-[var(--color-secondary)] border border-gray-200 rounded-lg p-8 hover:shadow-md transition">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{partner.name}</h3>
          <p className="text-gray-600 mb-4">{partner.propertyTypes.join(', ')} Properties</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {partner.areas.map((area) => (
              <span key={area} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {area}
              </span>
            ))}
          </div>
          <Link href="/contact">
            <Button variant="primary" size="md" className="w-full">
              <Image src="/whatsapp.svg" alt="WhatsApp" width={16} height={16} />
              Get Details
            </Button>
          </Link>
        </div>
      ))}
    </div>
  );
}

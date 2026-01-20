"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { openWhatsApp, createWhatsAppMessage } from "@/lib/whatsapp";
import Image from "next/image";

interface EnquiryFormProps {
  areas?: string[];
  whatsappNumber: string;
}

export function EnquiryForm({ areas = [], whatsappNumber }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    requirement: "buy",
    area: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Store enquiry (if backend is ready)
      // For now, we'll just redirect to WhatsApp
      const message = createWhatsAppMessage(
        formData.name,
        formData.requirement,
        formData.area
      );

      openWhatsApp(whatsappNumber, message);
    } catch (error) {
      console.error("Error submitting enquiry:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black placeholder:text-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="10-digit number"
          pattern="[0-9]{10}"
          className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          I'm looking to
        </label>
        <select
          name="requirement"
          value={formData.requirement}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
        >
          <option value="buy">Buy</option>
          <option value="rent">Rent</option>
          <option value="invest">Invest</option>
        </select>
      </div>

      {areas.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Area (Optional)
          </label>
          <select
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
          >
            <option value="">Select an area</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        disabled={loading}
        className="gap-2"
      >
        <Image src="/whatsapp.svg" alt="WhatsApp" width={18} height={18} />
        {loading ? "Connecting..." : "Get Details on WhatsApp"}
      </Button>

      <p className="text-xs text-gray-700 text-center">
        We'll connect with you on WhatsApp within minutes
      </p>
    </form>
  );
}

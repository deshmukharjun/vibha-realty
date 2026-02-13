"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { openWhatsApp, createWhatsAppMessage } from "@/lib/whatsapp";
import { addEnquiry } from "@/hooks/useCMS";
import { db } from '@/lib/firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import Image from "next/image";

interface EnquiryFormProps {
  areas?: string[];
  whatsappNumber: string;
}

const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
];

export function EnquiryForm({ areas = [], whatsappNumber }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+91",
    phone: "",
    requirement: "buy",
    area: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmitToBackend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) return;

    setLoading(true);
    setSubmitSuccess(false);

    try {
      const fullPhone = formData.countryCode + formData.phone;
      
      // 1. Save Enquiry
      await addEnquiry({
        name: formData.name,
        phone: fullPhone,
        requirement: formData.requirement as 'buy' | 'rent' | 'invest',
        area: formData.area,
      });

      // 2. Create Smart Notification for App
      await addDoc(collection(db, 'notifications'), {
        text: `New Enquiry from ${formData.name} for ${formData.area || 'General Area'}`,
        type: 'enquiry',
        isRead: false,
        createdAt: new Date().toISOString(), // Matches ISO format
      });
      
      setSubmitSuccess(true);
      setTimeout(() => {
        setFormData({ name: "", countryCode: "+91", phone: "", requirement: "buy", area: "" });
        setSubmitSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error("Error submitting enquiry:", error);
      alert(`Failed: ${error?.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    const message = createWhatsAppMessage(formData.name, formData.requirement, formData.area);
    openWhatsApp(whatsappNumber, message);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmitToBackend} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" className="w-full px-4 py-2 border border-(--color-accent) rounded-lg text-black" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
        <div className="flex gap-2">
          <select name="countryCode" value={formData.countryCode} onChange={handleChange} className="px-3 py-2 border border-(--color-accent) rounded-lg text-gray-700 bg-transparent">
            {COUNTRY_CODES.map((cc) => <option key={cc.code} value={cc.code}>{cc.flag} {cc.code}</option>)}
          </select>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone number" className="flex-1 px-4 py-2 border border-(--color-accent) text-black rounded-lg" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">I'm looking to</label>
        <select name="requirement" value={formData.requirement} onChange={handleChange} className="w-full px-4 py-2 border border-(--color-accent) rounded-lg text-gray-700">
          <option value="buy">Buy</option><option value="rent">Rent</option><option value="invest">Invest</option>
        </select>
      </div>
      {areas.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Area</label>
          <select name="area" value={formData.area} onChange={handleChange} className="w-full px-4 py-2 border border-(--color-accent) rounded-lg text-gray-700">
            <option value="">Select an area</option>
            {areas.map((area) => <option key={area} value={area}>{area}</option>)}
          </select>
        </div>
      )}
      <div className="flex flex-col gap-3">
        <Button type="submit" variant="primary" fullWidth disabled={loading} className="bg-(--color-accent)">
          {loading ? "Submitting..." : submitSuccess ? "✓ Submitted!" : "Submit Enquiry"}
        </Button>
        <Button type="button" variant="primary" fullWidth onClick={handleSendWhatsApp} className="gap-2 bg-(--color-accent)">
          <Image src="/whatsapp.svg" alt="WhatsApp" width={22} height={22} /> Send on WhatsApp
        </Button>
      </div>
    </form>
  );
}
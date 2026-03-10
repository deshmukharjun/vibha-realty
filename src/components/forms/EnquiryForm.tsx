"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { openWhatsApp, createWhatsAppMessage } from "@/lib/whatsapp";
import { addEnquiry } from "@/hooks/useCMS";
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Image from "next/image";
import type { EnquiryRequirement } from "@/types/cms";

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

const REQUIREMENT_OPTIONS: { value: EnquiryRequirement; label: string }[] = [
  { value: "buy", label: "Buy" },
  { value: "rent", label: "Rent" },
  { value: "invest", label: "Invest" },
  { value: "sell", label: "Sell" },
];

const BUDGET_OPTIONS = [
  "",
  "Under 50L",
  "50L – 80L",
  "80L – 1 Cr",
  "1 Cr – 1.5 Cr",
  "1.5 Cr – 2 Cr",
  "2 Cr+",
  "Custom",
];

export function EnquiryForm({ areas = [], whatsappNumber }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+91",
    phone: "",
    requirements: [] as EnquiryRequirement[],
    requirementOtherSelected: false,
    requirementOther: "",
    selectedAreas: [] as string[],
    areaOther: "",
    budget: "",
    budgetCustomValue: "",
    budgetCustomUnit: "lakh" as "lakh" | "crore",
  });
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const requirementOtherChecked = formData.requirementOtherSelected;
  const areasWithOther = formData.selectedAreas.filter((a) => a !== "__other__");

  const budgetIsCustom = formData.budget === "Custom";
  const resolvedBudget = budgetIsCustom
    ? formData.budgetCustomValue.trim()
      ? `${formData.budgetCustomValue} ${formData.budgetCustomUnit === "crore" ? "Crore" : "Lakh"}`
      : ""
    : formData.budget;

  const handleSubmitToBackend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) return;

    setLoading(true);
    setSubmitSuccess(false);

    try {
      const fullPhone = formData.countryCode + formData.phone;
      const areasList = [...areasWithOther];
      if (formData.areaOther.trim()) areasList.push(formData.areaOther.trim());

      const reqOther = formData.requirementOther.trim();
      const budgetVal = resolvedBudget.trim();
      const payload: Parameters<typeof addEnquiry>[0] = {
        name: formData.name,
        phone: fullPhone,
        requirement: formData.requirements,
        areas: areasList,
      };
      if (reqOther) payload.requirementOther = reqOther;
      if (budgetVal) payload.budget = budgetVal;
      await addEnquiry(payload);

      await addDoc(collection(db, 'notifications'), {
        text: `New Enquiry from ${formData.name}${areasList.length > 0 ? ` for ${areasList.join(", ")}` : " (General)"}`,
        type: 'enquiry',
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setFormData({
          name: "",
          countryCode: "+91",
          phone: "",
          requirements: [],
          requirementOtherSelected: false,
          requirementOther: "",
          selectedAreas: [],
          areaOther: "",
          budget: "",
          budgetCustomValue: "",
          budgetCustomUnit: "lakh",
        });
        setSubmitSuccess(false);
      }, 3000);
    } catch (error: unknown) {
      console.error("Error submitting enquiry:", error);
      alert(`Failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    const reqList = [
      ...formData.requirements,
      ...(formData.requirementOther.trim() ? [formData.requirementOther.trim()] : []),
    ];
    const areasList = [...areasWithOther];
    if (formData.areaOther.trim()) areasList.push(formData.areaOther.trim());
    const message = createWhatsAppMessage(
      formData.name,
      reqList,
      areasList,
      resolvedBudget.trim() || undefined
    );
    openWhatsApp(whatsappNumber, message);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleRequirement = (val: EnquiryRequirement) => {
    setFormData((prev) => {
      const next = prev.requirements.includes(val)
        ? prev.requirements.filter((r) => r !== val)
        : [...prev.requirements, val];
      return { ...prev, requirements: next };
    });
  };

  const toggleArea = (area: string) => {
    setFormData((prev) => {
      const isOther = area === "__other__";
      let next: string[];
      if (isOther) {
        next = prev.selectedAreas.includes("__other__")
          ? prev.selectedAreas.filter((a) => a !== "__other__")
          : [...prev.selectedAreas, "__other__"];
        if (!next.includes("__other__")) {
          return { ...prev, selectedAreas: next, areaOther: "" };
        }
      } else {
        next = prev.selectedAreas.includes(area)
          ? prev.selectedAreas.filter((a) => a !== area)
          : [...prev.selectedAreas.filter((a) => a !== "__other__"), area];
      }
      return { ...prev, selectedAreas: next };
    });
  };


  return (
    <form onSubmit={handleSubmitToBackend} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your name"
          className="w-full px-4 py-2 border border-(--color-accent) rounded-lg text-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
        <div className="flex gap-2">
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            className="px-3 py-2 border border-(--color-accent) rounded-lg text-gray-700 bg-transparent"
          >
            {COUNTRY_CODES.map((cc) => (
              <option key={cc.code} value={cc.code}>
                {cc.flag} {cc.code}
              </option>
            ))}
          </select>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Phone number"
            className="flex-1 px-4 py-2 border border-(--color-accent) text-black rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">I'm looking to (select all that apply)</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {REQUIREMENT_OPTIONS.map((opt) => (
            <label key={opt.value} className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requirements.includes(opt.value)}
                onChange={() => toggleRequirement(opt.value)}
                className="w-4 h-4 rounded border-gray-300 text-(--color-accent) focus:ring-(--color-accent)"
              />
              <span className="text-gray-700">{opt.label}</span>
            </label>
          ))}
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={requirementOtherChecked}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  requirementOtherSelected: e.target.checked,
                  requirementOther: e.target.checked ? p.requirementOther : "",
                }))
              }
              className="w-4 h-4 rounded border-gray-300 text-(--color-accent) focus:ring-(--color-accent)"
            />
            <span className="text-gray-700">Other</span>
          </label>
        </div>
        {requirementOtherChecked && (
          <input
            type="text"
            value={formData.requirementOther}
            onChange={(e) => setFormData((p) => ({ ...p, requirementOther: e.target.value }))}
            placeholder="Please specify..."
            className="mt-1 w-full px-4 py-2 border border-(--color-accent) rounded-lg text-black"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Area (select all that apply)</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {areas.map((area) => (
            <label key={area} className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.selectedAreas.includes(area)}
                onChange={() => toggleArea(area)}
                className="w-4 h-4 rounded border-gray-300 text-(--color-accent) focus:ring-(--color-accent)"
              />
              <span className="text-gray-700">{area}</span>
            </label>
          ))}
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.selectedAreas.includes("__other__")}
              onChange={() => toggleArea("__other__")}
              className="w-4 h-4 rounded border-gray-300 text-(--color-accent) focus:ring-(--color-accent)"
            />
            <span className="text-gray-700">Other</span>
          </label>
        </div>
        {formData.selectedAreas.includes("__other__") && (
          <input
            type="text"
            value={formData.areaOther}
            onChange={(e) => setFormData((p) => ({ ...p, areaOther: e.target.value }))}
            placeholder="Type your area..."
            className="mt-1 w-full px-4 py-2 border border-(--color-accent) rounded-lg text-black"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
        <select
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-(--color-accent) rounded-lg text-gray-700"
        >
          {BUDGET_OPTIONS.map((opt) => (
            <option key={opt || "empty"} value={opt}>
              {opt || "Select budget range"}
            </option>
          ))}
        </select>
        {budgetIsCustom && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              inputMode="decimal"
              value={formData.budgetCustomValue}
              onChange={(e) => setFormData((p) => ({ ...p, budgetCustomValue: e.target.value }))}
              placeholder="e.g. 1.5"
              className="flex-1 px-4 py-2 border border-(--color-accent) rounded-lg text-black"
            />
            <select
              value={formData.budgetCustomUnit}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  budgetCustomUnit: e.target.value as "lakh" | "crore",
                }))
              }
              className="px-4 py-2 border border-(--color-accent) rounded-lg text-gray-700 min-w-[100px]"
            >
              <option value="lakh">Lakh</option>
              <option value="crore">Crore</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Button type="submit" variant="primary" fullWidth disabled={loading} className="bg-(--color-accent)">
          {loading ? "Submitting..." : submitSuccess ? "✓ Submitted!" : "Submit Enquiry"}
        </Button>
        <Button
          type="button"
          variant="primary"
          fullWidth
          onClick={handleSendWhatsApp}
          className="gap-2 bg-(--color-accent)"
        >
          <Image src="/whatsapp.svg" alt="WhatsApp" width={22} height={22} /> Send on WhatsApp
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { openWhatsApp, createWhatsAppMessage, createCallLink } from "@/lib/whatsapp";
import { Phone } from "lucide-react";
import Image from "next/image";

interface StickyHeaderProps {
  whatsappNumber: string;
}

export function StickyHeader({ whatsappNumber }: StickyHeaderProps) {
  const [showCallMenu, setShowCallMenu] = useState(false);

  const handleWhatsApp = () => {
    const message = "Hi Charushila, I'm interested in a property. Could you help me?";
    openWhatsApp(whatsappNumber, message);
  };

  const handleCall = () => {
    window.location.href = `tel:+${whatsappNumber}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-[9999] md:hidden">
      <div className="flex gap-3 p-4 safe-area-inset-bottom">
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={handleWhatsApp}
          className="gap-2"
        >
          <Image src="/whatsapp.svg" alt="WhatsApp" width={20} height={20} />
          WhatsApp
        </Button>
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={handleCall}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Phone size={20} />
          Call
        </Button>
      </div>
    </div>
  );
}

// Desktop sticky buttons
export function StickyButtonsDesktop({ whatsappNumber }: StickyHeaderProps) {
  const handleWhatsApp = () => {
    const message = "Hi Charushila, I'm interested in a property. Could you help me?";
    openWhatsApp(whatsappNumber, message);
  };

  const handleCall = () => {
    window.location.href = `tel:+${whatsappNumber}`;
  };

  return (
    <div className="hidden md:flex fixed right-6 bottom-6 flex-col gap-3 z-40">
      <Button
        variant="primary"
        size="md"
        onClick={handleWhatsApp}
        className="gap-2 shadow-lg"
      >
        <Image src="/whatsapp.svg" alt="WhatsApp" width={20} height={20} />
      </Button>
      <Button
        variant="secondary"
        size="md"
        onClick={handleCall}
        className="gap-2 shadow-lg"
      >
        <Phone size={20} />
      </Button>
    </div>
  );
}

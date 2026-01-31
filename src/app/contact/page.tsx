import { Container } from "@/components/ui/Container";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Phone, Mail } from "lucide-react";
import Image from "next/image";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
const EMAIL = process.env.NEXT_PUBLIC_EMAIL || "vibha.realties@gmail.com";

export default function Contact() {
  return (
    <>
      <section className="py-16 md:py-24 bg-(--color-primary)">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-700 text-center mb-12">
              Have questions? Ready to find your perfect property? Reach out and let us chat!
            </p>

            <div className="bg-(--color-secondary) border border-gray-200 rounded-lg p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Enquiry Form</h2>
              <p className="text-gray-600 mb-8">
                Fill this form and I will connect with you on WhatsApp or call within minutes.
              </p>

              <EnquiryForm
                whatsappNumber={WHATSAPP_NUMBER}
                areas={["Baner", "Wakad", "Hadapsar", "Kalyani Nagar", "Koregaon Park", "Kothrud", "Viman Nagar", "Pune City"]}
              />
            </div>

            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Why Contact Me?</h3>
              <ul className="space-y-2 text-gray-700">
                <li> 15+ years of experience in Pune real estate</li>
                <li> Deep knowledge of all major localities</li>
                <li> Access to properties from top builders</li>
                <li> Honest, transparent guidance</li>
                <li> Quick response - 24/7 available</li>
                <li> No pressure, just genuine consultation</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

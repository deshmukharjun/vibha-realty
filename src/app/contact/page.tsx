import { Container } from "@/components/ui/Container";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Phone, Mail } from "lucide-react";
import Image from "next/image";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";

export default function Contact() {
  return (
    <>
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-700 text-center mb-12">
              Have questions? Ready to find your perfect property? Reach out and let us chat!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image src="/whatsapp.svg" alt="WhatsApp" width={32} height={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">WhatsApp</h3>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="text-green-600 font-semibold">
                  Message Now
                </a>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-blue-600" size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
                <a href={`tel:+${WHATSAPP_NUMBER}`} className="text-blue-600 font-semibold">
                  Call Directly
                </a>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-purple-600" size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">24/7 Available</h3>
                <p className="text-gray-600">Always ready to help</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 md:p-12">
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

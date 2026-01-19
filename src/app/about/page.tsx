import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919881199152";

export default function About() {
  return (
    <>
      <section className="py-16 md:py-24 bg-white">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <Image
              src="/headshot.jpeg"
              alt="Charushila Bhalerao"
              width={500}
              height={600}
              className="w-full h-auto rounded-xl shadow-lg object-cover order-2 md:order-1"
            />
            <div className="order-1 md:order-2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Hey there! <br />I'm Charushila Bhalerao
              </h1>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                With over 15 years of experience in Pune real estate, I have helped hundreds of families find their perfect homes and investors discover lucrative opportunities.
              </p>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                My approach is simple: understand your needs, guide you honestly, and connect you with the right property. No pressure. Just genuine consultation.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Markets I Serve
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Residential</h3>
              <ul className="space-y-2 text-gray-700">
                <li> Apartments (2 BHK to 4 BHK)</li>
                <li> Independent villas</li>
                <li> Gated communities</li>
                <li> Premium localities</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Investment</h3>
              <ul className="space-y-2 text-gray-700">
                <li> Rental properties</li>
                <li> Investment plots</li>
                <li> Commercial spaces</li>
                <li> Pre-launch projects</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Why Choose Me
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Honest Guidance", desc: "I focus on your needs, not commissions" },
              { title: "Local Expert", desc: "Deep knowledge of all Pune localities" },
              { title: "Quick Response", desc: "Available 24/7 on WhatsApp and phone" },
            ].map((item, i) => (
              <div key={i} className="p-8 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-green-600 text-white">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Want to Know More?
            </h2>
            <p className="text-lg mb-8 text-green-100">
              Reach out and let us chat about your property goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi Vibha, I am interested in a property`}>
                <Button variant="outline" size="lg" className="group">
                  <Image src="/whatsapp.svg" alt="WhatsApp" width={20} height={20} className="group-hover:hidden" />
                  <Image src="/whatsapp_green.svg" alt="WhatsApp" width={20} height={20} className="hidden group-hover:inline-block" />
                  Get in Touch
                </Button>
              </a>
              <a href={`tel:+${WHATSAPP_NUMBER}`}>
                <Button variant="outline" size="lg">
                  <Phone size={20} />
                  Call Now
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

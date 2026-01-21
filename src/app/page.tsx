import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CountUpNumber } from "@/components/ui/CountUpNumber";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background image with soft overlay */}
        <Image
          src="/bgl.jpg"
          alt="Pune city skyline"
          fill
          priority
          className="object-cover opacity-100 pointer-events-none select-none"
        />  
        <div className="absolute inset-0 bg-gradient-to-br opacity-70 from-green-50/100 via-white/90 to-green-50/100" />

        <Container>
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-stretch">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Your Dream Property in Pune Starts Here
              </h1>
              <p className="text-lg text-gray-700 mb-4">
                With 12+ years of expertise, I've helped over 420 families find their perfect home and guided investors to properties that deliver real returns. No pressure, just honest guidance tailored to your needs.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                From premium apartments in Baner to investment opportunities in Wakad, I know Pune's real estate market inside out. Let's find the property that fits your lifestyle, budget, and future goals.
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    <CountUpNumber end={12} suffix="+" />
                  </div>
                  <p className="text-sm text-gray-700">Years of Trust</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    <CountUpNumber end={420} suffix="+" />
                  </div>
                  <p className="text-sm text-gray-700">Families Helped</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    <CountUpNumber end={67} suffix="+" />
                  </div>
                  <p className="text-sm text-gray-700">Successful Projects</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 sm:gap-4">
                <Link href="/contact" className="w-full">
                  <Button variant="primary" size="md" className="w-full whitespace-nowrap">
                    <Image src="/whatsapp.svg" alt="WhatsApp" width={24} height={24} />
                    Connect on WhatsApp
                  </Button>
                </Link>
                <a href={`tel:+${WHATSAPP_NUMBER}`} className="w-full">
                  <Button variant="outlineLight" size="md" className="w-full whitespace-nowrap">
                    <Phone size={24} />
                    Get on a Call
                  </Button>
                </a>
              </div>
            </div>

            {/* Right - Form */}
            <div className="bg-white/10 backdrop-blur-xs border-2 border-white/40 p-6 rounded-xl shadow-xl flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Start Your Property Search Today
              </h2>
              <p className="text-gray-700 mb-6">
                Share your requirements and I'll send you curated options within 24 hours
              </p>
              <EnquiryForm whatsappNumber={WHATSAPP_NUMBER} areas={["Baner", "Pune City", "Wakad", "Hadapsar"]} />
            </div>
          </div>
        </Container>
      </section>

      {/* Quick Info Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              My Expertise
            </h2>
            <p className="text-lg text-gray-700">
              Specializing in premium residential and investment properties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "", title: "Residential", desc: "Apartments, villas, and homes" },
              { icon: "", title: "Commercial", desc: "Office spaces and retail" },
              { icon: "", title: "Lands", desc: "High-return investment Lands" },
            ].map((item, i) => (
              <div key={i} className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Areas Served */}
      <section className="py-16 md:py-24 bg-gray-50">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Areas I Serve in Pune
          </h2>
          <p className="text-center text-gray-700 mb-12">
            Expertise across all major localities
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Baner", "Wakad", "Hadapsar", "Koregaon Park", "Pune City", "Kalyani Nagar", "Kothrud", "Viman Nagar"].map(
              (area) => (
                <Link key={area} href="/areas">
                  <div className="p-6 bg-white rounded-lg text-center hover:shadow-md transition cursor-pointer border border-gray-200">
                    <p className="font-semibold text-gray-900">{area}</p>
                  </div>
                </Link>
              )
            )}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-green-600 text-white">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Property?
            </h2>
            <p className="text-lg mb-8 text-green-50">
              Connect with me on WhatsApp or call directly. I will help you find the perfect property.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi Charushila, I am interested in a property`}>
                <Button variant="outline" size="lg" className="group">
                  <Image src="/whatsapp.svg" alt="WhatsApp" width={20} height={20} className="group-hover:hidden" />
                  <Image src="/whatsapp_green.svg" alt="WhatsApp" width={20} height={20} className="hidden group-hover:inline-block" />
                  Message on WhatsApp
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

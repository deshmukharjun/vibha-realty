import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { LogoCarousel } from "@/components/LogoCarousel";
import { TestimonialsList } from "@/components/TestimonialsList";
import { TestimonialCTA } from "@/components/TestimonialCTA";
import { ListingHero } from "@/components/listings/ListingHero";
import { AreasSection } from "@/components/AreasSection";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CountUpNumber } from "@/components/ui/CountUpNumber";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";

export default function Home() {
  return (
    <>
      {/* Listing Hero – primary discovery (filters + Personal + Channel Partner) */}
      <ListingHero />

      {/* About Me – headshot, description, and trusted-by logo carousel */}
      <section id="about" className="relative py-20 md:py-28 overflow-hidden scroll-mt-20 bg-white">
        <Container maxWidth="lg">
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-14 items-stretch">

            <div className="order-2 md:order-1 bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm">
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
                Hi, I&apos;m Charushila Bhalerao
              </h1>
              <h2 className="mt-2 text-xl md:text-2xl font-medium text-gray-600">
                10+ Years of Trusted Real Estate Expertise in Pune, Maharashtra
              </h2>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="px-3 py-1 border border-gray-200 rounded-full">Residential & Investment</span>
                <span className="px-3 py-1 border border-gray-200 rounded-full">Pune Specialist</span>
                <span className="px-3 py-1 border border-gray-200 rounded-full">Client-First Approach</span>
              </div>
              <p className="mt-6 text-md text-gray-800 leading-relaxed">
                Over the last <b>10+ years</b>, I&apos;ve helped over <b>365 families</b> find their dream homes in Pune&apos;s most sought-after neighborhoods. From first-time buyers in Baner to seasoned investors in Wakad.
              </p>
              <p className="mt-4 text-md text-gray-800 leading-relaxed">
                <b>What sets me apart?</b> I believe property decisions should be based on what&apos;s right for you, not what&apos;s convenient for me. I take time to understand your lifestyle, budget, and long-term goals before suggesting any property.
              </p>
              <p className="mt-4 text-md text-gray-800 leading-relaxed">
                Whether you&apos;re looking for a 2 BHK, a luxury villa, or a strategic investment, I <b>bring deep market knowledge</b>, strong builder relationships, and a genuine commitment to your success.
              </p>
            </div>
            <div className="order-1 md:order-2 relative h-full min-h-[400px] md:min-h-[500px]">
              <Image
                src="/headshot.jpeg"
                alt="Charushila Bhalerao – Pune Real Estate Consultant"
                fill
                className="rounded-2xl object-cover shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
              />
            </div>
          </div>

          <div className="mt-16 md:mt-20 w-full">
            <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-8">
              Trusted by Pune&apos;s leading names
            </p>
            <div className="w-full overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
              <LogoCarousel />
            </div>
          </div>
        </Container>
      </section>

      {/* Property Search Hero (second section) */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-white">
        <Container>
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-stretch">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Your Dream Property in Pune Starts Here
              </h1>
              <p className="text-lg text-gray-700 mb-4">
                With 10+ years of expertise, I've helped over 365 families find their perfect home and guided investors to properties that deliver real returns. No pressure, just honest guidance tailored to your needs.
              </p> 
              <p className="text-lg text-gray-700 mb-8">
                From premium apartments in Baner to investment opportunities in Wakad, I know Pune's real estate market inside out. Let's find the property that fits your lifestyle, budget, and future goals.
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    <CountUpNumber end={10} suffix="+" />
                  </div>
                  <p className="text-sm text-gray-700">Years of Trust</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    <CountUpNumber end={365} suffix="+" />
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
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact">
                  <Button variant="primary" size="md" className="whitespace-nowrap">
                    <Image src="/whatsapp.svg" alt="WhatsApp" width={22} height={22} />
                    Let's Talk
                  </Button>
                </Link>
                <a href="#about" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors group">
                  <span className="text-base font-medium">Know more about me</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right - Form */}
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm flex flex-col">
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

      {/* Areas I cover – CMS area cards with per-area broadcast / WhatsApp buttons */}
      <AreasSection />

      {/* Testimonials */}
      <section id="testimonials" className="scroll-mt-20 py-16 md:py-24 bg-white">
        <Container>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Happy Clients
          </h2>
          <p className="text-xl text-gray-700 mb-12">
            Read what my clients have to say about their experience.
          </p>

          <TestimonialsList />

          <TestimonialCTA />
        </Container>
      </section>
    </>
  );
}

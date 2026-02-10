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
      <section id="about" className="relative py-20 md:py-28 overflow-hidden scroll-mt-20 bg-(--color-primary)">
        <Container maxWidth="lg">
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            <div className="order-2 md:order-1 bg-(--color-secondary) border border-(--color-accent) p-6 rounded-xl shadow-sm">
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
                Charushila Bhalerao
              </h1>
              <h2 className="mt-2 text-xl md:text-2xl font-medium text-(--color-accent)">
                Founder & Principal Real Estate Advisor
                RERA Certified | PGPM – Real Estate (2017)
              </h2> 
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="px-3 py-1 border border-(--color-accent) rounded-full">Residential & Investment</span>
                <span className="px-3 py-1 border border-(--color-accent) rounded-full">Pune Specialist</span>
                <span className="px-3 py-1 border border-(--color-accent) rounded-full">Client-First Approach</span>
              </div>
              <p className="mt-6 text-md text-gray-800 leading-relaxed">
                With a strong academic foundation and hands-on industry experience, Charushila brings a rare blend of market insight, client empathy, and professional rigour to real estate advisory.
              </p>
              <p className="mt-4 text-md text-gray-800 leading-relaxed">
                Her approach is consultative rather than transactional — built on deep listening, honest guidance, and a commitment to helping clients make decisions that stand the test of time. Known for her integrity and personalised engagement, Charushila works closely with every client, ensuring clarity, comfort, and confidence throughout the journey.
              </p>
              <p className="mt-4 text-md text-gray-800 leading-relaxed">
                Whether you&apos;re looking for a 2 BHK, a luxury villa, or a strategic investment, Charushila brings deep market knowledge, strong builder relationships, and a genuine commitment to your success.
              </p>
            </div>
            <div className="order-1 md:order-2 relative h-full min-h-100 md:min-h-125">
              <Image
                src="/headshot.jpeg"
                alt="Charushila Bhalerao – Pune Real Estate Consultant"
                fill
                className="rounded-2xl object-cover border border-(--color-accent) shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
              />
            </div>
          </div>

          {/* New Sections Added Below the Intro Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 pt-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Vibha Realties?</h3>
              <div className="space-y-4 text-md text-gray-800 leading-relaxed">
                <p>
                  Real estate investment has always been a personal pursuit, shaped by first-hand experience as a buyer navigating the market. Those early property journeys revealed critical gaps — lack of transparency, limited advisory thinking, and a transactional mindset that often overlooked the client’s long-term interests.
                </p>
                <p className="font-medium text-(--color-accent)">
                  That experience became the catalyst for Vibha Realties.
                </p>
                <p>
                  At Vibha Realties, we operate with a Client-First philosophy, anchored in the belief that every transaction must be a balanced, win–win outcome for both buyer and seller. Real estate decisions are significant and deserve thoughtful guidance rooted in clarity, ethics, and long-term value.
                </p>
                <p>
                  Our approach goes beyond broking. We position ourselves as trusted advisors, enabling our clients to make confident, well-informed decisions aligned with their personal and investment goals.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">About Vibha Realties</h3>
              <div className="space-y-4 text-md text-gray-800 leading-relaxed">
                <p>
                  Founded in 2018, Vibha Realties was established with a clear vision — to offer knowledge-driven, transparent, and ethically grounded real estate advisory in Pune.
                </p>
                <p>
                  To build a strong professional foundation, the founder completed a Post Graduate Programme in Real Estate in 2017, followed by hands-on industry exposure with SquareYards, gaining deep insight into residential, commercial, and investment real estate.
                </p>
                <p className="font-medium text-(--color-accent)">
                  This was complemented by RERA certification in 2018.
                </p>
                <p>
                  Over the years, Vibha Realties has evolved into a trusted client partner, working closely with discerning homebuyers, investors, and reputed developers across Pune. Our developer collaborations include Amar Builders, Puranik Builders, Shapoorji Pallonji, Mantra, Godrej, Kalpataru, Yashada, and Kolte Patil, among others.
                </p>
              </div>
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
      <section className="relative py-16 md:py-24 overflow-hidden bg-(--color-primary)">
        <Container>
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-stretch">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Your Dream Property in Pune Starts Here
              </h1>
              <p className="text-lg text-gray-700 mb-4">
                With 8+ years of expertise, I&apos;ve helped over 40+ clients find their perfect home and guided investors to properties that deliver real returns. No pressure, just honest guidance tailored to your needs.
              </p> 
              <p className="text-lg text-gray-700 mb-8">
                From premium apartments in Baner to investment opportunities in Wakad, I know Pune&apos;s real estate market inside out. Let&apos;s find the property that fits your lifestyle, budget, and future goals.
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-(--color-accent) mb-2">
                    <CountUpNumber end={8} suffix="+" />
                  </div>
                  <p className="text-sm text-gray-700">Years of Trust</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-(--color-accent) mb-2">
                    <CountUpNumber end={40} suffix="+" />
                  </div>
                  <p className="text-sm text-gray-700">Families Helped</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-(--color-accent) mb-2">
                    <CountUpNumber end={14} suffix="+" />
                  </div>
                  <p className="text-sm text-gray-700">Successful Projects</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact">
                  <Button variant="primary" size="md" className="whitespace-nowrap">
                    <Image src="/whatsapp.svg" alt="WhatsApp" width={22} height={22} />
                    Let&apos;s Talk
                  </Button>
                </Link>
                <a href="#about" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors group">
                  <span className="text-base font-medium">Know more about me</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right - Form */}
            <div className="bg-(--color-secondary) border border-(--color-accent) p-6 rounded-xl shadow-sm flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Start Your Property Search Today
              </h2>
              <p className="text-gray-700 mb-6">
                Share your requirements and I&apos;ll send you curated options within 24 hours
              </p>
              <EnquiryForm whatsappNumber={WHATSAPP_NUMBER} areas={["Baner", "Pune City", "Wakad", "Hadapsar"]} />
            </div>
          </div>
        </Container>
      </section>

      {/* Areas I cover – CMS area cards with per-area broadcast / WhatsApp buttons */}
      <AreasSection />

      {/* Testimonials */}
      <section id="testimonials" className="scroll-mt-20 py-16 md:py-24 bg-(--color-primary)">
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
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { AnimatedAreaCards } from "@/components/AnimatedAreaCards";
import { ArrowRight, Phone } from "lucide-react";
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
          quality={85}
          sizes="100vw"
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
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact">
                  <Button variant="primary" size="md" className="whitespace-nowrap">
                    <Image src="/whatsapp.svg" alt="WhatsApp" width={22} height={22} />
                    Let's Talk
                  </Button>
                </Link>
                <Link href="/about" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors group">
                  <span className="text-base font-medium">Know more about me</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
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

      {/* My Expertise Section - Bento Box Design */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              My Expertise
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Premium residential assets, high-yield commercial spaces, and secure land investments backed by data-driven market analysis.
            </p>
          </div>

          <div className="mt-16 grid gap-4 sm:mt-8 lg:grid-cols-3 lg:grid-rows-2">
            {/* Box 1: Residential (Left - Tall) */}
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-4xl" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-lg lg:rounded-l-[2rem]">
                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                    Modern Living
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    Curated apartments and luxury villas selected for design, location, and lifestyle.
                  </p>
                </div>
                <div className="@container relative min-h-[30rem] w-full grow max-lg:mx-auto max-lg:max-w-sm">
                  <div className="absolute inset-x-4 top-4 bottom-0 overflow-hidden rounded-t-[8cqw] border-x-[1cqw] border-t-[1cqw] border-green-600/30 bg-green-600 shadow-xl">
                    <Image
                      src="/bento1.jpg"
                      alt="Modern Living - Residential Property"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-l-4xl" />
            </div>

            {/* Box 2: Commercial (Middle Top - Small) */}
            <div className="relative max-lg:row-start-1">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-4xl" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-lg max-lg:rounded-t-[2rem]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Commercial Yields</p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    Strategic office and retail spaces optimized for maximum rental returns and capital appreciation.
                  </p>
                </div>
                <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-6 max-lg:pb-12 sm:px-10 lg:pb-4">
                  {/* Yield Metrics Card */}
                  <div className="w-full max-lg:max-w-xs flex flex-col gap-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200/50">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Rental Yield</p>
                        <p className="text-2xl font-bold text-green-700">8.5%</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl" />
            </div>

            {/* Box 3: Land (Middle Bottom - Small) */}
            <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
              <div className="absolute inset-px rounded-lg bg-white" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-lg">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Verified Lands</p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    Litigation-free, high-potential plots in developing corridors.
                  </p>
                </div>
                <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2 px-6">
                  {/* Map UI */}
                  <div className="h-[min(152px,40cqw)] w-full bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 relative overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
                      {/* Map background pattern */}
                      <rect width="200" height="120" fill="#f0fdf4" />
                      
                      {/* Road lines */}
                      <line x1="0" y1="40" x2="200" y2="40" stroke="#d1fae5" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1="0" y1="80" x2="200" y2="80" stroke="#d1fae5" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1="50" y1="0" x2="50" y2="120" stroke="#d1fae5" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1="150" y1="0" x2="150" y2="120" stroke="#d1fae5" strokeWidth="2" strokeDasharray="4 4" />
                      
                      {/* Location pins */}
                      <g>
                        {/* Pin 1 */}
                        <circle cx="60" cy="35" r="8" fill="#10b981" opacity="0.2" />
                        <circle cx="60" cy="35" r="5" fill="#10b981" />
                        <circle cx="60" cy="35" r="2" fill="white" />
                        {/* Pulse animation */}
                        <circle cx="60" cy="35" r="8" fill="#10b981" opacity="0.3">
                          <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                        </circle>
                      </g>
                      
                      <g>
                        {/* Pin 2 */}
                        <circle cx="120" cy="50" r="8" fill="#059669" opacity="0.2" />
                        <circle cx="120" cy="50" r="5" fill="#059669" />
                        <circle cx="120" cy="50" r="2" fill="white" />
                        {/* Pulse animation */}
                        <circle cx="120" cy="50" r="8" fill="#059669" opacity="0.3">
                          <animate attributeName="r" values="8;12;8" dur="2s" begin="0.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" begin="0.5s" repeatCount="indefinite" />
                        </circle>
                      </g>
                      
                      <g>
                        {/* Pin 3 */}
                        <circle cx="160" cy="70" r="8" fill="#10b981" opacity="0.2" />
                        <circle cx="160" cy="70" r="5" fill="#10b981" />
                        <circle cx="160" cy="70" r="2" fill="white" />
                        {/* Pulse animation */}
                        <circle cx="160" cy="70" r="8" fill="#10b981" opacity="0.3">
                          <animate attributeName="r" values="8;12;8" dur="2s" begin="1s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" begin="1s" repeatCount="indefinite" />
                        </circle>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5" />
            </div>

            {/* Box 4: Advisory (Right - Tall) */}
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-4xl lg:rounded-r-4xl" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-lg max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]">
                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                    Smart Valuation
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                    We don't just sell; we analyze. Get accurate price modeling and future-growth projections before you invest.
                  </p>
                </div>
                <div className="relative min-h-[30rem] w-full grow">
                  <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-white shadow-lg border-2 border-green-600/20 outline outline-green-600/10">
                    <div className="flex bg-white border-b border-green-600/20">
                      <div className="-mb-px flex text-sm/6 font-medium">
                        <div className="border-r border-b border-r-green-600/20 border-b-green-600/30 bg-green-50/50 px-4 py-2 text-gray-900 font-semibold">
                          Deal Sheet
                        </div>
                        <div className="border-r border-green-600/20 px-4 py-2 text-gray-600">Analysis</div>
                      </div>
                    </div>
                    <div className="px-6 pt-6 pb-14">
                      {/* Deal Sheet UI Card */}
                      <div className="space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-green-600/10">
                          <span className="text-gray-600 text-sm">Projected ROI</span>
                          <span className="text-green-600 font-semibold text-lg">+12%</span>
                        </div>
                        <div className="flex items-center justify-between pb-3 border-b border-green-600/10">
                          <span className="text-gray-600 text-sm">Risk Profile</span>
                          <span className="text-gray-900 font-semibold">Low</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Legal Check</span>
                          <span className="text-green-600 font-semibold">Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-r-4xl" />
            </div>
          </div>
        </Container>
      </section>

      {/* Areas Served */}
      <section className="py-16 md:py-24 bg-gray-50">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Areas I Serve in Pune
          </h2>
          <p className="text-center text-gray-700 mb-4">
            Expertise across all major localities
          </p>

          <AnimatedAreaCards />
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

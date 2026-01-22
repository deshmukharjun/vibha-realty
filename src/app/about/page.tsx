import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Phone, ShieldCheck, MapPin, Clock, Home, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919881199152";

export default function About() {
  return (
    <>
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background image with soft overlay */}
        <Image
          src="/bgabout.jpg"
          alt="Background"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover opacity-100 pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-br opacity-70 from-green-50/100 via-white/90 to-green-50/100" />

        <Container maxWidth="lg">
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-14 items-stretch">
            
            {/* Image */}
            <div className="order-2 md:order-1 relative h-full min-h-[500px] md:min-h-[600px]">
              <Image
                src="/headshot.jpeg"
                alt="Charushila Bhalerao – Pune Real Estate Consultant"
                fill
                className="rounded-2xl object-cover shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
              />
            </div>

            {/* Content */}
            <div className="order-1 md:order-2 bg-white/10 backdrop-blur-xs border-2 border-white/40 p-6 rounded-xl shadow-xl">
              
              {/* Authority headline */}
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
              Hi, I'm Charushila Bhalerao
              </h1>

              {/* Human introduction */}
              <h2 className="mt-2 text-xl md:text-2xl font-medium text-gray-600">
                10+ Years of Trusted Real Estate Expertise in Pune, Maharashtra
              </h2>

              {/* Credibility chips */}
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="px-3 py-1 border border-gray-200 rounded-full">
                  Residential & Investment
                </span>
                <span className="px-3 py-1 border border-gray-200 rounded-full">
                  Pune Specialist
                </span>
                <span className="px-3 py-1 border border-gray-200 rounded-full">
                  Client-First Approach
                </span>
              </div>

              {/* Primary value paragraph */}
              <p className="mt-6 text-md text-gray-800 leading-relaxed">
                Over the last <b>10+ years</b>, I've helped over <b>365 families</b> find their dream homes in Pune's most sought-after neighborhoods. From first-time buyers navigating their way through Baner's premium apartments to seasoned investors building portfolios in Wakad.
              </p>

              {/* Philosophy / reassurance */}
              <p className="mt-4 text-md text-gray-800 leading-relaxed">
                <b>What sets me apart?</b> I believe property decisions should be based on what's right for you, not what's convenient for me. I take time to understand your lifestyle, budget, and long-term goals before suggesting any property.
              </p>

              {/* Additional paragraph */}
              <p className="mt-4 text-md text-gray-800 leading-relaxed">
                Whether you're looking for a cozy 2 BHK to start your family journey, a luxury villa for your forever home, or a strategic investment that builds wealth over time, I <b>bring deep market knowledge</b>, strong builder relationships, and a genuine commitment to your success.
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
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative h-64 md:h-80 w-full">
                <Image
                  src="/areas/residential_img1.jpg"
                  alt="Residential Properties"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Home className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Residential</h3>
                </div>
                <ul className="grid grid-cols-2 gap-3 text-gray-700">
                  <li> Apartments (2 BHK to 4 BHK)</li>
                  <li> Independent villas</li>
                  <li> Gated communities</li>
                  <li> Premium localities</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative h-64 md:h-80 w-full">
                <Image
                  src="/areas/investment_img1.jpg"
                  alt="Investment Properties"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Investment</h3>
                </div>
                <ul className="grid grid-cols-2 gap-3 text-gray-700">
                  <li> Rental properties</li>
                  <li> Investment plots</li>
                  <li> Commercial spaces</li>
                  <li> Pre-launch projects</li>
                </ul>
              </div>
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
              { title: "Honest Guidance", desc: "I focus on your needs, not commissions", icon: ShieldCheck },
              { title: "Local Expert", desc: "Deep knowledge of all Pune localities", icon: MapPin },
              { title: "Quick Response", desc: "Available 24/7 on WhatsApp and phone", icon: Clock },
            ].map((item, i) => {
              const IconComponent = item.icon;
              return (
                <div key={i} className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <IconComponent className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              );
            })}
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
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi Charushila, I am interested in a property`}>
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

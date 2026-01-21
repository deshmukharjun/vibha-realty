import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";

const AREAS = [
  { name: "Baner", desc: "Premium locality with modern amenities and good connectivity" },
  { name: "Wakad", desc: "Rapid growth area with excellent infrastructure and schools" },
  { name: "Hadapsar", desc: "IT hub with commercial and residential properties" },
  { name: "Kalyani Nagar", desc: "Upmarket area known for luxury apartments" },
  { name: "Koregaon Park", desc: "Established locality with heritage charm" },
  { name: "Kothrud", desc: "Central location with vibrant community" },
  { name: "Viman Nagar", desc: "Residential area near airport with good returns" },
  { name: "Pune City", desc: "CBD area with commercial and premium residential" },
];

export default function Areas() {
  return (
    <>
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Areas of Operation
          </h1>
          <p className="text-xl text-gray-700 mb-12">
            I specialize in all major areas of Pune. Each area has unique characteristics and investment potential.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {AREAS.map((area) => (
              <div key={area.name} className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{area.name}</h3>
                <p className="text-gray-700 mb-6">{area.desc}</p>
                <Link href="/contact">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    <Image src="/whatsapp.svg" alt="WhatsApp" width={16} height={16} />
                    Enquire About {area.name}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-green-600 text-white">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">
              Confused About Which Area?
            </h2>
            <p className="text-lg mb-8 text-green-100">
              Tell me your budget and requirements. I will suggest the best areas for you.
            </p>
            <div className="flex justify-center">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi Charushila, I am confused about which area to choose. Can you suggest?`}>
                <Button variant="outline" size="lg" className="group">
                  <Image src="/whatsapp.svg" alt="WhatsApp" width={20} height={20} className="group-hover:hidden" />
                  <Image src="/whatsapp_green.svg" alt="WhatsApp" width={20} height={20} className="hidden group-hover:inline-block" />
                  Get Personalized Suggestions
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

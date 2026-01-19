import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { PartnersList } from "@/components/PartnersList";

export default function Projects() {
  return (
    <>
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Projects & Channel Partners
          </h1>
          <p className="text-xl text-gray-700 mb-12">
            I work with leading builders and developers across Pune. Here are some of the major projects.
          </p>

          <PartnersList />
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <Container>
          <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Looking for a Specific Property?</h2>
            <p className="text-gray-600 mb-6">
              I have access to properties from all major builders and can help you find exactly what you are looking for.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="md">
                <Image src="/whatsapp.svg" alt="WhatsApp" width={20} height={20} />
                Send Enquiry
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

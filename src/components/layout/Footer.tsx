import { Container } from "@/components/ui/Container";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16 mb-16 md:mb-0">
      <Container>
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.svg"
                alt="Charushila Bhalerao"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <h3 className="font-bold text-white">Charushila Bhalerao</h3>
            </div>
            <p className="text-sm">
              Property consultant helping you find your perfect home in Pune.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-green-400">
                  About
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-green-400">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/areas" className="hover:text-green-400">
                  Areas
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Residential Properties</li>
              <li>Investment Opportunities</li>
              <li>Rental Properties</li>
              <li>Property Consultation</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Contact</h4>
            <p className="text-sm mb-2">Available on WhatsApp & Call</p>
            <p className="text-sm text-green-400 font-semibold">
              For enquiries, message us anytime
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 py-6 text-center text-sm">
          <p>
            &copy; {currentYear} Charushila Bhalerao. All rights reserved. | Privacy
            Policy
          </p>
        </div>
      </Container>
    </footer>
  );
}

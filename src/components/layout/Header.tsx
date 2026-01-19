import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Phone, Mail } from "lucide-react";

interface HeaderProps {
  whatsappNumber: string;
}

export function Header({ whatsappNumber }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Charushila Bhalerao"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <div>
              <h1 className="font-bold text-lg hidden text-black sm:block">Vibha Realties</h1>
              <p className="text-xs text-gray-600 hidden sm:block">
                Property Consultant
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-green-600 font-medium">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 font-medium">
              About
            </Link>
            <Link href="/projects" className="text-gray-700 hover:text-green-600 font-medium">
              Projects
            </Link>
            <Link href="/areas" className="text-gray-700 hover:text-green-600 font-medium">
              Areas
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-green-600 font-medium">
              Blog
            </Link>
            <Link href="/testimonials" className="text-gray-700 hover:text-green-600 font-medium">
              Testimonials
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:+${whatsappNumber}`}
              className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-green-600"
            >
              <Phone size={18} />
            </a>
          </div>
        </div>

        {/* Mobile menu */}
        <nav className="md:hidden flex flex-wrap gap-3 pb-3 text-sm">
          <Link href="/" className="text-gray-700 hover:text-green-600 font-medium">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-green-600 font-medium">
            About
          </Link>
          <Link href="/projects" className="text-gray-700 hover:text-green-600 font-medium">
            Projects
          </Link>
          <Link href="/areas" className="text-gray-700 hover:text-green-600 font-medium">
            Areas
          </Link>
          <Link href="/blog" className="text-gray-700 hover:text-green-600 font-medium">
            Blog
          </Link>
          <Link href="/testimonials" className="text-gray-700 hover:text-green-600 font-medium">
            Testimonials
          </Link>
        </nav>
      </Container>
    </header>
  );
}

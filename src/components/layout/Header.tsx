 'use client'

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  whatsappNumber: string;
}

export function Header({ whatsappNumber }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const linkBaseClasses = "font-medium transition-colors duration-150";

  const linkClasses = (href: string) =>
    `${linkBaseClasses} ${
      isActive(href)
        ? "text-green-700 font-semibold"
        : "text-gray-700 hover:text-green-600"
    }`;

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

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={linkClasses("/")}>
              Home
            </Link>
            <Link href="/about" className={linkClasses("/about")}>
              About
            </Link>
            <Link href="/projects" className={linkClasses("/projects")}>
              Projects
            </Link>
            <Link href="/areas" className={linkClasses("/areas")}>
              Areas
            </Link>
            <Link href="/blog" className={linkClasses("/blog")}>
              Blog
            </Link>
            <Link href="/testimonials" className={linkClasses("/testimonials")}>
              Testimonials
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <nav className="md:hidden pb-3 text-sm border-t border-gray-100">
            <ul className="flex flex-col gap-1 pt-3">
              <li>
                <Link
                  href="/"
                  className={`${linkClasses("/")} block px-1 py-1.5`}
                  onClick={() => setMobileOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`${linkClasses("/about")} block px-1 py-1.5`}
                  onClick={() => setMobileOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className={`${linkClasses("/projects")} block px-1 py-1.5`}
                  onClick={() => setMobileOpen(false)}
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/areas"
                  className={`${linkClasses("/areas")} block px-1 py-1.5`}
                  onClick={() => setMobileOpen(false)}
                >
                  Areas
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className={`${linkClasses("/blog")} block px-1 py-1.5`}
                  onClick={() => setMobileOpen(false)}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonials"
                  className={`${linkClasses("/testimonials")} block px-1 py-1.5`}
                  onClick={() => setMobileOpen(false)}
                >
                  Testimonials
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </Container>
    </header>
  );
}

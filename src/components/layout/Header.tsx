'use client'

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SmoothScrollLink } from "@/components/SmoothScrollLink";
import { Menu, X } from "lucide-react";

type SectionId = "about" | "areas" | "testimonials";

interface HeaderProps {
  whatsappNumber: string;
}

const SECTION_IDS: SectionId[] = ["about", "areas", "testimonials"];
const ACTIVE_LINE_OFFSET = 120;

export function Header({ whatsappNumber }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const updateActive = () => {
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= ACTIVE_LINE_OFFSET && bottom >= ACTIVE_LINE_OFFSET) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection(null);
    };
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [pathname]);

  const linkBaseClasses = "font-medium transition-colors duration-150";
  const activeClasses = "text-green-700 font-semibold";
  const inactiveClasses = "text-gray-700 hover:text-green-600";

  const isNavActive = (item: "home" | SectionId) => {
    if (pathname !== "/") return item === "home" && pathname === "/";
    if (item === "home") return activeSection === null;
    return activeSection === item;
  };

  const navLinkClasses = (item: "home" | SectionId) =>
    `${linkBaseClasses} ${isNavActive(item) ? activeClasses : inactiveClasses}`;

  const handleHomeClick = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== "/") return;
      e.preventDefault();
      const { gsap } = await import("gsap");
      const { ScrollToPlugin } = await import("gsap/ScrollToPlugin");
      gsap.registerPlugin(ScrollToPlugin);
      gsap.to(window, {
        duration: 1.2,
        scrollTo: 0,
        ease: "power2.inOut",
      });
    },
    [pathname]
  );

  return (
    <header className="bg-(--color-primary) border-b border-gray-200 border-b-[rgba(101,139,88,0.08)] sticky top-0 z-30">
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
            <Link href="/" className={navLinkClasses("home")} onClick={handleHomeClick}>
              Home
            </Link>
            <SmoothScrollLink href="/#about" className={navLinkClasses("about")}>
              About
            </SmoothScrollLink>
            <SmoothScrollLink href="/#areas" className={navLinkClasses("areas")}>
              Areas
            </SmoothScrollLink>
            <SmoothScrollLink href="/#testimonials" className={navLinkClasses("testimonials")}>
              Testimonials
            </SmoothScrollLink>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-[rgba(101,139,88,0.06)] focus:outline-none focus:ring-2 focus:ring-[rgba(101,139,88,0.2)]"
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
                  className={`${navLinkClasses("home")} block px-1 py-1.5`}
                  onClick={(e) => {
                    handleHomeClick(e);
                    setMobileOpen(false);
                  }}
                >
                  Home
                </Link>
              </li>
              <li>
                <SmoothScrollLink
                  href="/#about"
                  className={`${navLinkClasses("about")} block px-1 py-1.5`}
                  onClick={() => setMobileOpen(false)}
                >
                  About
                </SmoothScrollLink>
              </li>
              <li>
                <SmoothScrollLink
                  href="/#areas"
                  className={`${navLinkClasses("areas")} block px-1 py-1.5`}
                  onClick={() => setMobileOpen(false)}
                >
                  Areas
                </SmoothScrollLink>
              </li>
              <li>
                <SmoothScrollLink
                  href="/#testimonials"
                  className={`${navLinkClasses("testimonials")} block px-1 py-1.5`}
                  onClick={() => setMobileOpen(false)}
                >
                  Testimonials
                </SmoothScrollLink>
              </li>
            </ul>
          </nav>
        )}
      </Container>
    </header>
  );
}

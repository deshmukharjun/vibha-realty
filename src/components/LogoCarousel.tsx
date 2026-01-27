"use client";

import Image from "next/image";

const PUNE_INDUSTRIALISTS: { name: string; short: string; logoSrc: string }[] = [
  { name: "Bajaj", short: "Bajaj", logoSrc: "https://ui-avatars.com/api/?name=Bajaj&size=80&background=15803d&color=fff&bold=true" },
  { name: "Kalyani Group", short: "Kalyani", logoSrc: "https://ui-avatars.com/api/?name=Kalyani&size=80&background=166534&color=fff&bold=true" },
  { name: "Bharat Forge", short: "BFL", logoSrc: "https://placehold.co/80x80/15803d/ffffff?text=BFL&font=inter" },
  { name: "KPIT Technologies", short: "KPIT", logoSrc: "https://placehold.co/80x80/166534/ffffff?text=KPIT&font=inter" },
  { name: "Persistent Systems", short: "Persistent", logoSrc: "https://ui-avatars.com/api/?name=Persistent&size=80&background=15803d&color=fff&bold=true" },
  { name: "Tata Motors", short: "Tata", logoSrc: "https://placehold.co/80x80/14532d/ffffff?text=TATA&font=inter" },
  { name: "Thermax", short: "Thermax", logoSrc: "https://ui-avatars.com/api/?name=Thermax&size=80&background=166534&color=fff&bold=true" },
  { name: "Kolte-Patil", short: "K-P", logoSrc: "https://placehold.co/80x80/15803d/ffffff?text=KP&font=inter" },
  { name: "Paranjape Schemes", short: "PS", logoSrc: "https://ui-avatars.com/api/?name=PS&size=80&background=14532d&color=fff&bold=true" },
  { name: "Gera Developments", short: "Gera", logoSrc: "https://placehold.co/80x80/166534/ffffff?text=Gera&font=inter" },
  { name: "Symbiosis", short: "SIU", logoSrc: "https://ui-avatars.com/api/?name=SIU&size=80&background=15803d&color=fff&bold=true" },
  { name: "Finolex", short: "Finolex", logoSrc: "https://placehold.co/80x80/14532d/ffffff?text=Finolex&font=inter" },
];

function LogoItem({ name, logoSrc }: { name: string; short: string; logoSrc: string }) {
  return (
    <li className="flex-shrink-0 mx-6 md:mx-8 flex items-center gap-2 md:gap-3">
      <span className="font-bold text-green-700 text-sm md:text-base whitespace-nowrap">{name}</span>
      <div
        className="flex-shrink-0 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-md bg-gray-50 border border-green-200 overflow-hidden p-0.5"
        title={name}
        aria-hidden
      >
        <Image src={logoSrc} alt="" width={40} height={40} className="object-contain w-full h-full" unoptimized />
      </div>
    </li>
  );
}

export function LogoCarousel() {
  return (
    <div
      className="w-full flex flex-nowrap overflow-hidden logo-carousel-mask min-h-[4.5rem] py-4"
      aria-hidden
    >
      <ul className="flex items-center justify-start animate-infinite-scroll flex-nowrap [&>li]:flex-shrink-0">
        {PUNE_INDUSTRIALISTS.map((company) => (
          <LogoItem key={company.name} name={company.name} short={company.short} logoSrc={company.logoSrc} />
        ))}
        {PUNE_INDUSTRIALISTS.map((company) => (
          <LogoItem key={`dup-${company.name}`} name={company.name} short={company.short} logoSrc={company.logoSrc} />
        ))}
      </ul>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full border-t border-[#222] bg-[#050505] flex z-50">
      <Link
        href="/upload"
        className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 transition-colors ${
          pathname === "/upload"
            ? "bg-white text-black border-t-2 border-white"
            : "text-[#666] hover:text-white bg-black"
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={pathname === "/upload" ? "2.5" : "2"}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] uppercase">
          UPLOAD
        </span>
      </Link>

      <Link
        href="/catalog"
        className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 transition-colors ${
          pathname === "/catalog"
            ? "bg-white text-black border-t-2 border-white"
            : "text-[#666] hover:text-white bg-black"
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={pathname === "/catalog" ? "2.5" : "2"}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] uppercase">
          CATALOG
        </span>
      </Link>
    </nav>
  );
}

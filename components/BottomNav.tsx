"use client";

import Link from "next/link";
import { SelectProduct } from "@/lib/types/product.types";
import { usePathname } from "next/navigation";

interface CartItem {
  product: SelectProduct;
  quantity: number;
  fileId: number | null;
  fileName: string | null;
}

export default function BottomNav({
  cart = [],
  totalAmount,
  setShowReceipt,
}: {
  cart?: CartItem[];
  totalAmount?: number;
  setShowReceipt?: (value: boolean) => void;
}) {
  const pathname = usePathname();
  const hasItems = cart.length > 0;

  function formatPrice(cents: number): string {
    return `$${((cents || 0) / 100).toFixed(2)}`;
  }

  return (
    <div className="fixed bottom-0 w-full z-50 flex flex-col pointer-events-none">
      {/* 1. Animated Cart Section */}
      <div
        className={`
          pointer-events-auto
          transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]
          transform border-t border-[#333] bg-[#0a0a0a] 
          /* FIX: We add visibility-hidden when not in use to prevent click-blocking */
          ${
            hasItems
              ? "translate-y-0 opacity-100 visible"
              : "translate-y-full opacity-0 invisible h-0"
          } 
        `}
      >
        <section className="p-4 sm:p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#aaa]">
              {cart.length} ITEM{cart.length !== 1 ? "S" : ""} IN REQUEST
            </span>
            <span className="text-lg font-bold tracking-wider text-white">
              {formatPrice(totalAmount || 0)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowReceipt?.(true)}
            className="bg-white text-black px-6 py-3 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-zinc-200 active:scale-95 transition-all cursor-pointer border-none"
          >
            REVIEW_REQUEST
          </button>
        </section>
      </div>

      {/* 2. Primary Navigation */}
      <nav className="relative z-10 pointer-events-auto border-t border-[#222] bg-[#050505] flex">
        <Link
          href="/upload"
          className={`flex-1 py-5 flex flex-col items-center justify-center gap-2 transition-colors ${
            pathname === "/upload"
              ? "bg-white text-black"
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
          className={`flex-1 py-5 flex flex-col items-center justify-center gap-2 transition-colors ${
            pathname === "/catalog"
              ? "bg-white text-black"
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
    </div>
  );
}

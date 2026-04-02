"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-black border-b border-[#111] text-white font-mono fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link
            href="/admin/dashboard"
            className="font-bold text-lg tracking-tighter uppercase"
          >
            Drops_Admin
          </Link>

          <div className="flex gap-6">
            <Link
              href="/admin/dashboard"
              className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                isActive("/admin/dashboard")
                  ? "text-white border-b-2 border-white pb-1"
                  : "text-[#666] hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/inventory"
              className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                isActive("/admin/inventory")
                  ? "text-white border-b-2 border-white pb-1"
                  : "text-[#666] hover:text-white"
              }`}
            >
              Inventory
            </Link>
            <Link
              href="/admin/sales"
              className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                isActive("/admin/sales")
                  ? "text-white border-b-2 border-white pb-1"
                  : "text-[#666] hover:text-white"
              }`}
            >
              Sales
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-[10px] font-bold uppercase px-4 py-2 border border-[#222] hover:border-white transition-colors"
          >
            Exit_Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

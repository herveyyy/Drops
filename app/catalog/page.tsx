import Link from "next/link";

export default function CatalogDashboard() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col pt-4 pb-24">
      
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-8 py-4 border-b border-[#222]">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl sm:text-2xl font-black tracking-[0.2em] uppercase m-0 leading-none">
            DROPS
          </h1>
          <p className="text-[8px] sm:text-[9px] text-[#666] tracking-widest uppercase font-bold">
            GUEST TERMINAL V.0.0.4
          </p>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 pt-8 flex flex-col gap-10">
        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-end border-b border-[#222] pb-2">
            <h3 className="text-xs font-bold tracking-[0.25em] text-white uppercase">
              PRODUCT_CATALOG
            </h3>
            <span className="text-[9px] tracking-widest text-[#4f4] uppercase font-bold animate-pulse">
              INVENTORY_LIVE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
             {/* Sample Product item */}
             <div className="border border-[#222] bg-[#0a0a0a] p-6 hover:border-white transition-colors cursor-pointer flex flex-col gap-6 relative group">
                 <div className="h-40 bg-[#111] border border-[#333] flex items-center justify-center group-hover:border-[#666] transition-colors relative overflow-hidden">
                    <span className="text-[#333] text-[10px] tracking-widest font-bold uppercase z-10">IMAGE_FEED_UNAVAILABLE</span>
                    {/* Add some scanline aesthetic */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
                 </div>
                 <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold tracking-[0.15em] uppercase text-white">PREMIUM_PHOTO_PAPER</span>
                    <span className="text-[10px] text-[#888] tracking-widest font-bold">$12.99 // 200GSM</span>
                 </div>
                 <button className="border border-white p-3 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors w-full cursor-pointer touch-manipulation">
                    ADD_TO_REQUEST
                 </button>
             </div>

             <div className="border border-[#222] bg-[#0a0a0a] p-6 hover:border-white transition-colors cursor-pointer flex flex-col gap-6 relative group">
                 <div className="h-40 bg-[#111] border border-[#333] flex items-center justify-center group-hover:border-[#666] transition-colors relative overflow-hidden">
                    <span className="text-[#333] text-[10px] tracking-widest font-bold uppercase z-10">IMAGE_FEED_UNAVAILABLE</span>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
                 </div>
                 <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold tracking-[0.15em] uppercase text-white">MATTE_BUSINESS_CARD</span>
                    <span className="text-[10px] text-[#888] tracking-widest font-bold">$24.00 // 500 UNITS</span>
                 </div>
                 <button className="border border-white p-3 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors w-full cursor-pointer touch-manipulation">
                    ADD_TO_REQUEST
                 </button>
             </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation Grid */}
      <nav className="fixed bottom-0 w-full border-t border-[#222] bg-[#050505] flex z-50">

         <Link href="/upload" className="flex-1 py-4 flex flex-col items-center justify-center gap-2 text-[#666] hover:text-white transition-colors bg-[#000]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] uppercase">UPLOAD</span>
         </Link>

         {/* ACTIVE TAB */}
         <Link href="/catalog" className="flex-1 py-4 flex flex-col items-center justify-center gap-2 bg-white text-black border-t-2 border-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] uppercase">CATALOG</span>
         </Link>

      </nav>
    </div>
  );
}

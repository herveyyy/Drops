import Link from "next/link";

export default function UploadDashboard() {
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
        
        {/* System Readiness Block */}
        <section className="border border-[#222] bg-[#0a0a0a] p-6 sm:p-8 flex flex-col gap-6 relative">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-[17px] sm:text-xl font-bold tracking-[0.2em] uppercase text-white">
              WELCOME TO DROPS_STUDIO
            </h2>
            <p className="text-[#888] text-[10px] sm:text-xs tracking-widest uppercase">
              SYSTEM READY. PREPARE TO TRANSFER YOUR FILES.
            </p>
          </div>

          <button className="bg-white text-black w-full py-4 font-bold text-[11px] sm:text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#d0d0d0] transition-colors uppercase border-none cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            BEGIN_UPLOAD
          </button>

          <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2 border border-[#222] px-3 py-1.5 bg-[#000]">
             <span className="w-1.5 h-1.5 bg-[#fff] rounded-full animate-pulse"></span>
             <span className="text-[9px] tracking-widest uppercase font-bold text-[#aaa]">BUFFER: 3_FILES_STORED</span>
          </div>

          <div className="mt-2 border-t border-[#222] pt-4 flex gap-4 text-[10px] tracking-widest uppercase font-bold text-[#888] items-center">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
             <div className="flex flex-col">
               <span className="text-[#555] text-[8px]">SESSION STATUS</span>
               <span className="text-[#ccc]">GUEST_AUTHORIZED</span>
             </div>
          </div>
        </section>

        {/* Data Input Section */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-end border-b border-[#222] pb-2">
            <h3 className="text-xs font-bold tracking-[0.25em] text-white uppercase">
              FILE_TRANSFER
            </h3>
            <span className="text-[9px] tracking-widest text-[#666] uppercase font-bold">
              QUEUE_PENDING
            </span>
          </div>

          {/* Dropzone */}
          <div className="border border-dashed border-[#333] bg-[#0a0a0a] hover:bg-[#111] transition-colors p-12 sm:p-20 flex flex-col items-center justify-center gap-4 cursor-pointer mt-2">
             <div className="border border-[#444] p-3 text-[#a0a0a0]">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
             </div>
             <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-[13px] sm:text-sm font-bold tracking-[0.2em] text-white uppercase">DROP_PRINT_FILES_HERE</span>
                <span className="text-[9px] tracking-widest text-[#666] uppercase font-bold">SUPPORTED: PDF JPG PNG AI</span>
             </div>
          </div>

          {/* Uploaded Files Queue */}
          <div className="flex flex-col gap-3 mt-4">
            
            {/* File Item 1 */}
            <div className="border border-[#222] bg-[#0a0a0a] p-4 flex justify-between items-center group hover:border-[#444] transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                 <div className="border border-[#333] w-10 h-10 flex items-center justify-center text-[#888] bg-[#111]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                 </div>
                 <div className="flex flex-col gap-1.5">
                   <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-[#eee] uppercase m-0 leading-none">BUSINESS_CARD_V2.AI</p>
                   <p className="text-[8px] sm:text-[9px] tracking-widest text-[#666] uppercase m-0 font-bold">4.2 MB // LOCAL_STORAGE</p>
                 </div>
              </div>
              <div className="text-[#444] group-hover:text-white transition-colors border border-[#333] p-1.5">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
            </div>

            {/* File Item 2 */}
            <div className="border border-[#222] bg-[#0a0a0a] p-4 flex justify-between items-center group hover:border-[#444] transition-colors cursor-pointer">
               <div className="flex items-center gap-4">
                 <div className="border border-[#333] w-10 h-10 flex items-center justify-center text-[#888] bg-[#111]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                 </div>
                 <div className="flex flex-col gap-1.5">
                   <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-[#eee] uppercase m-0 leading-none">POSTER_PRINT_FINAL.JPG</p>
                   <p className="text-[8px] sm:text-[9px] tracking-widest text-[#666] uppercase m-0 font-bold">12.8 MB // LOCAL_STORAGE</p>
                 </div>
              </div>
              <div className="text-[#444] group-hover:text-white transition-colors border border-[#333] p-1.5">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
            </div>

          </div>

        </section>

      </main>

      {/* Bottom Navigation Grid */}
      <nav className="fixed bottom-0 w-full border-t border-[#222] bg-[#050505] flex z-50">

         <Link href="/upload" className="flex-1 py-4 flex flex-col items-center justify-center gap-2 bg-white text-black border-t-2 border-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] uppercase">UPLOAD</span>
         </Link>

         <Link href="/catalog" className="flex-1 py-4 flex flex-col items-center justify-center gap-2 text-[#666] hover:text-white transition-colors bg-[#000]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] uppercase">CATALOG</span>
         </Link>

      </nav>

    </div>
  );
}

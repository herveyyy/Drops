import { initializeGuest } from "@/app/actions";

export default function TerminalInit() {
  return (
    <form 
      className="min-h-[100dvh] bg-[#070707] text-white font-mono flex flex-col relative overflow-hidden" 
      action={initializeGuest}
    >
      {/* Top Bar */}
      <header className="flex justify-between items-center p-5 sm:p-8 text-[10px] sm:text-[11px] text-[#666] tracking-[0.2em] font-bold uppercase">
        <div className="flex items-center gap-2 sm:gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white sm:w-[18px] sm:h-[18px]">
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
          <span className="text-white hidden sm:inline-block">DROPS_NETWORK</span>
          <span className="text-white sm:hidden">DROPS</span>
        </div>
        <div className="opacity-80">GUEST_PORTAL</div>
      </header>

      {/* Main Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-10 sm:-mt-20 px-5 sm:px-8">
        <div className="max-w-[760px] w-full flex flex-col gap-8 sm:gap-12">
          
          {/* Header Block */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-bold text-[#888] tracking-[0.3em] uppercase">
              <div className="w-8 sm:w-12 h-[2px] bg-[#888]"></div>
              WELCOME_PROTOCOL
            </div>
            
            <h1 className="text-4xl sm:text-[4.5rem] font-black tracking-tighter text-white uppercase m-0 leading-[1.1] break-words">
              WELCOME_TO_<br className="sm:hidden" />DROPS
            </h1>
            
            <p className="text-[#888] text-xs sm:text-base leading-relaxed tracking-wider mt-1 sm:mt-2 max-w-[540px]">
              Please enter your name to connect to our local network. We will use this to remember your device and personalize your experience in the shop today.
            </p>
          </div>

          {/* Form Input Block */}
          <div className="flex flex-col gap-2 relative mt-4 sm:mt-8">
            <label className="text-[9px] sm:text-[10px] text-[#444] font-bold tracking-[0.2em] uppercase mb-1 sm:mb-2">
              YOUR_FIRST_NAME
            </label>
            
            <div className="relative border-b border-[#222] pb-3 sm:pb-4 flex items-center">
              <input 
                type="text" 
                name="subject_name"
                placeholder="ENTER NAME..." 
                className="w-full bg-transparent text-3xl sm:text-5xl font-bold uppercase tracking-[0.1em] text-white placeholder-[#1a1a1a] focus:outline-none"
                required
              />
              {/* Hide "CMD ENTER" hint on mobile since keyboards don't apply */}
              <div className="absolute right-0 hidden sm:flex items-center gap-2 text-[#333] text-[10px] tracking-widest font-bold">
                <span>⌘ ENTER</span>
              </div>
            </div>
            {/* Input Decorative Underlines */}
            <div className="flex gap-2 sm:gap-4 mt-2">
               <div className="w-8 sm:w-16 h-[2px] bg-[#222]"></div>
               <div className="w-8 sm:w-16 h-[2px] bg-[#222]"></div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-5 sm:p-8 flex justify-end sm:justify-between items-end pointer-events-none">
        
        {/* Bottom Left Tech Info (Hidden on Mobile for minimalist view) */}
        <div className="hidden sm:flex flex-col gap-1.5 text-[10px] text-[#444] tracking-[0.15em] font-bold uppercase">
          <p>LOCATION: DROPS_HQ</p>
          <p>STATUS: ONLINE_&_READY</p>
          <p>NETWORK: SECURE_CONNECTION</p>
        </div>

        {/* Bottom Right Continue Button */}
        <div className="relative pointer-events-auto group w-full sm:w-auto">
          {/* Decorative Corner Brackets */}
          <div className="absolute -top-[6px] -left-[6px] w-[10px] h-[10px] border-t-2 border-l-2 border-[#555] transition-colors duration-300 group-hover:border-white"></div>
          <div className="absolute -bottom-[6px] -left-[6px] w-[10px] h-[10px] border-b-2 border-l-2 border-[#555] transition-colors duration-300 group-hover:border-white"></div>
          <div className="absolute -top-[6px] -right-[6px] w-[10px] h-[10px] border-t-2 border-r-2 border-[#555] transition-colors duration-300 group-hover:border-white"></div>
          <div className="absolute -bottom-[6px] -right-[6px] w-[10px] h-[10px] border-b-2 border-r-2 border-[#555] transition-colors duration-300 group-hover:border-white"></div>
          
          {/* Full width on very tiny screens, auto width on larger */}
          <button type="submit" className="w-full sm:w-auto bg-white text-black font-bold uppercase text-[12px] sm:text-[13px] tracking-[0.2em] px-8 sm:px-10 py-4 sm:py-5 flex items-center justify-center gap-3 sm:gap-4 hover:bg-[#ccc] transition-colors cursor-pointer outline-none">
            CONTINUE
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>

      </div>
    </form>
  );
}

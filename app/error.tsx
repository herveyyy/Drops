"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("System Failure:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-4 font-mono">
      <div className="bg-[#050505] border border-[#ff3333] p-10 w-full max-w-[500px] flex flex-col gap-8 shadow-[0_0_20px_rgba(255,51,51,0.1)]">
        <div className="flex flex-col gap-2 border-b border-[#331111] pb-6">
          <h1 className="text-xl font-bold tracking-[0.2em] text-[#ff3333] uppercase m-0 animate-pulse">
            CRITICAL_SYSTEM_FAILURE
          </h1>
          <p className="text-[#666] text-xs tracking-widest uppercase m-0">
            System.Drops.v2 // Runtime Exception
          </p>
        </div>

        <div className="flex flex-col gap-4 text-xs sm:text-sm text-[#ccc] tracking-widest leading-relaxed uppercase">
          <p> FATAL_ERROR_ENCOUNTERED</p>
          <p className="text-[#ff5555] opacity-80">
            {" "}
            {error.message || "Unknown execution error."}
          </p>
          <p>
            {" "}
            Please contact the sector administrator or attempt a memory reset.
          </p>
        </div>

        <button
          onClick={() => reset()}
          className="mt-4 bg-[#ff3333] text-black font-bold uppercase text-xs tracking-[0.15em] p-4 border border-[#ff3333] hover:bg-transparent hover:text-[#ff3333] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          INITIATE_SYSTEM_RESET
        </button>
      </div>
    </main>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-4 font-mono">
      <div className="bg-[#050505] border border-[#222] p-10 w-full max-w-[500px] flex flex-col gap-8 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col gap-2 border-b border-[#222] pb-6">
          <h1 className="text-xl font-bold tracking-[0.2em] text-white uppercase m-0">
            ERR_404_NOT_FOUND
          </h1>
          <p className="text-[#666] text-xs tracking-widest uppercase m-0">
            System.Drops.v2 // Directory Error
          </p>
        </div>

        <div className="flex flex-col gap-4 text-xs sm:text-sm text-[#888] tracking-widest leading-relaxed uppercase">
          <p> TARGET_DIRECTORY_UNREACHABLE</p>
          <p>
            {" "}
            The sector you are attempting to access does not exist or has been
            wiped from the mainframe.
          </p>
        </div>

        <Link
          href="/"
          className="mt-4 bg-white text-black font-bold uppercase text-xs tracking-[0.15em] p-4 border border-white hover:bg-transparent hover:text-white transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-center"
        >
          RETURN_TO_BASE
        </Link>
      </div>
    </main>
  );
}

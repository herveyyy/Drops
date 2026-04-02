export default function AdminPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-4 font-mono">
      <div className="bg-[#050505] border border-[#222] p-10 w-full max-w-105 flex-col gap-10">
        {/* Header / Branding */}
        <div className="flex flex-col gap-2 border-b border-[#222] pb-6">
          <h1 className="text-xl font-bold m-0 tracking-[0.2em] text-white uppercase">
            DROPS_ADMIN_
          </h1>
          <p className="text-[#666] text-xs m-0 tracking-widest uppercase">
            System.Drops.v2 // Operator Access
          </p>
        </div>
      </div>
    </main>
  );
}

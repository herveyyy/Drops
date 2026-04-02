import { signIn } from "@/auth";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-4 font-mono">
      <div className="bg-[#050505] border border-[#222] p-10 w-full max-w-[420px] flex flex-col gap-10">
        {/* Header / Branding */}
        <div className="flex flex-col gap-2 border-b border-[#222] pb-6">
          <h1 className="text-xl font-bold m-0 tracking-[0.2em] text-white uppercase">
            DROPS_AUTH_
          </h1>
          <p className="text-[#666] text-xs m-0 tracking-widest uppercase">
            System.Drops.v2 // Operator Access
          </p>
        </div>

        <form
          className="flex flex-col gap-8"
          action={async (formData) => {
            "use server";
            await signIn("credentials", formData);
          }}
        >
          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label
              className="text-[10px] text-[#888] font-bold tracking-[0.1em] uppercase"
              htmlFor="email"
            >
              [ PARAM_01 ] EMAIL_IDENTIFIER
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="bg-transparent border border-[#222] px-4 py-3 text-white text-sm font-mono outline-none transition-colors duration-200 focus:border-white placeholder-[#333]"
              placeholder="user@sector.black"
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label
              className="text-[10px] text-[#888] font-bold tracking-[0.1em] uppercase"
              htmlFor="password"
            >
              [ PARAM_02 ] ACCESS_KEY
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="bg-transparent border border-[#222] px-4 py-3 text-white text-sm font-mono outline-none transition-colors duration-200 focus:border-white placeholder-[#333]"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="mt-4 bg-white text-black font-bold uppercase text-xs tracking-[0.15em] p-4 border border-white hover:bg-transparent hover:text-white transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            EXECUTE_LOGIN
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-6 border-t border-[#222] text-left">
          <p className="text-[#444] text-[9px] uppercase tracking-widest">
            SECURE_CONNECTION // ALL_ACTIONS_LOGGED
          </p>
        </div>
      </div>
    </main>
  );
}

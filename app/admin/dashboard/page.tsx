// app/admin/dashboard/page.tsx
import { db } from "@/db"; // Your drizzle connection
import { requests, users, files, guests } from "@/db/schema";
import { sql, count, sum } from "drizzle-orm";

export default async function AdminDashboard() {
  // Fetch Stats
  const [revenue] = await db.select({ value: sum(requests.totalAmount) }).from(requests);
  const [activeUsers] = await db.select({ value: count(users.id) }).from(users);
  const [queueCount] = await db.select({ value: count(requests.id) }).from(requests).where(sql`status = 'queued'`);
  
  // Fetch Recent Nodes (Guests with their latest request)
  const recentNodes = await db.select({
    name: guests.name,
    id: guests.id,
    status: requests.status,
    createdAt: requests.createdAt
  })
  .from(guests)
  .leftJoin(requests, sql`${guests.id} = ${requests.guestId}`)
  .limit(3);

  return (
    <div className="min-h-screen bg-black text-white font-mono p-8">
      {/* Top Header */}
      <header className="flex justify-between items-center mb-12 border-b border-[#222] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-[0.3em]">NEURAL_PRINT</h1>
          <p className="text-[#666] text-xs">OPERATOR_01 // SECTOR_BLACK</p>
        </div>
        <nav className="flex gap-8 text-xs tracking-widest text-[#888]">
          <span className="text-white border-b border-white pb-1 cursor-pointer">DASHBOARD</span>
          <span className="hover:text-white cursor-pointer transition-colors">FILES</span>
          <span className="hover:text-white cursor-pointer transition-colors">SALES</span>
          <span className="hover:text-white cursor-pointer transition-colors">TERMINAL</span>
        </nav>
      </header>

      <main className="grid grid-cols-12 gap-6">
        {/* Left Column: Metrics */}
        <div className="col-span-8 flex flex-col gap-6">
          <section className="bg-[#050505] border border-[#222] p-8 relative overflow-hidden">
            <span className="absolute top-4 right-4 text-[10px] text-green-500">+12.5% // DELTA_POS</span>
            <h2 className="text-[#666] text-[10px] tracking-[0.2em] mb-4">DAILY_REVENUE_METRICS</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold">{(revenue?.value || 0).toLocaleString()}</span>
              <span className="text-[#444] text-sm">CR_UNITS</span>
            </div>
            
            <div className="grid grid-cols-2 mt-10 gap-10 border-t border-[#111] pt-6">
              <div>
                <p className="text-[#666] text-[10px] mb-1">PRINT_SERVICES</p>
                <p className="text-xl">2,104.20</p>
              </div>
              <div>
                <p className="text-[#666] text-[10px] mb-1">RETAIL_MODULES</p>
                <p className="text-xl">1,378.30</p>
              </div>
            </div>
          </section>

          {/* Connected Nodes List */}
          <section>
             <h2 className="text-[#666] text-[10px] tracking-[0.2em] mb-4 flex justify-between">
               <span>CONNECTED_NODES</span>
               <span className="text-[#333]">SYNC_STATUS: REALTIME</span>
             </h2>
             <div className="flex flex-col gap-3">
               {recentNodes.map((node, i) => (
                 <div key={i} className="bg-[#050505] border border-[#222] p-4 flex justify-between items-center group hover:border-[#444] transition-colors">
                   <div className="flex gap-4 items-center">
                     <div className="w-10 h-10 bg-[#111] border border-[#222] flex items-center justify-center text-[#444]">
                       [ID]
                     </div>
                     <div>
                       <p className="text-sm uppercase tracking-wider">{node.name}</p>
                       <p className="text-[10px] text-[#444]">UID: 0X{node.id}...{i}K9</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] text-[#666] uppercase">ACTIVE_REQ</p>
                     <p className="text-[11px] text-white uppercase">{node.status || 'IDLE'}</p>
                   </div>
                   <div className="bg-[#111] border border-[#222] px-3 py-1 text-[9px] group-hover:border-white transition-colors">
                     CONNECTED
                   </div>
                 </div>
               ))}
             </div>
          </section>
        </div>

        {/* Right Column: Sidebar Stats */}
        <div className="col-span-4 flex flex-col gap-4">
          <div className="bg-[#050505] border border-[#222] p-6">
             <p className="text-[#666] text-[10px] tracking-widest mb-2">ACTIVE_USERS</p>
             <p className="text-4xl">{activeUsers.value}</p>
          </div>

          <div className="bg-[#050505] border border-[#222] p-6">
             <p className="text-[#666] text-[10px] tracking-widest mb-2">TASK_QUEUE</p>
             <p className="text-4xl">{queueCount.value}</p>
          </div>

          {/* Log List */}
          <div className="mt-4">
            <h2 className="text-[#666] text-[10px] tracking-[0.2em] mb-4">ARCHIVED_LOGS</h2>
            <div className="border-l border-[#111] pl-4 flex flex-col gap-6">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-5.25 top-1 w-2 h-2 bg-[#222] border border-black" />
                  <p className="text-[11px] font-bold uppercase">FILE_UPLOAD_{i}</p>
                  <p className="text-[9px] text-[#444]">LOG_883{i} // COMPLETED</p>
                  <p className="text-[10px] mt-1 text-white">120.00 CR</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 border border-[#222] py-2 text-[9px] text-[#666] hover:text-white hover:border-[#444]">
              ACCESS_FULL_HISTORY
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
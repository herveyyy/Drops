import { db } from "@/db";
import { requests, requestItems, files, guests } from "@/db/schema";
import Link from "next/link";
import { eq } from "drizzle-orm";
import AdminNavbar from "../AdminNavbar";

export default async function SalesPage() {
  // Fetch sales data from requests
  const salesData = await db
    .select({
      requestId: requests.id,
      guestName: guests.name,
      totalAmount: requests.totalAmount,
      status: requests.status,
      itemCount: requestItems.requestId,
      createdAt: requests.createdAt,
    })
    .from(requests)
    .leftJoin(guests, eq(requests.guestId, guests.id))
    .leftJoin(requestItems, eq(requests.id, requestItems.requestId));

  // Group by request to avoid duplicates
  const salesMap = new Map();
  salesData.forEach((sale) => {
    if (!salesMap.has(sale.requestId)) {
      salesMap.set(sale.requestId, {
        requestId: sale.requestId,
        guestName: sale.guestName || "Unknown",
        totalAmount: sale.totalAmount,
        status: sale.status,
        createdAt: sale.createdAt,
      });
    }
  });

  const uniqueSales = Array.from(salesMap.values());
  const totalRevenue = uniqueSales.reduce(
    (sum, sale) => sum + sale.totalAmount,
    0,
  );

  return (
    <>
      <AdminNavbar />
      <div className="h-screen bg-black text-white font-mono flex flex-col pt-16">
        {/* HEADER */}
        <div className="border-b border-[#111] p-10 pb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-black tracking-tighter uppercase">
              Sales_Analytics
            </h1>
            <Link
              href="/admin/dashboard"
              className="text-[10px] font-bold px-4 py-2 border border-[#222] hover:border-white transition-colors"
            >
              BACK_TO_DASHBOARD
            </Link>
          </div>
          <div className="flex gap-4">
            <div className="border border-[#222] px-4 py-1 text-[10px] font-bold">
              <span className="text-white">{uniqueSales.length}</span>
              _TOTAL_ORDERS
            </div>
            <div className="border border-[#222] px-4 py-1 text-[10px] font-bold">
              <span className="text-white">
                ₱{(totalRevenue / 100).toFixed(2)}
              </span>
              _REVENUE
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-10">
          {uniqueSales.length === 0 ? (
            <div className="text-[#666] text-center py-10">
              No sales recorded yet
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {uniqueSales.map((sale) => (
                <div
                  key={sale.requestId}
                  className="bg-[#050505] border border-[#181818] p-8 hover:border-white transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold uppercase text-white mb-2">
                        Order #{sale.requestId}
                      </h2>
                      <p className="text-[10px] text-[#666]">
                        Guest: {sale.guestName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-[#444] tracking-widest uppercase mb-1">
                        Amount
                      </p>
                      <p className="text-2xl font-bold">
                        ₱{(sale.totalAmount / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-[9px] text-[#666] uppercase tracking-widest mb-6">
                    <div>
                      <p className="text-[#444] mb-1">Status</p>
                      <p
                        className={`font-bold ${
                          sale.status === "completed"
                            ? "text-green-500"
                            : sale.status === "queued"
                              ? "text-yellow-500"
                              : "text-red-500"
                        }`}
                      >
                        {sale.status.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#444] mb-1">Date</p>
                      <p className="text-white">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button className="px-6 py-2 border border-[#222] text-[10px] font-bold hover:border-white transition-colors">
                    VIEW_DETAILS
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

import { getAllProducts } from "@/app/actions/product.actions";
import Link from "next/link";
import AdminNavbar from "../AdminNavbar";

export default async function InventoryPage() {
  const productList = await getAllProducts();

  return (
    <>
      <AdminNavbar />
      <div className="h-screen bg-black text-white font-mono flex flex-col pt-16">
        {/* HEADER */}
        <div className="border-b border-[#111] p-10 pb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-black tracking-tighter uppercase">
              Inventory_Manager
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
              <span className="text-white">{productList.length}</span>
              _TOTAL_PRODUCTS
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-10">
          <div className="grid grid-cols-1 gap-6">
            {productList.length === 0 ? (
              <div className="text-[#666] text-center py-10">
                No products found
              </div>
            ) : (
              productList.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#050505] border border-[#181818] p-8 hover:border-white transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold uppercase text-white mb-2">
                        {product.name}
                      </h2>
                      <p className="text-[10px] text-[#666]">
                        ID: {product.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-[#444] tracking-widest uppercase mb-1">
                        Price
                      </p>
                      <p className="text-2xl font-bold">
                        ₱{(product.price / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-[9px] text-[#666] uppercase tracking-widest">
                    <div>
                      <p className="text-[#444] mb-1">Created</p>
                      <p className="text-white">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#444] mb-1">Available</p>
                      <p
                        className={
                          product.isAvailable
                            ? "text-green-500 font-bold"
                            : "text-red-500 font-bold"
                        }
                      >
                        {product.isAvailable ? "YES" : "NO"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button className="px-6 py-2 border border-[#222] text-[10px] font-bold hover:border-white transition-colors">
                      EDIT
                    </button>
                    <button className="px-6 py-2 border border-red-900 text-red-600 text-[10px] font-bold hover:border-red-500 transition-colors">
                      DELETE
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
}

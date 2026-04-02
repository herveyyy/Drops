"use client";

import { useState } from "react";
import { SelectGuest } from "@/lib/types/guest.types";
import { getFilesByGuestId } from "@/app/actions/file.actions";
import AdminNavbar from "./AdminNavbar";

interface ClientFile {
  id: number;
  filename: string;
  mimeType: string;
  metadata: string | null;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface QueueItem {
  id: number;
  status: string;
  totalAmount: number;
  guestName: string;
  fileName: string;
  mimeType: string;
  params: string | null;
}

interface ClientDashboardProps {
  guests: SelectGuest[];
  products: Product[];
  queueItems: QueueItem[];
}

export default function ClientDashboard({
  guests,
  products,
  queueItems,
}: ClientDashboardProps) {
  const [selectedGuest, setSelectedGuest] = useState<SelectGuest | null>(
    guests.length > 0 ? guests[0] : null,
  );
  const [guestFiles, setGuestFiles] = useState<ClientFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [liveQueueState, setLiveQueueState] = useState<QueueItem[]>(queueItems);

  const handleExecuteQueue = (id: number) => {
    setLiveQueueState((prev) => prev.filter((item) => item.id !== id));
  };

  const handleGuestSelect = async (guest: SelectGuest) => {
    setSelectedGuest(guest);
    setLoading(true);
    try {
      const files = await getFilesByGuestId(guest.id);
      setGuestFiles(Array.isArray(files) ? files : []);
    } catch (error) {
      console.error("Failed to fetch files:", error);
      setGuestFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          price: product.price,
        },
      ];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const liveQueue = selectedGuest
    ? liveQueueState.filter((item) => item.guestName === selectedGuest.name)
    : liveQueueState;

  return (
    <>
      <AdminNavbar />
      <div className="h-screen bg-[#020202] text-white font-mono pt-16">
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
          {/* LEFT PANE */}
          <aside className="w-72 bg-[#070707] border-r border-[#111] p-6 flex flex-col overflow-y-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-black uppercase tracking-wider">
                OPERATOR_01
              </h1>
              <p className="text-[9px] text-[#777] tracking-widest uppercase">
                SECTOR_BLACK
              </p>
            </div>

            <nav className="flex flex-col gap-2 text-[10px] tracking-[0.2em] uppercase">
              {[
                { label: "Active_Queue", active: true },
                { label: "Archive", active: false },
                { label: "Inventory", active: false },
                { label: "Reports", active: false },
                { label: "System", active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`w-full text-left p-3 rounded-sm transition-colors ${
                    item.active
                      ? "bg-white text-black font-bold"
                      : "text-[#888] hover:text-white hover:bg-[#111]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-6 border-t border-[#111] pt-4">
              <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#888] mb-3">
                Guest_List
              </h2>
              <div className="flex flex-col gap-2">
                {guests.length === 0 ? (
                  <span className="text-[#666] text-[9px]">No guests</span>
                ) : (
                  guests.map((guest) => (
                    <button
                      key={guest.id}
                      onClick={() => handleGuestSelect(guest)}
                      className={`text-[10px] text-left p-2 rounded-sm transition-colors ${
                        selectedGuest?.id === guest.id
                          ? "bg-white text-black font-bold"
                          : "text-[#aaa] hover:bg-[#111] hover:text-white"
                      }`}
                    >
                      {guest.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* MAIN FEED */}
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase">
                  Queue_Live_Feed
                </h2>
                <p className="text-[9px] text-[#666] uppercase mt-1">
                  {selectedGuest
                    ? `Guest: ${selectedGuest.name}`
                    : "Select a guest"}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="border border-[#222] px-4 py-1 text-[10px] uppercase font-bold">
                  {liveQueue.length}_PENDING
                </div>
                <div className="border border-[#222] px-4 py-1 text-[10px] uppercase text-[#999]">
                  2_URGENT
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-[#666] text-center py-16">
                  Loading queue...
                </div>
              ) : liveQueue.length === 0 ? (
                <div className="text-[#666] text-center py-16">
                  {selectedGuest
                    ? "No queued files yet"
                    : "No live queue items"}
                </div>
              ) : (
                liveQueue.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="bg-[#0d0d0d] border border-[#222] p-5 flex justify-between items-center gap-6 hover:border-white transition-all"
                  >
                    <div className="flex gap-5 items-center flex-1">
                      <div className="w-12 h-12 bg-[#111] border border-[#333] flex items-center justify-center uppercase text-[10px] text-[#999]">
                        {(item.mimeType || "").split("/")[1] || "DATA"}
                      </div>
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-tight break-words">
                          {item.fileName || "Unnamed"}
                        </h3>
                        <div className="text-[9px] text-[#777] mt-1">
                          Source: {item.guestName || "-"} | Params:{" "}
                          {item.params || "A1 // GLOSS // 200GSM"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#888] uppercase">
                        Quote_Value
                      </span>
                      <div className="text-2xl font-black mt-1">
                        ₱{(item.totalAmount / 100).toFixed(2)}
                      </div>
                      <button
                        className="mt-3 w-full border border-white px-4 py-2 text-[10px] uppercase font-black hover:bg-white hover:text-black transition-colors"
                        onClick={() => handleExecuteQueue(item.id)}
                      >
                        Execute_Quote
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>

          {/* RIGHT UTILITY */}
          <aside className="w-80 bg-[#060606] border-l border-[#111] p-6 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase tracking-widest text-[#999]">
                Utility_Supply
              </h3>
              <span className="text-[#666]">SEARCH_DB</span>
            </div>

            <div className="space-y-3 mb-6 flex-1 overflow-y-auto">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#090909] border border-[#222] p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-[10px] uppercase font-bold">
                      {product.name}
                    </p>
                    <p className="text-[9px] text-[#888]">
                      ₱{(product.price / 100).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-2 py-1 text-xs uppercase border border-[#444] hover:border-white transition-colors"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-[#222] pt-4">
              <div className="text-[10px] uppercase text-[#888] tracking-widest mb-2 flex justify-between">
                <span>Active_Basket</span>
                <span className="text-red-500 cursor-pointer">Wipe_Data</span>
              </div>

              <div className="space-y-2 mb-4">
                {cart.length === 0 ? (
                  <p className="text-[#666] text-[9px]">Cart empty</p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-center text-[9px]"
                    >
                      <span>
                        {item.productName} x{item.quantity}
                      </span>
                      <span>
                        ₱{((item.price * item.quantity) / 100).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-white p-4 text-black">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold uppercase">
                    Total_Due
                  </span>
                  <span className="text-2xl font-black">
                    ₱{(cartTotal / 100).toFixed(2)}
                  </span>
                </div>
                <button
                  disabled={cart.length === 0}
                  className="w-full bg-black text-white py-3 text-[10px] uppercase font-bold hover:bg-[#111] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm_Payment
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

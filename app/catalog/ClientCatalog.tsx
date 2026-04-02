"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import type { SelectProduct } from "@/lib/types/product.types";
import type { SelectFile } from "@/lib/types/file.types";
import { submitOrderRequest } from "@/app/actions/request.actions";
import BottomNav from "@/components/BottomNav";

interface ClientCatalogProps {
  guestName: string;
  products: SelectProduct[];
  guestFiles: SelectFile[];
}

interface CartItem {
  product: SelectProduct;
  quantity: number;
  fileId: number | null;
  fileName: string | null;
}

function formatPrice(cents: number): string {
  return `PHP ${(cents / 100).toFixed(2)}`;
}

export default function ClientCatalog({
  guestName,
  products,
  guestFiles,
}: ClientCatalogProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  useEffect(() => {
    if (showReceipt) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showReceipt]);
  const addToCart = useCallback(
    (
      product: SelectProduct,
      fileId: number | null,
      fileName: string | null,
    ) => {
      setCart((prev) => {
        const existing = prev.find(
          (i) => i.product.id === product.id && i.fileId === fileId,
        );
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id && i.fileId === fileId
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          );
        }
        return [...prev, { product, quantity: 1, fileId, fileName }];
      });
    },
    [],
  );

  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (cart.length === 0) return;
    setSubmitting(true);

    try {
      const items = cart.map((item) => ({
        productId: item.product.id,
        fileId: item.fileId,
        quantity: item.quantity,
      }));

      await submitOrderRequest(items, totalAmount);
      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  }, [cart, totalAmount]);

  // ─── Submitted Success View ───────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col items-center justify-center p-8 gap-8">
        <div className="border border-[#333] bg-[#0a0a0a] max-w-lg w-full p-10 flex flex-col items-center gap-6 text-center">
          <div className="border border-[#333] w-16 h-16 flex items-center justify-center text-[#0f0]">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-[0.15em] uppercase">
            REQUEST_SUBMITTED
          </h2>
          <p className="text-[#888] text-[10px] tracking-widest uppercase leading-relaxed">
            YOUR ORDER HAS BEEN QUEUED AND WILL BE PROCESSED SHORTLY.
            <br />
            THANK YOU FOR USING DROPS_STUDIO.
          </p>
          <Link
            href="/"
            className="w-full bg-white text-black py-4 text-[11px] font-bold tracking-[0.2em] uppercase text-center hover:bg-[#ccc] transition-colors block"
          >
            RETURN_TO_TERMINAL
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col pt-4 pb-24">
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-8 py-4 border-b border-[#222]">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl sm:text-2xl font-black tracking-[0.2em] uppercase m-0 leading-none">
            DROPS
          </h1>
          <p className="text-[8px] sm:text-[9px] text-[#666] tracking-widest uppercase font-bold">
            PRODUCT CATALOG V.0.0.4
          </p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 border border-[#222] px-3 py-1.5 bg-black">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            <span className="text-[9px] tracking-widest uppercase font-bold text-[#aaa]">
              {guestName.toUpperCase()}
            </span>
          </div>
          {cart.length > 0 && (
            <button
              type="button"
              onClick={() => setShowReceipt(true)}
              className="border border-white bg-white text-black px-4 sm:px-6 py-1.5 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-transparent hover:text-white transition-colors cursor-pointer"
            >
              VIEW_RECEIPT ({cart.length})
            </button>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-300 w-full mx-auto px-4 sm:px-6 pt-8 flex flex-col gap-10">
        {/* Catalog Header */}
        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-end border-b border-[#222] pb-2">
            <h3 className="text-xs font-bold tracking-[0.25em] text-white uppercase">
              PRODUCT_CATALOG
            </h3>
            <span className="text-[9px] tracking-widest text-[#4f4] uppercase font-bold animate-pulse">
              INVENTORY_LIVE
            </span>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1  gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-[#222] bg-[#0a0a0a] p-6 hover:border-white transition-colors flex flex-col gap-6 relative group"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-bold tracking-[0.15em] uppercase text-white">
                    {product.name.toUpperCase().replace(/\s/g, "_")}
                  </span>
                  <span className="text-[10px] text-[#888] tracking-widest font-bold">
                    {formatPrice(product.price)} //{" "}
                    {product.specs ?? "STANDARD"}
                  </span>
                  {product.description && (
                    <span className="text-[9px] text-[#555] tracking-wider leading-relaxed mt-1">
                      {product.description.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Action button */}
                <button
                  type="button"
                  onClick={() => addToCart(product, null, null)}
                  className="border border-white p-3 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors w-full cursor-pointer touch-manipulation bg-transparent text-white"
                >
                  ADD_TO_CART
                </button>
              </div>
            ))}

            {products.length === 0 && (
              <div className="col-span-full border border-[#181818] bg-[#080808] p-12 flex items-center justify-center">
                <span className="text-[10px] tracking-widest text-[#444] uppercase font-bold">
                  NO_PRODUCTS_AVAILABLE
                </span>
              </div>
            )}
          </div>
        </section>
      </main>
      <BottomNav
        cart={cart}
        totalAmount={totalAmount}
        setShowReceipt={setShowReceipt}
      />
      {/* ─── Receipt Preview Modal ─────────────────────────────────── */}
      {showReceipt && (
        <div className="absolute inset-0 z-100 bg-[#050505] flex flex-col animate-in slide-in-from-bottom duration-500 ease-out">
          {/* Full Screen Header */}
          <div className="sticky top-0 z-10 bg-[#050505]/80 backdrop-blur-md border-b border-[#222] p-6 sm:p-8 flex flex-col gap-4">
            <div className="flex justify-between items-start max-w-4xl mx-auto w-full">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl sm:text-2xl font-black tracking-[0.3em] text-white uppercase">
                  DROPS_STUDIO
                </h3>
                <p className="text-[9px] tracking-[0.3em] text-[#666] uppercase font-bold">
                  UNOFFICIAL_RECEIPT_PREVIEW
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReceipt(false)}
                className="text-[#666] hover:text-white transition-colors bg-transparent border border-[#333] hover:border-white p-3 rounded-none cursor-pointer"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="flex gap-8 max-w-4xl mx-auto w-full text-[10px] tracking-[0.2em] text-[#555] uppercase font-bold">
              <span>GUEST: {guestName.toUpperCase()}</span>
              <span suppressHydrationWarning>
                DATE:{" "}
                {new Date().toISOString().split("T")[0].replace(/-/g, "/")}
              </span>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto pb-40">
            <div className="max-w-4xl mx-auto w-full">
              {/* Files Section */}
              <div className="border-b border-[#181818] p-6 sm:p-10 flex flex-col gap-6">
                <h4 className="text-[11px] font-bold tracking-[0.4em] text-[#444] uppercase">
                  01 // FILES_UPLOADED ({guestFiles.length})
                </h4>
                {guestFiles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {guestFiles.map((file, i) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-4 bg-[#0a0a0a] border border-[#181818] p-4 text-[10px]"
                      >
                        <span className="text-[#333] font-mono">
                          [{String(i + 1).padStart(2, "0")}]
                        </span>
                        <span className="text-[#ccc] font-bold tracking-widest uppercase flex-1 truncate">
                          {file.filename.toUpperCase().replace(/\s/g, "_")}
                        </span>
                        <span className="text-[#555] font-bold tracking-widest">
                          {(file.sizeBytes / 1024).toFixed(0)}KB
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-[9px] tracking-widest text-[#444] uppercase font-bold italic">
                    NO_FILES_DETECTED
                  </span>
                )}
              </div>

              {/* Items Section */}
              <div className="border-b border-[#181818] p-6 sm:p-10 flex flex-col gap-6">
                <h4 className="text-[11px] font-bold tracking-[0.4em] text-[#444] uppercase">
                  02 // REQUESTED_ITEMS ({cart.length})
                </h4>
                <div className="flex flex-col gap-4">
                  {cart.map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#181818] p-5 group hover:border-[#444] transition-colors"
                    >
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold tracking-[0.15em] text-white uppercase">
                          {item.product.name.toUpperCase().replace(/\s/g, "_")}
                        </span>
                        {item.fileName && (
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-[#444]" />
                            <span className="text-[9px] tracking-widest text-[#666] uppercase font-bold">
                              LINKED_FILE:{" "}
                              {item.fileName.toUpperCase().replace(/\s/g, "_")}
                            </span>
                          </div>
                        )}
                        <span className="text-[10px] tracking-widest text-[#555] uppercase font-bold">
                          QUANTITY: {item.quantity} @{" "}
                          {formatPrice(item.product.price)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <span className="text-lg font-bold tracking-tighter text-white">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(i)}
                          className="text-[#333] hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer p-2"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grand Total Area */}
              <div className="p-6 sm:p-10 flex flex-col sm:flex-row justify-between items-baseline sm:items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold tracking-[0.4em] text-[#444] uppercase">
                    03 // FINAL_ESTIMATE
                  </span>
                  <p className="text-[8px] tracking-widest text-[#333] uppercase font-bold mt-1">
                    *Taxes and shipping calculated at fulfillment
                  </p>
                </div>
                <span className="text-5xl sm:text-7xl font-black tracking-tighter text-white">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Fixed Action Bar */}
          <div className="fixed bottom-0 w-full bg-[#050505] border-t border-[#222] p-6">
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setShowReceipt(false)}
                className="order-2 sm:order-1 w-full border border-[#333] text-[#666] py-5 text-[11px] font-bold tracking-[0.3em] uppercase hover:border-white hover:text-white transition-all cursor-pointer bg-transparent"
              >
                BACK_TO_STUDIO
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="order-1 sm:order-2 w-full bg-white text-black py-5 text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-zinc-200 transition-all cursor-pointer border-none disabled:opacity-30 active:scale-[0.98]"
              >
                {submitting ? "UPLOADING_REQUEST..." : "SUBMIT_FINAL_ORDER"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { SelectProduct } from "@/lib/types/product.types";
import type { SelectFile } from "@/lib/types/file.types";
import { submitOrderRequest } from "@/app/actions";

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
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ClientCatalog({
  guestName,
  products,
  guestFiles,
}: ClientCatalogProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showFileSelect, setShowFileSelect] = useState<number | null>(null); // product id
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const addToCart = useCallback(
    (product: SelectProduct, fileId: number | null, fileName: string | null) => {
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
      setShowFileSelect(null);
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
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
          <div className="hidden sm:flex items-center gap-2 border border-[#222] px-3 py-1.5 bg-[#000]">
            <span className="w-1.5 h-1.5 bg-[#fff] rounded-full animate-pulse"></span>
            <span className="text-[9px] tracking-widest uppercase font-bold text-[#aaa]">
              {guestName.toUpperCase()}
            </span>
          </div>
          {cart.length > 0 && (
            <button
              type="button"
              onClick={() => setShowReceipt(true)}
              className="border border-[#fff] bg-white text-black px-4 sm:px-6 py-1.5 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-transparent hover:text-white transition-colors cursor-pointer"
            >
              VIEW_RECEIPT ({cart.length})
            </button>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 pt-8 flex flex-col gap-10">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-[#222] bg-[#0a0a0a] p-6 hover:border-white transition-colors flex flex-col gap-6 relative group"
              >
                {/* Image placeholder with scanlines */}
                <div className="h-40 bg-[#111] border border-[#333] flex items-center justify-center group-hover:border-[#666] transition-colors relative overflow-hidden">
                  <span className="text-[#333] text-[10px] tracking-widest font-bold uppercase z-10">
                    IMAGE_FEED_UNAVAILABLE
                  </span>
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
                </div>

                {/* Product info */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-bold tracking-[0.15em] uppercase text-white">
                    {product.name.toUpperCase().replace(/\s/g, "_")}
                  </span>
                  <span className="text-[10px] text-[#888] tracking-widest font-bold">
                    {formatPrice(product.price)} // {product.specs ?? "STANDARD"}
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
                  onClick={() => {
                    if (guestFiles.length > 0) {
                      setShowFileSelect(product.id);
                    } else {
                      addToCart(product, null, null);
                    }
                  }}
                  className="border border-white p-3 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors w-full cursor-pointer touch-manipulation bg-transparent text-white"
                >
                  ADD_TO_REQUEST
                </button>

                {/* File select dropdown */}
                {showFileSelect === product.id && (
                  <div className="absolute inset-0 bg-[#0a0a0a]/95 z-20 flex flex-col p-6 gap-3 border border-white">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white">
                      ATTACH_FILE:
                    </span>
                    <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-48">
                      {guestFiles.map((file) => (
                        <button
                          key={file.id}
                          type="button"
                          onClick={() =>
                            addToCart(product, file.id, file.filename)
                          }
                          className="border border-[#333] p-3 text-[10px] font-bold tracking-[0.15em] uppercase text-left hover:border-white hover:text-white transition-colors text-[#aaa] bg-transparent cursor-pointer"
                        >
                          {file.filename.toUpperCase().replace(/\s/g, "_")}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(product, null, null)}
                      className="border border-[#444] p-2 text-[9px] font-bold tracking-[0.2em] uppercase text-[#888] hover:text-white hover:border-white transition-colors mt-2 bg-transparent cursor-pointer"
                    >
                      SKIP_FILE_ATTACH
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFileSelect(null)}
                      className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#555] hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                )}
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

        {/* Cart preview strip */}
        {cart.length > 0 && (
          <section className="border border-[#333] bg-[#0a0a0a] p-4 sm:p-6 flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#aaa]">
                {cart.length} ITEM{cart.length !== 1 ? "S" : ""} IN REQUEST
              </span>
              <span className="text-lg font-bold tracking-wider text-white">
                {formatPrice(totalAmount)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowReceipt(true)}
              className="bg-white text-black px-6 py-3 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#ccc] transition-colors cursor-pointer border-none"
            >
              REVIEW_REQUEST
            </button>
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full border-t border-[#222] bg-[#050505] flex z-50">
        <Link
          href="/upload"
          className="flex-1 py-4 flex flex-col items-center justify-center gap-2 text-[#666] hover:text-white transition-colors bg-[#000]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] uppercase">
            UPLOAD
          </span>
        </Link>
        <Link
          href="/catalog"
          className="flex-1 py-4 flex flex-col items-center justify-center gap-2 bg-white text-black border-t-2 border-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] uppercase">
            CATALOG
          </span>
        </Link>
      </nav>

      {/* ─── Receipt Preview Modal ─────────────────────────────────── */}
      {showReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="border border-[#333] bg-[#0a0a0a] max-w-lg w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
            {/* Receipt Header */}
            <div className="border-b border-[#222] p-6 sm:p-8 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg sm:text-xl font-bold tracking-[0.1em] text-white uppercase">
                    DROPS_STUDIO
                  </h3>
                  <p className="text-[8px] tracking-widest text-[#666] uppercase font-bold">
                    UNOFFICIAL RECEIPT PREVIEW
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReceipt(false)}
                  className="text-[#666] hover:text-white transition-colors bg-transparent border-none cursor-pointer p-1"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="flex gap-6 mt-3 text-[9px] tracking-widest text-[#555] uppercase font-bold">
                <span>GUEST: {guestName.toUpperCase()}</span>
                <span>
                  DATE: {new Date().toISOString().split("T")[0]}
                </span>
              </div>
            </div>

            {/* Files Section */}
            <div className="border-b border-[#222] p-6 sm:p-8 flex flex-col gap-3">
              <h4 className="text-[10px] font-bold tracking-[0.25em] text-[#888] uppercase border-b border-[#1a1a1a] pb-2">
                FILES_UPLOADED ({guestFiles.length})
              </h4>
              {guestFiles.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {guestFiles.map((file, i) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 text-[10px]"
                    >
                      <span className="text-[#555] font-bold w-5 text-right">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[#ccc] font-bold tracking-[0.1em] uppercase flex-1">
                        {file.filename.toUpperCase().replace(/\s/g, "_")}
                      </span>
                      <span className="text-[#555] font-bold tracking-widest">
                        {(file.sizeBytes / 1024).toFixed(0)}KB
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-[9px] tracking-widest text-[#444] uppercase font-bold">
                  NO_FILES_UPLOADED
                </span>
              )}
            </div>

            {/* Items Section */}
            <div className="border-b border-[#222] p-6 sm:p-8 flex flex-col gap-3">
              <h4 className="text-[10px] font-bold tracking-[0.25em] text-[#888] uppercase border-b border-[#1a1a1a] pb-2">
                REQUESTED_ITEMS ({cart.length})
              </h4>
              <div className="flex flex-col gap-3">
                {cart.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-4 border border-[#181818] p-3 group"
                  >
                    <div className="flex flex-col gap-1.5 flex-1">
                      <span className="text-[11px] font-bold tracking-[0.12em] text-white uppercase">
                        {item.product.name
                          .toUpperCase()
                          .replace(/\s/g, "_")}
                      </span>
                      {item.fileName && (
                        <span className="text-[8px] tracking-widest text-[#666] uppercase font-bold">
                          FILE: {item.fileName.toUpperCase().replace(/\s/g, "_")}
                        </span>
                      )}
                      <span className="text-[9px] tracking-widest text-[#555] uppercase font-bold">
                        QTY: {item.quantity} × {formatPrice(item.product.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold tracking-wider text-white">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(i)}
                        className="text-[#555] hover:text-[#f33] transition-colors bg-transparent border-none cursor-pointer p-0.5 opacity-0 group-hover:opacity-100"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-b border-[#222] p-6 sm:p-8 flex justify-between items-center">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#888] uppercase">
                TOTAL_AMOUNT
              </span>
              <span className="text-2xl sm:text-3xl font-black tracking-wider text-white">
                {formatPrice(totalAmount)}
              </span>
            </div>

            {/* Actions */}
            <div className="p-6 sm:p-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-white text-black py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#ccc] transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "PROCESSING..." : "SUBMIT_FINAL_ORDER"}
              </button>
              <button
                type="button"
                onClick={() => setShowReceipt(false)}
                className="w-full border border-[#444] text-[#aaa] py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:border-white hover:text-white transition-colors cursor-pointer bg-transparent"
              >
                CONTINUE_SHOPPING
              </button>
              <p className="text-[8px] tracking-widest text-[#444] uppercase font-bold text-center mt-2">
                THIS IS NOT AN OFFICIAL RECEIPT. FINAL PRICING MAY VARY.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

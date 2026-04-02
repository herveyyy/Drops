"use client";

import { useEffect, useMemo, useState } from "react";
import { archiveGuest } from "@/app/actions/guest.actions";
import { getFilesByGuestId } from "@/app/actions/file.actions";
import {
  completePayment,
  createAdminRequest,
  updateAdminBillLines,
} from "@/app/actions/request.actions";
import OperatorModal from "@/components/OperatorModal";
import { SelectGuest } from "@/lib/types/guest.types";
import { QueueItem } from "@/lib/types/request.types";
import AdminNavbar from "./AdminNavbar";

interface ClientFile {
  id: number;
  filename: string;
  mimeType: string;
  metadata: string | null;
}

interface CartQueueItem extends QueueItem {
  editablePrice: number;
}

interface DraftBillItem {
  id: string;
  fileId: number;
  fileName: string;
  totalPrice: number;
  serviceLabel: string;
  serviceSpecs: string;
}

interface OrderFeedGroup {
  id: number;
  guestName: string;
  totalAmount: number;
  files: Array<{
    fileId: number;
    fileName: string;
    mimeType: string | null;
    params: string | null;
  }>;
  billLines: Array<{
    key: string;
    title: string;
    quantity: number;
    lineAmount: number;
    linkedFileName: string | null;
    specs: string | null;
    isManual: boolean;
  }>;
}

interface ClientDashboardProps {
  guests: SelectGuest[];
  queueItems: QueueItem[];
}

function formatPeso(cents: number) {
  return `PHP ${(cents / 100).toFixed(2)}`;
}

function getQueueItemTitle(item: QueueItem) {
  if (item.serviceLabel) return item.serviceLabel;
  if (item.productName) return item.productName;
  if (item.fileName) return item.fileName;
  return "Unnamed Line";
}

export default function ClientDashboard({
  guests,
  queueItems,
}: ClientDashboardProps) {
  const [guestList, setGuestList] = useState<SelectGuest[]>(guests);
  const [selectedGuest, setSelectedGuest] = useState<SelectGuest | null>(
    guests[0] ?? null,
  );
  const [guestFiles, setGuestFiles] = useState<ClientFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartQueueItem[]>([]);
  const [draftBillItems, setDraftBillItems] = useState<DraftBillItem[]>([]);
  const [liveQueueState, setLiveQueueState] = useState<QueueItem[]>(queueItems);
  const [showOperatorModal, setShowOperatorModal] = useState(false);

  useEffect(() => {
    setGuestList(guests);
    setSelectedGuest((current) => {
      if (current && guests.some((guest) => guest.id === current.id)) {
        return current;
      }
      return guests[0] ?? null;
    });
  }, [guests]);

  useEffect(() => {
    const loadSelectedGuestFiles = async () => {
      if (!selectedGuest) {
        setGuestFiles([]);
        return;
      }

      setLoading(true);
      try {
        const files = await getFilesByGuestId(selectedGuest.id);
        setGuestFiles(Array.isArray(files) ? files : []);
      } catch (error) {
        console.error("Failed to fetch files:", error);
        setGuestFiles([]);
      } finally {
        setLoading(false);
      }
    };

    void loadSelectedGuestFiles();
  }, [selectedGuest]);

  useEffect(() => {
    if (!selectedGuest) {
      setCart([]);
      setDraftBillItems([]);
      return;
    }

    const guestQueue = liveQueueState.filter(
      (item) => item.guestName === selectedGuest.name,
    );

    setCart(
      guestQueue.map((item) => ({
        ...item,
        editablePrice: item.lineAmount ?? item.totalAmount,
      })),
    );
    setDraftBillItems([]);
  }, [selectedGuest, liveQueueState]);

  const handleGuestSelect = (guest: SelectGuest) => setSelectedGuest(guest);

  const handleArchiveGuest = async (guest: SelectGuest) => {
    const confirmed = window.confirm(`Archive guest ${guest.name}?`);
    if (!confirmed) return;

    try {
      await archiveGuest(guest.id);
      setGuestList((prev) => {
        const remaining = prev.filter((item) => item.id !== guest.id);
        setSelectedGuest((current) =>
          current?.id === guest.id ? (remaining[0] ?? null) : current,
        );
        return remaining;
      });
      setLiveQueueState((prev) =>
        prev.filter((item) => item.guestName !== guest.name),
      );
    } catch (error) {
      console.error("Failed to archive guest:", error);
      alert("Failed to archive guest. Please try again.");
    }
  };

  const updateCartPrice = (requestItemId: number, newPrice: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.requestItemId === requestItemId
          ? { ...item, editablePrice: newPrice }
          : item,
      ),
    );
  };

  const addDraftBillItem = (file: ClientFile) => {
    setDraftBillItems((prev) => [
      ...prev,
      {
        id: `${file.id}-${Date.now()}-${prev.length}`,
        fileId: file.id,
        fileName: file.filename,
        totalPrice: 0,
        serviceLabel: "Print Service",
        serviceSpecs: "",
      },
    ]);
  };

  const updateDraftBillItem = (
    draftId: string,
    patch: Partial<DraftBillItem>,
  ) => {
    setDraftBillItems((prev) =>
      prev.map((item) => (item.id === draftId ? { ...item, ...patch } : item)),
    );
  };

  const removeDraftBillItem = (draftId: string) => {
    setDraftBillItems((prev) => prev.filter((item) => item.id !== draftId));
  };

  const handleConfirmPayment = () => setShowOperatorModal(true);

  const handleOperatorConfirm = async (operatorName: string) => {
    if (!selectedGuest) return;

    try {
      const changedQueuedItems = cart
        .filter(
          (item) =>
            item.fileId != null &&
            item.requestItemId != null &&
            item.editablePrice !== (item.lineAmount ?? item.totalAmount),
        )
        .map((item) => ({
          requestItemId: item.requestItemId,
          unitPrice: Math.round(
            (item.editablePrice ?? 0) / (item.quantity ?? 1),
          ),
        }));

      if (changedQueuedItems.length > 0) {
        await updateAdminBillLines(changedQueuedItems);
      }

      const requestIds = new Set(cart.map((item) => item.id));

      if (draftBillItems.length > 0) {
        const manualTotal = draftBillItems.reduce(
          (sum, item) => sum + item.totalPrice,
          0,
        );
        const manualRequest = await createAdminRequest(
          selectedGuest.id,
          draftBillItems.map((item) => ({
            fileId: item.fileId,
            quantity: 1,
            unitPrice: item.totalPrice,
            serviceLabel: item.serviceLabel || "Print Service",
            serviceSpecs: item.serviceSpecs || null,
          })),
          manualTotal,
        );
        requestIds.add(manualRequest.id);
      }

      await completePayment([...requestIds], operatorName);
      setCart([]);
      setDraftBillItems([]);
      setLiveQueueState((prev) =>
        prev.filter((item) => !requestIds.has(item.id)),
      );
      alert("Payment completed successfully.");
    } catch (error) {
      console.error("Failed to complete payment:", error);
      alert("Failed to complete payment. Please try again.");
    }
  };

  const visibleQueue = selectedGuest
    ? liveQueueState.filter((item) => item.guestName === selectedGuest.name)
    : liveQueueState;

  const orderFeed = useMemo(
    () =>
      Object.values(
        visibleQueue.reduce<Record<number, OrderFeedGroup>>((acc, item) => {
          if (!acc[item.id]) {
            acc[item.id] = {
              id: item.id,
              guestName: item.guestName,
              totalAmount: item.totalAmount,
              files: [],
              billLines: [],
            };
          }

          const order = acc[item.id];

          if (
            item.fileId != null &&
            !order.files.some((file) => file.fileId === item.fileId)
          ) {
            order.files.push({
              fileId: item.fileId,
              fileName: item.fileName || "Unnamed File",
              mimeType: item.mimeType || null,
              params: item.params || null,
            });
          }

          order.billLines.push({
            key: `${item.requestItemId}`,
            title: getQueueItemTitle(item),
            quantity: item.quantity ?? 1,
            lineAmount: item.lineAmount ?? item.totalAmount,
            linkedFileName: item.fileName || null,
            specs: item.serviceSpecs || null,
            isManual: item.productId == null,
          });

          return acc;
        }, {}),
      ),
    [visibleQueue],
  );

  const draftTotal = draftBillItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0,
  );
  const queuedTotal = cart.reduce((sum, item) => sum + item.editablePrice, 0);
  const cartTotal = queuedTotal + draftTotal;

  return (
    <>
      <AdminNavbar />
      <OperatorModal
        isOpen={showOperatorModal}
        onClose={() => setShowOperatorModal(false)}
        onConfirm={handleOperatorConfirm}
      />
      <div className="h-screen bg-[#020202] text-white font-mono pt-16">
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
          <aside className="w-72 bg-[#070707] border-r border-[#111] p-6 flex flex-col overflow-y-auto">
            <div>
              <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#888] mb-3">
                Guest_List
              </h2>
              <div className="flex flex-col gap-2">
                {guestList.length === 0 ? (
                  <span className="text-[#666] text-[9px]">No guests</span>
                ) : (
                  guestList.map((guest) => (
                    <div
                      key={guest.id}
                      className={`flex items-center gap-2 rounded-sm ${
                        selectedGuest?.id === guest.id
                          ? "bg-white text-black"
                          : "bg-transparent"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleGuestSelect(guest)}
                        className={`flex-1 text-[10px] text-left p-2 rounded-sm transition-colors ${
                          selectedGuest?.id === guest.id
                            ? "text-black font-bold"
                            : "text-[#aaa] hover:bg-[#111] hover:text-white"
                        }`}
                      >
                        {guest.name}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleArchiveGuest(guest)}
                        className={`mr-2 px-2 py-1 text-[9px] border transition-colors ${
                          selectedGuest?.id === guest.id
                            ? "border-black text-black hover:bg-black hover:text-white"
                            : "border-[#444] text-[#888] hover:border-red-400 hover:text-red-400"
                        }`}
                      >
                        ARCHIVE
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>

          <main className="flex-1 p-6 overflow-y-auto">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase">
                  ORDERS_FEED
                </h2>
                <p className="text-[9px] text-[#666] uppercase mt-1">
                  {selectedGuest
                    ? `Selected Guest: ${selectedGuest.name}`
                    : "All guests"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {selectedGuest && (
                <div className="border border-[#222] rounded bg-[#090909] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#1b1b1b] flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#888]">
                        UPLOADED_FILES
                      </h3>
                      <p className="text-[9px] text-[#555] uppercase mt-1">
                        Add uploaded files to the cashier bill even without a
                        product
                      </p>
                    </div>
                    <span className="text-[10px] text-white font-bold">
                      {guestFiles.length}
                    </span>
                  </div>

                  {guestFiles.length === 0 ? (
                    <p className="text-[#666] text-[9px] p-4">
                      No uploaded files for this guest
                    </p>
                  ) : (
                    <ul className="divide-y divide-[#141414]">
                      {guestFiles.map((file) => (
                        <li
                          key={file.id}
                          className="p-4 flex items-center justify-between gap-4"
                        >
                          <div className="min-w-0">
                            <p className="text-[11px] text-[#eee] font-bold uppercase break-all">
                              {file.filename}
                            </p>
                            <p className="text-[9px] text-[#666] uppercase mt-1">
                              {(file.mimeType || "file").replace("/", " / ")}
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => addDraftBillItem(file)}
                              className="px-3 py-1 text-[10px] border border-white hover:bg-white hover:text-black transition-colors"
                            >
                              ADD_TO_BILL
                            </button>
                            <a
                              href={`/api/files/${file.id}/download`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 text-[10px] border border-[#999] hover:bg-[#999] hover:text-black transition-colors"
                            >
                              DOWNLOAD
                            </a>
                            <button
                              type="button"
                              onClick={() =>
                                window.open(
                                  `/api/files/${file.id}/download?inline=1`,
                                  "_blank",
                                )
                              }
                              className="px-3 py-1 text-[10px] border border-[#999] hover:bg-[#999] hover:text-black transition-colors"
                            >
                              PREVIEW
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {loading ? (
                <div className="text-[#666] text-center py-16">
                  Loading guest files...
                </div>
              ) : orderFeed.length === 0 ? (
                <div className="text-[#666] text-center py-16">
                  No queued orders found
                </div>
              ) : (
                orderFeed.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#0d0d0d] border border-[#222] p-5 hover:border-white transition-all"
                  >
                    <div className="flex flex-col gap-5">
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <p className="text-[9px] text-[#777] uppercase tracking-[0.25em]">
                            Request #{order.id}
                          </p>
                          <h3 className="text-2xl font-black uppercase tracking-tight break-all mt-2">
                            {order.guestName}
                          </h3>
                          <p className="text-[9px] text-[#666] uppercase mt-2">
                            {order.files.length} file
                            {order.files.length === 1 ? "" : "s"} linked |{" "}
                            {order.billLines.length} bill line
                            {order.billLines.length === 1 ? "" : "s"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-[#888] uppercase">
                            Total
                          </span>
                          <div className="text-2xl font-black mt-1">
                            {formatPeso(order.totalAmount)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <section className="border border-[#1d1d1d] bg-[#090909] p-4">
                          <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#888] mb-3">
                            FILES_UPLOADED
                          </h4>
                          {order.files.length === 0 ? (
                            <p className="text-[#666] text-[9px]">
                              No file linked to this request
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {order.files.map((file) => (
                                <div
                                  key={file.fileId}
                                  className="border border-[#181818] bg-black/30 p-3"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="text-[11px] font-bold text-[#eee] uppercase break-all">
                                        {file.fileName}
                                      </p>
                                      <p className="text-[9px] text-[#666] uppercase mt-1">
                                        {(file.mimeType || "file").replace(
                                          "/",
                                          " / ",
                                        )}
                                      </p>
                                      {file.params && (
                                        <p className="text-[9px] text-[#555] mt-2 break-all">
                                          {file.params}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                      <a
                                        href={`/api/files/${file.fileId}/download`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-3 py-1 text-[10px] border border-[#999] hover:bg-[#999] hover:text-black transition-colors"
                                      >
                                        DOWNLOAD
                                      </a>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          window.open(
                                            `/api/files/${file.fileId}/download?inline=1`,
                                            "_blank",
                                          )
                                        }
                                        className="px-3 py-1 text-[10px] border border-[#999] hover:bg-[#999] hover:text-black transition-colors"
                                      >
                                        PREVIEW
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </section>

                        <section className="border border-[#1d1d1d] bg-[#090909] p-4">
                          <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#888] mb-3">
                            BILL_LINES
                          </h4>
                          {order.billLines.length === 0 ? (
                            <p className="text-[#666] text-[9px]">
                              No bill lines in this request
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {order.billLines.map((line) => (
                                <div
                                  key={line.key}
                                  className="border border-[#181818] bg-black/30 p-3 flex items-start justify-between gap-4"
                                >
                                  <div className="min-w-0">
                                    <p className="text-[11px] font-bold text-[#eee] uppercase break-all">
                                      {line.title}
                                    </p>
                                    <p className="text-[9px] text-[#666] uppercase mt-1">
                                      Qty {line.quantity} |{" "}
                                      {line.isManual
                                        ? "Manual print line"
                                        : "Catalog line"}
                                    </p>
                                    <p className="text-[9px] text-[#555] uppercase mt-2 break-all">
                                      {line.linkedFileName
                                        ? `Linked file: ${line.linkedFileName}`
                                        : "No file linked"}
                                    </p>
                                    {line.specs && (
                                      <p className="text-[9px] text-[#555] mt-1 break-all">
                                        {line.specs}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-[9px] text-[#666] uppercase">
                                      Line Total
                                    </p>
                                    <p className="text-lg font-black text-white mt-1">
                                      {formatPeso(line.lineAmount)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </section>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>

          <aside className="w-96 bg-[#060606] border-l border-[#111] p-6 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase tracking-widest text-[#999]">
                Cashier_Bill
              </h3>
              <span className="text-[#666]">
                {selectedGuest ? selectedGuest.name : "No guest"}
              </span>
            </div>

            <div className="border-t border-[#222] pt-4">
              <div className="text-[10px] uppercase text-[#888] tracking-widest mb-2 flex justify-between">
                <span>Queued_Items</span>
                <span>{cart.length}</span>
              </div>

              <div className="space-y-2 mb-5">
                {cart.length === 0 ? (
                  <p className="text-[#666] text-[9px]">No queued bill lines</p>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={`${item.requestItemId}-${idx}`}
                      className="border border-[#1b1b1b] bg-[#0a0a0a] p-3"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <span className="block text-[10px] text-white font-bold uppercase break-all">
                            {getQueueItemTitle(item)}
                          </span>
                          <span className="block text-[#666] uppercase mt-1 text-[9px]">
                            {item.fileId != null
                              ? "Print cost editable"
                              : "Product price fixed"}
                          </span>
                          {item.fileName && (
                            <span className="block text-[#555] mt-1 text-[9px] uppercase break-all">
                              File: {item.fileName}
                            </span>
                          )}
                        </div>
                        {item.fileId != null ? (
                          <input
                            type="number"
                            value={(item.editablePrice / 100).toFixed(2)}
                            onChange={(e) => {
                              const value = Math.round(
                                parseFloat(e.target.value || "0") * 100,
                              );
                              updateCartPrice(
                                item.requestItemId,
                                Number.isNaN(value) ? 0 : value,
                              );
                            }}
                            className="w-24 bg-[#111] border border-[#333] text-[9px] px-2 py-1 text-right"
                            step="0.01"
                          />
                        ) : (
                          <span className="w-24 text-right text-[#aaa] font-bold text-[10px]">
                            {formatPeso(item.lineAmount ?? item.totalAmount)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="text-[10px] uppercase text-[#888] tracking-widest mb-2 flex justify-between">
                <span>Draft_Print_Lines</span>
                <span>{draftBillItems.length}</span>
              </div>

              <div className="space-y-3 mb-4">
                {draftBillItems.length === 0 ? (
                  <p className="text-[#666] text-[9px]">
                    Add uploaded files from the main feed to build a manual
                    print bill
                  </p>
                ) : (
                  draftBillItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-[#1b1b1b] bg-[#0a0a0a] p-3 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] text-white font-bold uppercase break-all">
                            {item.fileName}
                          </p>
                          <p className="text-[9px] text-[#666] uppercase mt-1">
                            File-only cashier charge
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDraftBillItem(item.id)}
                          className="text-[9px] text-red-400 border border-red-400 px-2 py-1 hover:bg-red-400 hover:text-black transition-colors"
                        >
                          REMOVE
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <input
                          type="text"
                          value={item.serviceLabel}
                          onChange={(e) =>
                            updateDraftBillItem(item.id, {
                              serviceLabel: e.target.value,
                            })
                          }
                          className="bg-[#111] border border-[#333] px-2 py-2 text-[10px] uppercase"
                          placeholder="SERVICE LABEL"
                        />
                        <input
                          type="text"
                          value={item.serviceSpecs}
                          onChange={(e) =>
                            updateDraftBillItem(item.id, {
                              serviceSpecs: e.target.value,
                            })
                          }
                          className="bg-[#111] border border-[#333] px-2 py-2 text-[10px]"
                          placeholder="short colored, back-to-back..."
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <input
                          type="number"
                          step="0.01"
                          value={(item.totalPrice / 100).toFixed(2)}
                          onChange={(e) => {
                            const value = Math.round(
                              parseFloat(e.target.value || "0") * 100,
                            );
                            updateDraftBillItem(item.id, {
                              totalPrice: Number.isNaN(value) ? 0 : value,
                            });
                          }}
                          className="bg-[#111] border border-[#333] px-2 py-2 text-[10px]"
                          placeholder="TOTAL PRICE"
                        />
                      </div>

                      <div className="flex justify-between items-center text-[10px] uppercase text-[#aaa]">
                        <span>Draft Line Total</span>
                        <span className="font-bold">
                          {formatPeso(item.totalPrice)}
                        </span>
                      </div>
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
                    {formatPeso(cartTotal)}
                  </span>
                </div>
                <button
                  disabled={cart.length === 0 && draftBillItems.length === 0}
                  onClick={handleConfirmPayment}
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

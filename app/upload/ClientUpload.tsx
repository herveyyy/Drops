"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { refreshUploadPage } from "@/app/actions/file.actions";
import type { SelectFile } from "@/lib/types/file.types";

interface ClientUploadProps {
  guestName: string;
  initialFiles: SelectFile[];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
    );
  }
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
      <polyline points="13 2 13 9 20 9"></polyline>
    </svg>
  );
}

export default function ClientUpload({
  guestName,
  initialFiles,
}: ClientUploadProps) {
  const [files, setFiles] = useState<SelectFile[]>(initialFiles);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState<string[]>([]); // filenames currently uploading
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [doneStep, setDoneStep] = useState<1 | 2>(1);

  const handleUpload = useCallback(async (fileList: FileList | File[]) => {
    const filesToUpload = Array.from(fileList);

    for (const file of filesToUpload) {
      setUploading((prev) => [...prev, file.name]);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          console.error("Upload failed:", data.error);
          continue;
        }

        const data = await res.json();
        setFiles((prev) => [...prev, data.file]);
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setUploading((prev) => prev.filter((n) => n !== file.name));
      }
    }

    await refreshUploadPage();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [handleUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleUpload(e.target.files);
        e.target.value = "";
      }
    },
    [handleUpload],
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col pt-4 pb-24">
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-8 py-4 border-b border-[#222]">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl sm:text-2xl font-black tracking-[0.2em] uppercase m-0 leading-none">
            DROPS
          </h1>
          <p className="text-[8px] sm:text-[9px] text-[#666] tracking-widest uppercase font-bold">
            GUEST TERMINAL V.0.0.4
          </p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 border border-[#222] px-3 py-1.5 bg-black">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            <span className="text-[9px] tracking-widest uppercase font-bold text-[#aaa]">
              {guestName.toUpperCase()}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 pt-8 flex flex-col gap-10">
        {/* System Readiness Block */}
        <section className="border border-[#222] bg-[#0a0a0a] p-6 sm:p-8 flex flex-col gap-6 relative">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-[17px] sm:text-xl font-bold tracking-[0.2em] uppercase text-white">
              WELCOME TO DROPS_STUDIO
            </h2>
            <p className="text-[#888] text-[10px] sm:text-xs tracking-widest uppercase">
              SYSTEM READY. PREPARE TO TRANSFER YOUR FILES.
            </p>
          </div>

          <button
            type="button"
            onClick={handleFileSelect}
            className="bg-white text-black w-full py-4 font-bold text-[11px] sm:text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#d0d0d0] transition-colors uppercase border-none cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            BEGIN_UPLOAD
          </button>

          <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2 border border-[#222] px-3 py-1.5 bg-black">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            <span className="text-[9px] tracking-widest uppercase font-bold text-[#aaa]">
              BUFFER: {files.length}_FILE{files.length !== 1 ? "S" : ""}_STORED
            </span>
          </div>

          <div className="mt-2 border-t border-[#222] pt-4 flex gap-4 text-[10px] tracking-widest uppercase font-bold text-[#888] items-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <div className="flex flex-col">
              <span className="text-[#555] text-[8px]">SESSION STATUS</span>
              <span className="text-[#ccc]">GUEST_AUTHORIZED</span>
            </div>
          </div>
        </section>

        {/* File Transfer Section */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-end border-b border-[#222] pb-2">
            <h3 className="text-xs font-bold tracking-[0.25em] text-white uppercase">
              FILE_TRANSFER
            </h3>
            <span className="text-[9px] tracking-widest text-[#666] uppercase font-bold">
              {uploading.length > 0
                ? "UPLOADING..."
                : files.length > 0
                  ? `${files.length}_IN_QUEUE`
                  : "QUEUE_EMPTY"}
            </span>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.ai"
            multiple
            onChange={handleInputChange}
          />

          {/* Dropzone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleFileSelect}
            className={`border border-dashed transition-all duration-200 p-12 sm:p-20 flex flex-col items-center justify-center gap-4 cursor-pointer mt-2 ${
              isDragging
                ? "border-white bg-[#151515] scale-[1.01]"
                : "border-[#333] bg-[#0a0a0a] hover:bg-[#111]"
            }`}
          >
            <div
              className={`border p-3 transition-colors ${isDragging ? "border-white text-white" : "border-[#444] text-[#a0a0a0]"}`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
              </svg>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-[13px] sm:text-sm font-bold tracking-[0.2em] text-white uppercase">
                {isDragging ? "RELEASE_TO_UPLOAD" : "DROP_PRINT_FILES_HERE"}
              </span>
              <span className="text-[9px] tracking-widest text-[#666] uppercase font-bold">
                SUPPORTED: PDF JPG PNG AI // MAX: 50MB
              </span>
            </div>
          </div>

          {/* Uploading indicators */}
          {uploading.length > 0 && (
            <div className="flex flex-col gap-2">
              {uploading.map((name) => (
                <div
                  key={name}
                  className="border border-[#333] bg-[#0a0a0a] p-4 flex items-center gap-4 animate-pulse"
                >
                  <div className="border border-[#444] w-10 h-10 flex items-center justify-center text-[#888] bg-[#111]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-spin"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-[#eee] uppercase m-0 leading-none">
                      {name.toUpperCase().replace(/\s/g, "_")}
                    </p>
                    <p className="text-[8px] sm:text-[9px] tracking-widest text-[#666] uppercase m-0 font-bold">
                      TRANSFERRING...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Uploaded Files Queue */}
          <div className="flex flex-col gap-3 mt-1">
            {files.map((file) => (
              <div
                key={file.id}
                className="border border-[#222] bg-[#0a0a0a] p-4 flex justify-between items-center group hover:border-[#444] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="border border-[#333] w-10 h-10 flex items-center justify-center text-[#888] bg-[#111]">
                    {getFileIcon(file.mimeType)}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-[#eee] uppercase m-0 leading-none">
                      {file.filename.toUpperCase().replace(/\s/g, "_")}
                    </p>
                    <p className="text-[8px] sm:text-[9px] tracking-widest text-[#666] uppercase m-0 font-bold">
                      {formatFileSize(file.sizeBytes)} //{" "}
                      {file.status.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${file.status === "pending" ? "bg-[#ff0]" : "bg-[#0f0]"}`}
                  ></span>
                </div>
              </div>
            ))}

            {files.length === 0 && uploading.length === 0 && (
              <div className="border border-[#181818] bg-[#080808] p-8 flex items-center justify-center">
                <span className="text-[10px] tracking-widest text-[#444] uppercase font-bold">
                  NO_FILES_IN_QUEUE — DROP_TO_BEGIN
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setShowDoneModal(true);
              setDoneStep(1);
            }}
            className="border border-white bg-white text-black px-4 sm:px-6 py-1.5 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-transparent hover:text-white transition-colors cursor-pointer"
          >
            COMPLETE_PURCHASE
          </button>
        </section>
      </main>

      {/* Bottom Navigation Grid */}
      <nav className="fixed bottom-0 w-full border-t border-[#222] bg-[#050505] flex z-50">
        <Link
          href="/upload"
          className="flex-1 py-4 flex flex-col items-center justify-center gap-2 bg-white text-black border-t-2 border-white"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
          className="flex-1 py-4 flex flex-col items-center justify-center gap-2 text-[#666] hover:text-white transition-colors bg-black"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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

      {/* Done Modal */}
      {showDoneModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="border border-[#333] bg-[#0a0a0a] max-w-md w-full p-8 flex flex-col gap-6 shadow-2xl">
            {doneStep === 1 ? (
              <>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg sm:text-xl font-bold tracking-widest text-white uppercase">
                    SESSION_COMPLETE?
                  </h3>
                  <p className="text-[#888] text-[10px] sm:text-xs tracking-widest uppercase leading-relaxed">
                    DO YOU WANT TO BROWSE THE PRODUCT CATALOG TO BUY SOMETHING,
                    OR END YOUR SESSION?
                  </p>
                </div>
                <div className="flex flex-col gap-3 mt-2 sm:mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDoneModal(false);
                      window.location.href = "/catalog";
                    }}
                    className="w-full bg-white text-black text-center py-3 sm:py-4 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#ccc] transition-colors cursor-pointer"
                  >
                    YES, BUY SOMETHING
                  </button>
                  <button
                    type="button"
                    onClick={() => setDoneStep(2)}
                    className="w-full border border-[#444] text-[#aaa] py-3 sm:py-4 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase hover:border-white hover:text-white transition-colors cursor-pointer"
                  >
                    NO, I'M DONE
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDoneModal(false)}
                    className="w-full text-[#666] py-2 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase hover:text-white transition-colors mt-2 cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg sm:text-xl font-bold tracking-widest text-[#ff3333] uppercase">
                    ARE_YOU_SURE?
                  </h3>
                  <p className="text-[#888] text-[10px] sm:text-xs tracking-widest uppercase leading-relaxed">
                    YOUR UPLOADED FILES HAVE BEEN SECURELY SAVED. ONCE YOU END
                    YOUR SESSION, YOU WILL NEED TO RE-REGISTER TO UPLOAD AGAIN.
                  </p>
                </div>
                <div className="flex flex-col gap-3 mt-2 sm:mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = "/";
                    }}
                    className="w-full bg-[#ff3333] text-white text-center py-3 sm:py-4 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#cc0000] transition-colors cursor-pointer"
                  >
                    YES, END SESSION
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDoneModal(false)}
                    className="w-full border border-[#444] text-[#aaa] py-3 sm:py-4 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase hover:border-white hover:text-white transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

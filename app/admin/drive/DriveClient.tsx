"use client";

import { useState, useOptimistic, useTransition } from "react";
import { deleteUpload } from "@/app/actions/drive.actions";

interface UploadFile {
  name: string;
  relativePath: string;
  size: number;
  modified: string;
  fullPath: string;
}

interface StorageInfo {
  totalSize: number;
  fileCount: number;
}

interface DriveClientProps {
  initialUploads: UploadFile[];
  initialStorage: StorageInfo;
}

export default function DriveClient({
  initialUploads,
  initialStorage,
}: DriveClientProps) {
  const [uploads, setUploads] = useOptimistic(initialUploads);
  const [storage, setStorage] = useOptimistic(initialStorage);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (relativePath: string) => {
    startTransition(() => {
      // Optimistic update
      setUploads((prev) =>
        prev.filter((file) => file.relativePath !== relativePath),
      );
      setStorage((prev) => ({
        totalSize:
          prev.totalSize -
          (uploads.find((f) => f.relativePath === relativePath)?.size || 0),
        fileCount: prev.fileCount - 1,
      }));
    });

    try {
      await deleteUpload(relativePath);
    } catch (error) {
      startTransition(() => {
        // Revert on error
        setUploads(initialUploads);
        setStorage(initialStorage);
      });
      alert("Failed to delete file");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="h-screen bg-[#020202] text-white font-mono pt-16">
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* LEFT PANE */}
        <aside className="w-72 bg-[#070707] border-r border-[#111] p-6 flex flex-col overflow-y-auto">
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#888] mb-3">
              Storage_Monitor
            </h2>
            <div className="space-y-2">
              <div className="text-[9px] text-[#666]">
                Total Files: {storage.fileCount}
              </div>
              <div className="text-[9px] text-[#666]">
                Total Size: {formatSize(storage.totalSize)}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN FEED */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-3xl font-black tracking-tighter uppercase">
                Drive_Management
              </h2>
              <p className="text-[9px] text-[#666] uppercase mt-1">
                Uploads Storage Control
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {uploads.length === 0 ? (
              <div className="text-[#666] text-center py-16">
                No files uploaded yet
              </div>
            ) : (
              uploads.map((file) => (
                <div
                  key={file.relativePath}
                  className="bg-[#0d0d0d] border border-[#222] p-5 flex justify-between items-center gap-6 hover:border-white transition-all"
                >
                  <div className="flex gap-5 items-center flex-1">
                    <div className="w-12 h-12 bg-[#111] border border-[#333] flex items-center justify-center uppercase text-[10px] text-[#999]">
                      FILE
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight break-words">
                        {file.name}
                      </h3>
                      <div className="text-[9px] text-[#777] mt-1">
                        Path: {file.relativePath} | Size:{" "}
                        {formatSize(file.size)} | Modified:{" "}
                        {new Date(file.modified).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <button
                    className="border border-red-500 px-4 py-2 text-[10px] uppercase font-black text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    onClick={() => handleDelete(file.relativePath)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

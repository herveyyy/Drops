"use client";

import { useState } from "react";

interface OperatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (operatorName: string) => void;
}

export default function OperatorModal({
  isOpen,
  onClose,
  onConfirm,
}: OperatorModalProps) {
  const [operatorName, setOperatorName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (operatorName.trim()) {
      onConfirm(operatorName.trim());
      setOperatorName("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#0d0d0d] border border-[#222] p-6 w-96">
        <h3 className="text-lg font-black uppercase tracking-tight text-white mb-4">
          Operator_Transparency
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={operatorName}
            onChange={(e) => setOperatorName(e.target.value)}
            placeholder="Enter operator name"
            className="w-full bg-[#111] border border-[#333] text-white px-3 py-2 text-sm mb-4"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#333] text-[#888] py-2 text-sm uppercase hover:bg-[#111]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!operatorName.trim()}
              className="flex-1 bg-white text-black py-2 text-sm uppercase font-bold hover:bg-[#eee] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

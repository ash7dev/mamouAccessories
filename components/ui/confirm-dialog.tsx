"use client";

import { useState } from "react";

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  isDestructive?: boolean;
}

export function useConfirmDialog() {
  const [dialog, setDialog] = useState<ConfirmDialogProps | null>(null);

  const confirm = (props: Omit<ConfirmDialogProps, "onCancel">) => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        ...props,
        onCancel: () => {
          setDialog(null);
          resolve(false);
        },
        onConfirm: async () => {
          await props.onConfirm();
          setDialog(null);
          resolve(true);
        },
      });
    });
  };

  const Dialog = () => {
    if (!dialog) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => dialog.onCancel?.()}
        />
        
        {/* Modal */}
        <div className="relative z-10 w-full max-w-md mx-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 border border-[var(--gold)]/20">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-[var(--text-dark)]">
                {dialog.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-dark)]/60 leading-relaxed">
                {dialog.description}
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => dialog.onCancel?.()}
                className="px-5 py-2.5 rounded-full border border-[var(--gold)]/25 text-sm font-medium text-[var(--text-dark)] hover:bg-[var(--ivory)] transition-colors"
              >
                {dialog.cancelLabel || "Annuler"}
              </button>
              <button
                onClick={() => dialog.onConfirm()}
                className={`px-5 py-2.5 rounded-full text-sm font-medium text-white transition-colors ${
                  dialog.isDestructive
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-[var(--text-dark)] hover:bg-[var(--text-dark)]/90"
                }`}
              >
                {dialog.confirmLabel || "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return { confirm, Dialog };
}

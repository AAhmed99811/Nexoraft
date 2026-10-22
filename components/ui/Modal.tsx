"use client";

import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

export interface ModalConfirmConfig {
  title?: React.ReactNode;
  content?: React.ReactNode;
  okText?: string;
  cancelText?: string;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  onOk?: () => void;
  okText?: string;
  cancelText?: string;
  width?: number | string;
}

export const Modal: React.FC<ModalProps> & {
  confirm: (config: ModalConfirmConfig) => { destroy: () => void };
} = ({
  isOpen,
  onClose,
  title,
  children,
  onOk,
  okText = "OK",
  cancelText = "Cancel",
  width = 400,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-100"
        style={{ width: typeof width === "number" ? `${width}px` : width }}
      >
        {title && (
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 font-semibold text-base">
            {title}
          </div>
        )}
        <div className="p-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {children}
        </div>
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onOk?.();
              onClose();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-medium text-white transition-colors shadow-xs"
          >
            {okText}
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.confirm = (config: ModalConfirmConfig) => {
  if (typeof window === "undefined") {
    return { destroy: () => {} };
  }

  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  const destroy = () => {
    setTimeout(() => {
      root.unmount();
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, 150);
  };

  const ConfirmModal = () => {
    const [open, setOpen] = useState(true);

    const handleCancel = () => {
      setOpen(false);
      config.onCancel?.();
      destroy();
    };

    const handleOk = async () => {
      setOpen(false);
      await config.onOk?.();
      destroy();
    };

    return (
      <Modal
        isOpen={open}
        onClose={handleCancel}
        onOk={handleOk}
        title={config.title}
        okText={config.okText || "Delete"}
        cancelText={config.cancelText || "Cancel"}
      >
        {config.content}
      </Modal>
    );
  };

  root.render(<ConfirmModal />);

  return { destroy };
};

export default Modal;

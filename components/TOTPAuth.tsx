"use client";

import React, { useState } from "react";

export interface TOTPAuthProps {
  onVerify?: (code: string) => void;
  onCancel?: () => void;
}

export const TOTPAuth: React.FC<TOTPAuthProps> = ({ onVerify, onCancel }) => {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerify?.(code);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm mx-auto shadow-lg text-slate-800 dark:text-slate-100">
      <div className="w-12 h-12 mb-3 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-1">Two-Factor Authentication</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-5">
        Enter the 6-digit verification code from your authenticator app
      </p>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="000 000"
          className="text-center tracking-widest text-xl font-mono py-2.5 px-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800"
          autoFocus
        />
        <div className="flex gap-2 mt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={code.length < 6 || isVerifying}
            className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium transition-colors"
          >
            {isVerifying ? "Verifying..." : "Verify Code"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TOTPAuth;

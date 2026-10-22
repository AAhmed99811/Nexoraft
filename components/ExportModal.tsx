"use client";

import React, { useState } from "react";
import { WebsiteSite } from "./types";
import {
  generateNextJsProjectFiles,
  generateReactViteProjectFiles,
  downloadProjectZip,
} from "../lib/exportProject";
import {
  Download,
  Copy,
  Check,
  Code2,
  Globe,
  Rocket,
  X,
  FileCode,
  ShieldCheck,
} from "lucide-react";

export interface ExportModalProps {
  isOpen?: boolean;
  onClose: () => void;
  website?: WebsiteSite;
  site?: WebsiteSite;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen = true,
  onClose,
  website,
  site,
}) => {
  const currentWebsite = website || site;
  const [format, setFormat] = useState<"nextjs" | "react">("nextjs");
  const [activeTab, setActiveTab] = useState<
    "download" | "report" | "code" | "deploy"
  >("download");
  const [selectedFile, setSelectedFile] = useState<string>("app/page.tsx");
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !currentWebsite) return null;

  const projectFiles =
    format === "nextjs"
      ? generateNextJsProjectFiles(currentWebsite)
      : generateReactViteProjectFiles(currentWebsite);

  const fileKeys = Object.keys(projectFiles);
  const currentCode =
    projectFiles[selectedFile] || projectFiles[fileKeys[0]] || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadProjectZip(currentWebsite, format);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to create ZIP archive. Please check console.");
    } finally {
      setIsDownloading(false);
    }
  };

  const pagesCount = Object.keys(currentWebsite.pages || {}).length;
  const postsCount = currentWebsite.posts ? currentWebsite.posts.length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Export Website Codebase
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% independent portable code for{" "}
                <span className="font-semibold text-blue-600">
                  {currentWebsite.name}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Framework Selector & Tabs */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          {/* Framework Choice */}
          <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setFormat("nextjs");
                setSelectedFile("app/page.tsx");
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                format === "nextjs"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              ▲ Next.js 15 (App Router)
            </button>
            <button
              type="button"
              onClick={() => {
                setFormat("react");
                setSelectedFile("src/App.tsx");
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                format === "react"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              ⚛️ React (Vite + Router)
            </button>
          </div>

          {/* Action Tabs */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("download")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "download"
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Quick Download
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("report")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "report"
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Compatibility Report
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "code"
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Inspect Files
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("deploy")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "deploy"
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Deploy Guide
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: Quick Download */}
          {activeTab === "download" && (
            <div className="max-w-2xl mx-auto py-6 flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center shadow-inner">
                <Download className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Download Complete {format === "nextjs" ? "Next.js 15" : "React Vite"} Project
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mt-2 leading-relaxed">
                  Export ready-to-run source code with Tailwind CSS, typed TSX components,
                  multi-page routing ({pagesCount} pages), and standard scripts. Zero runtime dependencies.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full text-left">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Pages</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{pagesCount}</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Blog Posts</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{postsCount}</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[10px] font-bold uppercase text-slate-400">API Routes</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">1 (Contact)</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Lock-In</span>
                  <p className="text-base font-bold text-emerald-600">0% (Own Code)</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full sm:w-auto px-10 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isDownloading
                    ? "Compiling ZIP Archive..."
                    : `Download ${currentWebsite.slug || "website"}-${format}.zip`}
                </span>
              </button>
            </div>
          )}

          {/* TAB 2: Export Compatibility Report */}
          {activeTab === "report" && (
            <div className="max-w-2xl mx-auto py-4 space-y-5 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-950 dark:text-emerald-200 text-sm">
                    100% Independent & Portable
                  </h4>
                  <p className="text-emerald-800 dark:text-emerald-300 text-xs mt-0.5">
                    This codebase compiles and runs locally without any network connection to Nexoraft. No external SDKs or telemetry are included.
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-3 flex items-center justify-between">
                  <span className="font-semibold">Export Format</span>
                  <span className="font-bold text-blue-600">
                    {format === "nextjs" ? "Next.js 15 App Router + Tailwind 4" : "React 19 Vite + Router"}
                  </span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="font-semibold">Multi-Page Routing</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>{pagesCount} routes ({Object.values(currentWebsite.pages).map((p) => p.name).join(", ")})</span>
                  </span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="font-semibold">SEO & Meta Tags</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Automatic Title & Description per page</span>
                  </span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="font-semibold">Forms & Leads Handler</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Self-contained /api/contact handler included</span>
                  </span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="font-semibold">Design Tokens & Fonts</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>CSS Variables synced with {currentWebsite.theme?.fontFamily || "Inter"}</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Code Viewer */}
          {activeTab === "code" && (
            <div className="flex flex-col h-[460px] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              {/* File list header */}
              <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 overflow-x-auto">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {fileKeys.map((fname) => (
                    <button
                      key={fname}
                      type="button"
                      onClick={() => setSelectedFile(fname)}
                      className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                        selectedFile === fname
                          ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>{fname}</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code viewer */}
              <div className="flex-1 bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-auto leading-relaxed select-all">
                <pre>{currentCode}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: Deploy Guide */}
          {activeTab === "deploy" && (
            <div className="max-w-2xl mx-auto space-y-6 py-4">
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                <div className="flex items-center gap-2.5 font-bold text-base text-slate-900 dark:text-white mb-2">
                  <Rocket className="w-5 h-5 text-blue-600" />
                  <span>Option 1: Deploy to Vercel (Recommended)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Vercel provides native edge deployment for Next.js with automated CI/CD and preview URLs.
                </p>
                <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-decimal list-inside pl-2">
                  <li>Download the project zip file using the <strong>Quick Download</strong> tab.</li>
                  <li>Extract the files and initialize a Git repository (<code>git init && git add . && git commit -m &quot;Initial commit&quot;</code>).</li>
                  <li>Push to GitHub and import the repository at <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-blue-600 font-semibold underline">vercel.com/new</a>.</li>
                  <li>Click <strong>Deploy</strong>. Your site will be live with free automatic SSL and global CDN!</li>
                </ol>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                <div className="flex items-center gap-2.5 font-bold text-base text-slate-900 dark:text-white mb-2">
                  <Globe className="w-5 h-5 text-emerald-600" />
                  <span>Option 2: Deploy to Netlify / Cloudflare Pages</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  Deploy via terminal in seconds:
                </p>
                <pre className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto">
{`npm install
npm run build
npx netlify deploy --prod`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportModal;

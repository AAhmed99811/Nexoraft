"use client";

import React, { useState } from "react";
import { WebsiteSite } from "./types";
import {
  generateNextJsProjectFiles,
  generateReactViteProjectFiles,
  downloadProjectZip,
} from "../lib/exportProject";
import { Download, Copy, Check, Code2, Globe, Rocket, X, Terminal, FileCode } from "lucide-react";

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  website: WebsiteSite;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, website }) => {
  const [format, setFormat] = useState<"nextjs" | "react">("nextjs");
  const [activeTab, setActiveTab] = useState<"download" | "code" | "deploy">("download");
  const [selectedFile, setSelectedFile] = useState<string>("app/page.tsx");
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const projectFiles =
    format === "nextjs"
      ? generateNextJsProjectFiles(website)
      : generateReactViteProjectFiles(website);

  const fileKeys = Object.keys(projectFiles);
  const currentCode = projectFiles[selectedFile] || projectFiles[fileKeys[0]] || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadProjectZip(website, format);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to create ZIP archive. Please check console.");
    } finally {
      setIsDownloading(false);
    }
  };

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
                Export Website Project
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate production-ready code for <span className="font-semibold text-blue-600">{website.name}</span>
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
              ⚛ React + Vite
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("download")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "download"
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Quick Download (.ZIP)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "code"
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Browse Code
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("deploy")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "deploy"
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Deploy Guide
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "download" && (
            <div className="flex flex-col items-center text-center max-w-lg mx-auto py-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 shadow-sm">
                <Download className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Download {format === "nextjs" ? "Next.js 15" : "React + Vite"} Project Bundle
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Includes all source code, Tailwind CSS styling, package.json, TypeScript configurations, and components generated from your canvas.
              </p>

              <div className="w-full mt-6 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Terminal className="w-4 h-4 text-blue-500" />
                  <span>3-Step Quick Run:</span>
                </div>
                <pre className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto">
{`unzip ${website.slug || "website"}-${format}-project.zip
cd ${website.slug || "website"}
npm install && npm run dev`}
                </pre>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="mt-8 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? "Building ZIP Archive..." : `Download ${format === "nextjs" ? "Next.js" : "React"} ZIP`}</span>
              </button>
            </div>
          )}

          {activeTab === "code" && (
            <div className="flex flex-col h-[460px] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              {/* File list bar & copy button */}
              <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
                <div className="flex items-center gap-1.5">
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

          {activeTab === "deploy" && (
            <div className="max-w-2xl mx-auto space-y-6 py-4">
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                <div className="flex items-center gap-2.5 font-bold text-base text-slate-900 dark:text-white mb-2">
                  <Rocket className="w-5 h-5 text-blue-600" />
                  <span>Option 1: Deploy to Vercel (Recommended)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Vercel is built by the makers of Next.js and provides instant deployment with zero configuration.
                </p>
                <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-decimal list-inside pl-2">
                  <li>Download the project zip file using the <strong>Quick Download</strong> tab.</li>
                  <li>Extract the files and push them to a new GitHub repository.</li>
                  <li>Visit <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-blue-600 font-semibold underline">vercel.com/new</a> and import the repository.</li>
                  <li>Click <strong>Deploy</strong>. Your site will be live with free SSL and global CDN!</li>
                </ol>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                <div className="flex items-center gap-2.5 font-bold text-base text-slate-900 dark:text-white mb-2">
                  <Globe className="w-5 h-5 text-emerald-600" />
                  <span>Option 2: Deploy to Netlify</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  Deploy effortlessly via Netlify CLI or Netlify Drag-and-Drop:
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

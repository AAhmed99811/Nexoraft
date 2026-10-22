"use client";

import React, { useState, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WebsiteSite } from "../components/types";
import {
  getWebsitesSnapshot,
  getWebsitesServerSnapshot,
  subscribeToWebsites,
  createWebsite,
  duplicateWebsite,
  deleteWebsite,
  resetToDefaults,
} from "../lib/siteStorage";
import ExportModal from "../components/ExportModal";
import Modal from "../components/ui/Modal";
import {
  Plus,
  Globe,
  Layers,
  Download,
  Copy,
  Trash2,
  Search,
  Sparkles,
  Layout,
  Code2,
  Rocket,
  RotateCcw,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const websites = useSyncExternalStore(
    subscribeToWebsites,
    getWebsitesSnapshot,
    getWebsitesServerSnapshot
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [exportSite, setExportSite] = useState<WebsiteSite | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSiteName, setNewSiteName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("saas-landing");

  // Filtered websites
  const filteredWebsites = useMemo(() => {
    return websites.filter((site) => {
      const matchesSearch =
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategory === "all" || site.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [websites, searchQuery, selectedCategory]);

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newSiteName.trim() || "My New Website";
    const site = createWebsite({
      name,
      templateKey: selectedTemplate,
    });
    setShowCreateModal(false);
    setNewSiteName("");
    router.push(`/builder?siteId=${site.id}`);
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateWebsite(id);
  };

  const handleDelete = (site: WebsiteSite, e: React.MouseEvent) => {
    e.stopPropagation();
    Modal.confirm({
      title: `Delete "${site.name}"?`,
      content: (
        <div className="text-xs text-slate-500">
          This will permanently delete this website and all associated pages. This action cannot be undone.
        </div>
      ),
      okText: "Delete Website",
      onOk: () => {
        deleteWebsite(site.id);
      },
    });
  };

  const handleResetDefaults = () => {
    Modal.confirm({
      title: "Reset to Default Websites?",
      content: (
        <div className="text-xs text-slate-500">
          This will restore the standard starter websites (Apex SaaS, Aura Studio).
        </div>
      ),
      okText: "Reset",
      onOk: () => {
        resetToDefaults();
      },
    });
  };

  const formatRelativeTime = (timestamp?: number) => {
    if (!timestamp) return "Recently";
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold shadow-md shadow-blue-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  WebCraft Studio
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300">
                  Builder 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Visual Website Builder • Ready-to-Deploy Next.js & React Projects
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reset templates"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demos</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Website</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-10 mb-8 shadow-xl shadow-blue-600/10">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>WordPress-Style Visual Publishing</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Design Websites Visually. Export Production Code.
            </h1>
            <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed">
              Create, customize, and manage your websites. When you&apos;re ready, export a fully configured Next.js or React repository with 1-click and deploy anywhere.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <Layout className="w-4 h-4" />
                <span suppressHydrationWarning>{websites.length} Websites Active</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <Code2 className="w-4 h-4" />
                <span>Next.js 15 & Vite Compatible</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <Rocket className="w-4 h-4" />
                <span>1-Click ZIP Download</span>
              </div>
            </div>
          </div>

          {/* Decorative background shapes */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-center">
            <Globe className="w-96 h-96 -mr-20" />
          </div>
        </div>

        {/* Search, Filter & Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Your Websites
            </h2>
            <span suppressHydrationWarning className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {filteredWebsites.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search websites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("saas")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === "saas"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                SaaS
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("portfolio")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === "portfolio"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Portfolio
              </button>
            </div>
          </div>
        </div>

        {/* Website Cards Grid */}
        {filteredWebsites.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Layout className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No websites found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No websites match your search "${searchQuery}".`
                : "Get started by creating your first website."}
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="mt-6 px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Website</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebsites.map((site) => {
              const elementCount = Object.keys(site.elements || {}).length;
              const pageCount = Object.keys(site.pages || {}).length;

              return (
                <div
                  key={site.id}
                  onClick={() => router.push(`/builder?siteId=${site.id}`)}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
                >
                  {/* Card Thumbnail / Header Mockup */}
                  <div className="h-44 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-4 border-b border-slate-100 dark:border-slate-800/80 relative flex flex-col justify-between overflow-hidden">
                    <div className="flex items-center justify-between z-10">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-blue-600 shadow-xs backdrop-blur-xs">
                        {site.category || "custom"}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-full backdrop-blur-xs">
                        <Clock className="w-3 h-3" />
                        <span suppressHydrationWarning>{formatRelativeTime(site.updatedAt)}</span>
                      </div>
                    </div>

                    {/* Mock Website Canvas Preview */}
                    <div className="bg-white dark:bg-slate-950 rounded-xl p-3 shadow-md border border-slate-200/60 dark:border-slate-800 flex flex-col gap-1.5 transform group-hover:scale-102 transition-transform duration-300">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                          <div className="w-2 h-2 rounded-full bg-amber-400" />
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 truncate max-w-[140px]">
                          /{site.slug}
                        </span>
                      </div>
                      <div className="pt-1">
                        <div className="h-2 w-24 bg-blue-500/80 rounded-full mb-1" />
                        <div className="h-1.5 w-36 bg-slate-300 dark:bg-slate-700 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {site.name}
                        </h3>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {site.description || "Custom built website project."}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" />
                          <span>{pageCount} {pageCount === 1 ? "page" : "pages"}</span>
                        </span>
                        <span>•</span>
                        <span>{elementCount} blocks</span>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExportSite(site);
                          }}
                          title="Export Project (ZIP / Code)"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDuplicate(site.id, e)}
                          title="Duplicate Website"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(site, e)}
                          title="Delete Website"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/builder?siteId=${site.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="ml-1 p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold text-xs flex items-center gap-1 transition-colors"
                        >
                          <span>Edit</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Website Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 text-slate-800 dark:text-slate-100">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Create New Website
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Choose a template to kickstart your website, or start from a blank canvas.
            </p>

            <form onSubmit={handleCreateNew} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Website Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Next Startup"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Select Starter Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTemplate("saas-landing")}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedTemplate === "saas-landing"
                        ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">Apex SaaS</div>
                      <div className="text-[10px] text-slate-500 mt-1">Hero, features, pricing, CTA</div>
                    </div>
                    <span className="mt-3 text-[10px] font-semibold text-blue-600">SaaS Template</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTemplate("studio-portfolio")}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedTemplate === "studio-portfolio"
                        ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">Aura Studio</div>
                      <div className="text-[10px] text-slate-500 mt-1">Portfolio & agency showcase</div>
                    </div>
                    <span className="mt-3 text-[10px] font-semibold text-indigo-600">Portfolio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTemplate("blank-canvas")}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedTemplate === "blank-canvas"
                        ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">Blank Canvas</div>
                      <div className="text-[10px] text-slate-500 mt-1">Start completely from scratch</div>
                    </div>
                    <span className="mt-3 text-[10px] font-semibold text-slate-500">Empty</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
                >
                  Create & Launch Builder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {exportSite && (
        <ExportModal
          isOpen={Boolean(exportSite)}
          onClose={() => setExportSite(null)}
          website={exportSite}
        />
      )}
    </div>
  );
}

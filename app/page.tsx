"use client";

import React, { useState, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { WebsiteSite } from "../components/types";
import {
  getWebsitesSnapshot,
  getWebsitesServerSnapshot,
  subscribeToWebsites,
  createWebsite,
  duplicateWebsite,
  deleteWebsite,
  toggleArchiveWebsite,
  resetToDefaults,
} from "../lib/siteStorage";
import ExportModal from "../components/ExportModal";
import Modal from "../components/ui/Modal";
import {
  Plus,
  Globe,
  Download,
  Copy,
  Trash2,
  Search,
  Sparkles,
  RotateCcw,
  Clock,
  Archive,
  ArchiveRestore,
  FileText,
  BookOpen,
  Mail,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const websites = useSyncExternalStore(
    subscribeToWebsites,
    getWebsitesSnapshot,
    getWebsitesServerSnapshot
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [exportSite, setExportSite] = useState<WebsiteSite | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteCategory, setNewSiteCategory] = useState<
    "saas" | "portfolio" | "agency" | "ecommerce" | "blog" | "blank"
  >("saas");
  const [selectedTemplate, setSelectedTemplate] = useState("saas-landing");

  // Metrics calculation
  const totalSites = websites.length;
  const publishedSites = websites.filter(
    (s) => s.status === "published" || !s.status
  ).length;
  const totalPages = websites.reduce(
    (acc, s) => acc + Object.keys(s.pages || {}).length,
    0
  );
  const totalLeads = websites.reduce(
    (acc, s) => acc + (s.submissions ? s.submissions.length : 0),
    0
  );

  // Filtered websites
  const filteredWebsites = useMemo(() => {
    return websites.filter((site) => {
      const siteStatus = site.status || "published";
      const matchesSearch =
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategory === "all" || site.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "published" && siteStatus === "published") ||
        (selectedStatus === "draft" && siteStatus === "draft") ||
        (selectedStatus === "archived" && siteStatus === "archived");

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [websites, searchQuery, selectedCategory, selectedStatus]);

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newSiteName.trim() || "My New Project";
    const site = createWebsite({
      name,
      templateKey: selectedTemplate,
      category: newSiteCategory,
    });
    setShowCreateModal(false);
    setNewSiteName("");
    router.push(`/builder?siteId=${site.id}`);
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateWebsite(id);
  };

  const handleArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleArchiveWebsite(id);
  };

  const handleDelete = (site: WebsiteSite, e: React.MouseEvent) => {
    e.stopPropagation();
    Modal.confirm({
      title: `Delete "${site.name}"?`,
      content: (
        <div className="text-xs text-slate-500">
          This will permanently delete this website project, pages, and blog
          articles. This action cannot be undone.
        </div>
      ),
      okText: "Delete Project",
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
          This will restore standard starter websites (Apex SaaS, Aura Portfolio,
          Blank Canvas) with initial multi-page CMS collections.
        </div>
      ),
      okText: "Reset Demos",
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold shadow-md shadow-blue-500/20">
              <span className="text-lg">N</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Nexoraft Studio
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300">
                  CMS & Builder
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Visual Website Builder • Nexoraft CMS • Portable Next.js & React Code
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reset starter templates"
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
              <span>Create Project</span>
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
              <span>Nexoraft Visual Studio + Dedicated CMS Depth</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Build Visually. Own Your Code. Deploy Anywhere.
            </h1>
            <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed">
              Design responsive pages, manage blog posts, collect form leads, and configure design tokens.
              Export complete Next.js 15 App Router & React Vite codebases with zero platform lock-in.
            </p>

            {/* Quick Metrics */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <Globe className="w-4 h-4" />
                <span suppressHydrationWarning>{totalSites} Projects</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span suppressHydrationWarning>{publishedSites} Published</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <FileText className="w-4 h-4" />
                <span suppressHydrationWarning>{totalPages} Managed Pages</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <Mail className="w-4 h-4" />
                <span suppressHydrationWarning>{totalLeads} Leads Captured</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>100% Self-Contained</span>
              </div>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-center">
            <Globe className="w-96 h-96 -mr-20" />
          </div>
        </div>

        {/* Search, Filter & Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Your Projects
            </h2>
            <span
              suppressHydrationWarning
              className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {filteredWebsites.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[220px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
            </div>

            {/* Status Filter Tabs (PRD DASH-03) */}
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-xs">
              {(["all", "published", "draft", "archived"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    selectedStatus === status
                      ? "bg-blue-600 text-white font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-xs">
              {(["all", "saas", "portfolio", "blank"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    selectedCategory === cat
                      ? "bg-slate-800 dark:bg-slate-700 text-white font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredWebsites.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <Globe className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No websites found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search query or status filter, or start a new project from scratch.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebsites.map((site) => {
              const pagesCount = Object.keys(site.pages || {}).length;
              const postsCount = site.posts ? site.posts.length : 0;
              const leadsCount = site.submissions ? site.submissions.length : 0;
              const isArchived = site.status === "archived";

              return (
                <div
                  key={site.id}
                  onClick={() => router.push(`/project/${site.id}`)}
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Category, Status, and Actions */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {site.category || "General"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isArchived
                              ? "bg-slate-200 text-slate-600"
                              : site.status === "draft"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          }`}
                        >
                          {site.status || "Published"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExportSite(site);
                          }}
                          title="Export Codebase (ZIP)"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDuplicate(site.id, e)}
                          title="Duplicate Project"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleArchive(site.id, e)}
                          title={isArchived ? "Unarchive" : "Archive"}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          {isArchived ? (
                            <ArchiveRestore className="w-3.5 h-3.5" />
                          ) : (
                            <Archive className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(site, e)}
                          title="Delete Project"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {site.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {site.description}
                    </p>

                    {/* CMS Collection Badges */}
                    <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
                        <FileText className="w-3 h-3 text-blue-500" />
                        <span>{pagesCount} Pages</span>
                      </span>
                      {postsCount > 0 && (
                        <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
                          <BookOpen className="w-3 h-3 text-purple-500" />
                          <span>{postsCount} Articles</span>
                        </span>
                      )}
                      {leadsCount > 0 && (
                        <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
                          <Mail className="w-3 h-3 text-emerald-500" />
                          <span>{leadsCount} Leads</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Nexoraft CMS and Visual Studio Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs gap-2">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
                        N
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Nexoraft CMS</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{formatRelativeTime(site.updatedAt)}</span>
                      </span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/builder?siteId=${site.id}`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] inline-flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Visual Studio</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Website Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Website Project"
      >
        <form onSubmit={handleCreateNew} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Project Name
            </label>
            <input
              type="text"
              required
              value={newSiteName}
              onChange={(e) => setNewSiteName(e.target.value)}
              placeholder="e.g. Acme Cloud, Personal Brand, Nova Agency"
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={newSiteCategory}
              onChange={(e) =>
                setNewSiteCategory(
                  e.target.value as
                    | "saas"
                    | "portfolio"
                    | "agency"
                    | "ecommerce"
                    | "blog"
                    | "blank"
                )
              }
              className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
            >
              <option value="saas">SaaS & Software</option>
              <option value="portfolio">Portfolio & Creative</option>
              <option value="agency">Agency & Studio</option>
              <option value="ecommerce">E-Commerce & Store</option>
              <option value="blog">Blog & Content</option>
              <option value="blank">Blank Canvas</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Starter Architecture
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: "saas-landing",
                  name: "Apex SaaS",
                  desc: "Multi-page SaaS platform with Hero, Features, Stats, Testimonials, FAQ, Pricing, and Contact.",
                },
                {
                  id: "studio-portfolio",
                  name: "Aura Portfolio",
                  desc: "Creative agency with project showcases, capabilities grid, and client reviews.",
                },
                {
                  id: "blank-canvas",
                  name: "Blank Canvas",
                  desc: "Clean empty canvas with basic container ready for custom composition.",
                },
              ].map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedTemplate === tmpl.id
                      ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <p className="font-bold text-slate-900 dark:text-white">
                    {tmpl.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {tmpl.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-blue-500/20"
            >
              Launch in Studio
            </button>
          </div>
        </form>
      </Modal>

      {/* Export Code Modal */}
      {exportSite && (
        <ExportModal
          site={exportSite}
          onClose={() => setExportSite(null)}
        />
      )}
    </div>
  );
}

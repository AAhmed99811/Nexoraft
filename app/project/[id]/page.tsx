"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  WebsiteSite,
  BlogPost,
  MediaAsset,
  SubmissionStatus,
} from "../../../components/types";
import {
  getWebsite,
  updateWebsite,
  addWebsitePage,
  deleteWebsitePage,
  saveWebsitePost,
  deleteWebsitePost,
  saveWebsiteMedia,
  deleteWebsiteMedia,
  updateSubmissionStatus,
  deleteWebsiteSubmission,
  restoreWebsiteRevision,
} from "../../../lib/siteStorage";
import ExportModal from "../../../components/ExportModal";
import Modal from "../../../components/ui/Modal";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Image as ImageIcon,
  Mail,
  Palette,
  Settings,
  History,
  Puzzle,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Download,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Check,
  Home,
  MessageSquare,
  Upload,
  Menu,
  X,
  Loader2,
} from "lucide-react";

interface ProjectDashboardProps {
  params: Promise<{ id: string }>;
}

function ProjectDashboardInner({ params }: ProjectDashboardProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const siteId = resolvedParams.id;

  const [site, setSite] = useState<WebsiteSite | null>(null);
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "pages"
    | "posts"
    | "media"
    | "forms"
    | "appearance"
    | "plugins"
    | "settings"
    | "revisions"
  >("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  // Pages Tab State
  const [pageFilter, setPageFilter] = useState<"all" | "published" | "draft">("all");
  const [pageSearch, setPageSearch] = useState("");
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");

  // Posts Tab State
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const [postCategory, setPostCategory] = useState("Product");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState("");

  // Media Tab State
  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [mediaName, setMediaName] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");

  // Quick Draft State
  const [quickDraftTitle, setQuickDraftTitle] = useState("");
  const [quickDraftContent, setQuickDraftContent] = useState("");
  const [quickDraftSaved, setQuickDraftSaved] = useState(false);

  // Settings State
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [siteTitle, setSiteTitle] = useState("");
  const [siteTagline, setSiteTagline] = useState("");
  const [adminEmail, setAdminEmail] = useState("arham786977@gmail.com");

  // Revisions State
  const [restoreSuccess, setRestoreSuccess] = useState(false);

  // Load site on mount and whenever storage updates
  useEffect(() => {
    function load() {
      const found = getWebsite(siteId);
      if (found) {
        setSite(found);
        setSiteTitle(found.name);
        setSiteTagline(found.description);
      }
    }
    load();
    if (typeof window !== "undefined") {
      window.addEventListener("storage", load);
      return () => window.removeEventListener("storage", load);
    }
  }, [siteId]);

  const refreshSite = () => {
    const updated = getWebsite(siteId);
    if (updated) setSite(updated);
  };

  // If site not found
  if (!site) {
    return (
      <div className="min-h-screen bg-[#f0f0f1] flex items-center justify-center p-4">
        <div className="bg-white border border-[#c3c4c7] p-8 rounded-lg shadow-sm max-w-md text-center">
          <Globe className="w-12 h-12 text-[#2271b1] mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-[#1d2327] mb-2">Website Not Found</h2>
          <p className="text-sm text-[#646970] mb-6">
            The website with ID &quot;{siteId}&quot; could not be found or has been removed.
          </p>
          <Link
            href="/"
            className="px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold rounded-md shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to All Websites</span>
          </Link>
        </div>
      </div>
    );
  }

  // Handlers for Page management
  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageName.trim()) return;
    const slug = newPageSlug.trim()
      ? newPageSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : newPageName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

    addWebsitePage(site.id, {
      name: newPageName.trim(),
      slug: slug.startsWith("/") ? slug : `/${slug}`,
      title: `${newPageName.trim()} | ${site.name}`,
    });

    setNewPageName("");
    setNewPageSlug("");
    setShowAddPageModal(false);
    refreshSite();
  };

  const handleDeletePage = (pageId: string, pageName: string) => {
    Modal.confirm({
      title: `Delete Page "${pageName}"?`,
      content: (
        <p className="text-xs text-slate-500">
          Are you sure you want to move this page to Trash? All visual sections built on this page will be removed.
        </p>
      ),
      okText: "Delete Page",
      onOk: () => {
        deleteWebsitePage(site.id, pageId);
        refreshSite();
      },
    });
  };

  // Handlers for Post management
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) return;
    const slug = postSlug.trim()
      ? postSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : postTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newPost: BlogPost = {
      id: `post-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      title: postTitle.trim(),
      slug,
      category: postCategory,
      excerpt: postExcerpt.trim() || `${postTitle.trim()} - Summary and overview.`,
      content: postContent.trim() || "Full article body content.",
      author: "Arham ahmed",
      publishedAt: Date.now(),
      status: "published",
      featuredImage:
        postImage.trim() ||
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    };

    saveWebsitePost(site.id, newPost);
    setPostTitle("");
    setPostSlug("");
    setPostExcerpt("");
    setPostContent("");
    setPostImage("");
    setShowAddPostModal(false);
    refreshSite();
  };

  const handleDeletePost = (postId: string, postTitle: string) => {
    Modal.confirm({
      title: `Delete Post "${postTitle}"?`,
      content: <p className="text-xs text-slate-500">Are you sure you want to delete this article?</p>,
      okText: "Delete Article",
      onOk: () => {
        deleteWebsitePost(site.id, postId);
        refreshSite();
      },
    });
  };

  // Quick Draft Save
  const handleQuickDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDraftTitle.trim()) return;

    const newPost: BlogPost = {
      id: `post-${Date.now().toString(36)}`,
      title: quickDraftTitle.trim(),
      slug: quickDraftTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: "Draft",
      excerpt: quickDraftContent.trim() || "Drafted from Nexoraft CMS dashboard.",
      content: quickDraftContent.trim() || "",
      author: "Arham ahmed",
      publishedAt: Date.now(),
      status: "draft",
    };

    saveWebsitePost(site.id, newPost);
    setQuickDraftTitle("");
    setQuickDraftContent("");
    setQuickDraftSaved(true);
    setTimeout(() => setQuickDraftSaved(false), 3000);
    refreshSite();
  };

  // Media Handlers
  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl.trim()) return;

    const newMedia: MediaAsset = {
      id: `media-${Date.now().toString(36)}`,
      name: mediaName.trim() || "Uploaded Asset",
      url: mediaUrl.trim(),
      alt: mediaAlt.trim() || mediaName.trim() || "Website asset",
      size: "240 KB",
      createdAt: Date.now(),
      mimeType: "image/jpeg",
    };

    saveWebsiteMedia(site.id, newMedia);
    setMediaName("");
    setMediaUrl("");
    setMediaAlt("");
    setShowAddMediaModal(false);
    refreshSite();
  };

  // Leads Handlers
  const handleStatusChange = (subId: string, status: SubmissionStatus) => {
    updateSubmissionStatus(site.id, subId, status);
    refreshSite();
  };

  const handleExportCSV = () => {
    if (!site.submissions || site.submissions.length === 0) {
      alert("No submissions to export.");
      return;
    }
    const headers = ["ID", "Form", "Name", "Email", "Date", "Status", "Message"];
    const rows = site.submissions.map((s) => [
      s.id,
      `"${s.formName}"`,
      `"${s.data.name || "N/A"}"`,
      `"${s.data.email || "N/A"}"`,
      `"${new Date(s.submittedAt).toISOString()}"`,
      s.status,
      `"${(s.data.message || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${site.slug}-leads-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Revisions Restore
  const handleRestore = (revId: string, summary: string) => {
    Modal.confirm({
      title: `Restore Revision: "${summary}"?`,
      content: (
        <p className="text-xs text-slate-500">
          This will roll back all website pages and elements to the state captured in this revision snapshot.
        </p>
      ),
      okText: "Restore Revision",
      onOk: () => {
        restoreWebsiteRevision(site.id, revId);
        setRestoreSuccess(true);
        setTimeout(() => setRestoreSuccess(false), 4000);
        refreshSite();
      },
    });
  };

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsite(site.id, {
      name: siteTitle.trim() || site.name,
      description: siteTagline.trim() || site.description,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
    refreshSite();
  };

  const pagesList = Object.values(site.pages || {});
  const postsList = site.posts || [];
  const mediaList = site.media || [];
  const submissionsList = site.submissions || [];
  const revisionsList = site.revisions || [];
  const unreadLeadsCount = submissionsList.filter((s) => s.status === "new").length;

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-[#2c3338] font-sans flex flex-col antialiased">
      {/* 1. AUTHENTIC NEXORAFT CMS TOP ADMIN BAR */}
      <header className="h-8 bg-[#1d2327] text-[#c3c4c7] px-3 flex items-center justify-between text-[13px] z-50 select-none border-b border-[#2c3338] shrink-0">
        <div className="flex items-center gap-3">
          {/* Nexoraft N Logo */}
          <Link
            href="/"
            title="Return to Nexoraft Hub"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shadow-xs">
              N
            </div>
            <span className="font-semibold text-white hidden sm:inline">Nexoraft Studio v2.5</span>
          </Link>

          {/* Site Name & Visit Site */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-[#3c434a]">
            <Home className="w-3.5 h-3.5 text-[#a7aaad]" />
            <span className="font-semibold text-white max-w-[160px] truncate">{site.name}</span>
            <Link
              href={`/builder?siteId=${site.id}`}
              className="text-[11px] text-[#72aee6] hover:text-[#9ec5fe] flex items-center gap-0.5 ml-1"
              title="Visit site in Nexoraft Visual Studio"
            >
              <span>Visit Site</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>

          {/* Quick + New Action */}
          <div className="hidden md:flex items-center gap-1 pl-2 border-l border-[#3c434a]">
            <button
              type="button"
              onClick={() => {
                setActiveTab("pages");
                setShowAddPageModal(true);
              }}
              className="text-[#c3c4c7] hover:text-white text-xs px-2 py-0.5 rounded flex items-center gap-1"
            >
              <Plus className="w-3 h-3 text-[#72aee6]" />
              <span>New Page</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("posts");
                setShowAddPostModal(true);
              }}
              className="text-[#c3c4c7] hover:text-white text-xs px-2 py-0.5 rounded flex items-center gap-1"
            >
              <Plus className="w-3 h-3 text-[#72aee6]" />
              <span>New Post</span>
            </button>
          </div>

          {/* Nexoraft Pro Direct Launcher */}
          <Link
            href={`/builder?siteId=${site.id}`}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold shadow-xs transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            <span>Visual Studio</span>
          </Link>

          {/* Export Codebase (Next.js 15 App Router & React) */}
          <button
            type="button"
            onClick={() => setExportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-[11px] font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>Export Code (ZIP)</span>
          </button>
        </div>

        {/* Right side: Comments, User Profile */}
        <div className="flex items-center gap-3">
          {unreadLeadsCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("forms")}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#2271b1] text-white text-[11px] font-bold hover:bg-[#135e96]"
              title={`${unreadLeadsCount} new lead submissions`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>{unreadLeadsCount}</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="text-[12px] hidden sm:inline">Howdy, <strong>Arham ahmed</strong></span>
            <div className="w-5 h-5 rounded-full bg-[#3c434a] border border-[#50575e] text-white flex items-center justify-center text-[10px] font-bold">
              A
            </div>
            <Link
              href="/"
              title="Switch website"
              className="text-[11px] text-[#72aee6] hover:underline hidden md:inline ml-1"
            >
              All Sites
            </Link>
          </div>
        </div>
      </header>

      {/* 2. MAIN LAYOUT: SIDEBAR + CONTENT AREA */}
      <div className="flex flex-1 min-h-[calc(100vh-32px)] overflow-hidden">
        {/* NEXORAFT CMS NAV SIDEBAR */}
        <aside
          className={`bg-[#1d2327] text-[#c3c4c7] flex flex-col justify-between transition-all duration-200 select-none shrink-0 ${
            sidebarCollapsed ? "w-12" : "w-48 sm:w-52"
          }`}
        >
          <div className="py-2">
            <nav className="space-y-0.5">
              {[
                { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                { id: "pages", label: "Pages", icon: FileText, badge: pagesList.length },
                { id: "posts", label: "Posts", icon: BookOpen, badge: postsList.length },
                { id: "media", label: "Media", icon: ImageIcon, badge: mediaList.length },
                { id: "forms", label: "WPForms", icon: Mail, badge: unreadLeadsCount || undefined, badgeColor: "bg-[#d63638]" },
                { id: "appearance", label: "Appearance", icon: Palette },
                { id: "plugins", label: "Plugins", icon: Puzzle, badge: "3" },
                { id: "settings", label: "Settings", icon: Settings },
                { id: "revisions", label: "Revisions", icon: History, badge: revisionsList.length },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id as typeof activeTab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-[13px] font-medium transition-colors cursor-pointer text-left relative ${
                      isActive
                        ? "bg-[#2271b1] text-white font-semibold"
                        : "text-[#c3c4c7] hover:bg-[#131619] hover:text-[#72aee6]"
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!sidebarCollapsed && item.badge && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                          item.badgeColor || "bg-[#3c434a] text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#72aee6]" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Collapse Sidebar Button at Bottom */}
          <div className="p-2 border-t border-[#2c3338]">
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[#a7aaad] hover:text-white transition-colors cursor-pointer"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 mx-auto" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span>Collapse menu</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* 3. MAIN NEXORAFT CMS CONTENT AREA */}
        <main className="flex-1 bg-[#f0f0f1] p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-32px)]">
          {/* Nexoraft Global Notification Banner */}
          {!noticeDismissed && (
            <div className="bg-white border-l-4 border-[#72aee6] p-3 shadow-xs mb-5 flex items-center justify-between text-xs text-[#1d2327]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>
                  <strong>Nexoraft Pro Active:</strong> You can edit any page with visual drag &amp; drop, or export 100% independent Next.js 15 &amp; React code at any time.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setNoticeDismissed(true)}
                className="text-[#646970] hover:text-[#1d2327] p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* SUB-VIEW 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Page Title */}
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-normal text-[#1d2327]">Dashboard</h1>
                <Link
                  href={`/builder?siteId=${site.id}`}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open Visual Studio</span>
                </Link>
              </div>

              {/* Welcome to Nexoraft Banner */}
              <div className="bg-white border border-[#c3c4c7] p-6 shadow-xs rounded-sm">
                <h2 className="text-xl font-normal text-[#1d2327]">Welcome to Nexoraft Studio!</h2>
                <p className="text-xs text-[#646970] mt-1">
                  We&apos;ve assembled some links to get you started customizing your website:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-5 border-t border-[#f0f0f1]">
                  <div>
                    <h3 className="text-sm font-semibold text-[#1d2327] mb-2">Get Started</h3>
                    <Link
                      href={`/builder?siteId=${site.id}`}
                      className="inline-block px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold rounded shadow-xs transition-colors"
                    >
                      Customize Your Site
                    </Link>
                    <p className="text-[11px] text-[#646970] mt-2">
                      or, <button type="button" onClick={() => setActiveTab("appearance")} className="text-[#2271b1] hover:underline">customize typography &amp; colors</button>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#1d2327] mb-2">Next Steps</h3>
                    <ul className="text-xs space-y-2 text-[#2271b1]">
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab("posts");
                            setShowAddPostModal(true);
                          }}
                          className="hover:underline flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#646970]" />
                          <span>Write your first blog post</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab("pages");
                            setShowAddPageModal(true);
                          }}
                          className="hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#646970]" />
                          <span>Add an About or Contact page</span>
                        </button>
                      </li>
                      <li>
                        <Link
                          href={`/builder?siteId=${site.id}`}
                          className="hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#646970]" />
                          <span>View your live website</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#1d2327] mb-2">More Actions</h3>
                    <ul className="text-xs space-y-2 text-[#2271b1]">
                      <li>
                        <button
                          type="button"
                          onClick={() => setActiveTab("appearance")}
                          className="hover:underline flex items-center gap-1"
                        >
                          <Menu className="w-3.5 h-3.5 text-[#646970]" />
                          <span>Manage header &amp; footer menus</span>
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => setExportModalOpen(true)}
                          className="hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Download className="w-3.5 h-3.5 text-[#2271b1]" />
                          <span>Export Next.js 15 App Router code</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2-Column Dashboard Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Column 1 */}
                <div className="space-y-5">
                  {/* At a Glance Widget */}
                  <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm">
                    <div className="px-4 py-3 border-b border-[#f0f0f1] flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#1d2327]">At a Glance</h3>
                      <span className="text-[11px] text-[#646970]">Nexoraft Studio v2.5</span>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-3 text-xs text-[#1d2327] mb-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span><strong>{pagesList.length}</strong> Pages</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#826eb4]" />
                          <span><strong>{postsList.length}</strong> Posts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-[#00a32a]" />
                          <span><strong>{mediaList.length}</strong> Media Assets</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#d63638]" />
                          <span><strong>{submissionsList.length}</strong> Form Leads</span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-[#f0f0f1] text-[11px] text-[#646970] flex items-center justify-between">
                        <span>Nexoraft Studio Pro Engine</span>
                        <span className="text-[#00a32a] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Edge Ready</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Activity Widget */}
                  <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm">
                    <div className="px-4 py-3 border-b border-[#f0f0f1]">
                      <h3 className="text-sm font-bold text-[#1d2327]">Activity</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <span className="text-[11px] font-bold text-[#646970] uppercase tracking-wider">Recently Published Pages</span>
                        <ul className="mt-2 space-y-2 text-xs">
                          {pagesList.slice(0, 3).map((page) => (
                            <li key={page.id} className="flex items-center justify-between">
                              <span className="font-semibold text-[#2271b1] hover:underline cursor-pointer" onClick={() => router.push(`/builder?siteId=${site.id}&pageId=${page.id}`)}>
                                {page.name}
                              </span>
                              <span className="text-[11px] text-[#646970] font-mono">{page.slug}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {submissionsList.length > 0 && (
                        <div className="pt-3 border-t border-[#f0f0f1]">
                          <span className="text-[11px] font-bold text-[#646970] uppercase tracking-wider">Recent Lead Inquiries</span>
                          <ul className="mt-2 space-y-2 text-xs">
                            {submissionsList.slice(0, 3).map((sub) => (
                              <li key={sub.id} className="flex items-center justify-between bg-[#f6f7f7] p-2 rounded">
                                <div>
                                  <span className="font-semibold text-[#1d2327]">{sub.data.name || "Subscriber"}</span>
                                  <span className="text-[11px] text-[#646970] ml-2">({sub.data.email || "No email"})</span>
                                </div>
                                <span className="text-[10px] bg-[#2271b1] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                                  {sub.formName}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-5">
                  {/* Site Health Status Widget */}
                  <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm">
                    <div className="px-4 py-3 border-b border-[#f0f0f1] flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#1d2327]">Site Health Status</h3>
                      <span className="px-2 py-0.5 bg-[#d1e4dd] text-[#005c2a] text-[11px] font-bold rounded">Good</span>
                    </div>
                    <div className="p-4 text-xs text-[#1d2327] space-y-2.5">
                      <p className="text-[#646970]">
                        Your site’s health is in peak condition. All performance metrics and independent code checks passed.
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="p-2 bg-[#f6f7f7] rounded border border-[#dcdcde]">
                          <span className="text-[10px] text-[#646970] uppercase block font-bold">Runtime Lock-In</span>
                          <span className="text-sm font-bold text-[#00a32a]">0% (Zero)</span>
                        </div>
                        <div className="p-2 bg-[#f6f7f7] rounded border border-[#dcdcde]">
                          <span className="text-[10px] text-[#646970] uppercase block font-bold">Export Format</span>
                          <span className="text-sm font-bold text-[#2271b1]">Next.js 15 &amp; Vite</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Draft Widget */}
                  <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm">
                    <div className="px-4 py-3 border-b border-[#f0f0f1]">
                      <h3 className="text-sm font-bold text-[#1d2327]">Quick Draft</h3>
                    </div>
                    <form onSubmit={handleQuickDraft} className="p-4 space-y-3">
                      {quickDraftSaved && (
                        <div className="p-2 bg-[#d1e4dd] text-[#005c2a] text-xs font-semibold rounded flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Draft saved successfully to Posts!</span>
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-semibold text-[#1d2327] mb-1">Title</label>
                        <input
                          type="text"
                          required
                          value={quickDraftTitle}
                          onChange={(e) => setQuickDraftTitle(e.target.value)}
                          placeholder="What's on your mind?"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#8c8f94] rounded focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#1d2327] mb-1">Content</label>
                        <textarea
                          rows={3}
                          value={quickDraftContent}
                          onChange={(e) => setQuickDraftContent(e.target.value)}
                          placeholder="Draft notes or post thoughts..."
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#8c8f94] rounded focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[#f6f7f7] hover:bg-[#f0f0f1] text-[#2271b1] border border-[#2271b1] hover:border-[#135e96] text-xs font-semibold rounded cursor-pointer transition-colors"
                      >
                        Save Draft
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: PAGES */}
          {activeTab === "pages" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Header with Title and Add New button */}
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-normal text-[#1d2327]">Pages</h1>
                <button
                  type="button"
                  onClick={() => setShowAddPageModal(true)}
                  className="px-2.5 py-1 text-xs font-semibold text-[#2271b1] border border-[#2271b1] hover:bg-[#2271b1] hover:text-white rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add New Page</span>
                </button>
              </div>

              {/* Status Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#646970]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPageFilter("all")}
                    className={`hover:text-[#2271b1] ${pageFilter === "all" ? "font-bold text-[#1d2327]" : ""}`}
                  >
                    All ({pagesList.length})
                  </button>
                  <span>|</span>
                  <button
                    type="button"
                    onClick={() => setPageFilter("published")}
                    className={`hover:text-[#2271b1] ${pageFilter === "published" ? "font-bold text-[#1d2327]" : ""}`}
                  >
                    Published ({pagesList.length})
                  </button>
                </div>

                {/* Search Pages Box */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search Pages..."
                    value={pageSearch}
                    onChange={(e) => setPageSearch(e.target.value)}
                    className="px-2.5 py-1 text-xs bg-white border border-[#8c8f94] rounded focus:outline-none focus:border-[#2271b1]"
                  />
                </div>
              </div>

              {/* Authentic Nexoraft CMS Table */}
              <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#1d2327] font-bold">
                      <th className="p-3 w-8">
                        <input type="checkbox" className="rounded" readOnly />
                      </th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Author</th>
                      <th className="p-3">Slug</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Visual Builder</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f1]">
                    {pagesList
                      .filter((p) => p.name.toLowerCase().includes(pageSearch.toLowerCase()))
                      .map((page) => (
                        <tr key={page.id} className="hover:bg-[#f6f7f7] group transition-colors">
                          <td className="p-3">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-[#2271b1] text-sm">
                              <Link href={`/builder?siteId=${site.id}&pageId=${page.id}`}>
                                {page.name}
                              </Link>
                              {page.slug === "/" && (
                                <span className="ml-2 text-[10px] font-bold text-[#646970] uppercase">
                                  — Front Page
                                </span>
                              )}
                            </div>
                            {/* Hover Quick Actions */}
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-[#2271b1] opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link
                                href={`/builder?siteId=${site.id}&pageId=${page.id}`}
                                className="font-bold text-blue-600 hover:underline"
                              >
                                Edit in Visual Studio
                              </Link>
                              <span>|</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (typeof window !== "undefined") {
                                    const newName = window.prompt("Enter new page title:", page.name);
                                    if (newName && newName.trim()) {
                                      updateWebsite(site.id, {
                                        pages: {
                                          ...site.pages,
                                          [page.id]: { ...page, name: newName.trim(), updatedAt: Date.now() },
                                        },
                                      });
                                      refreshSite();
                                    }
                                  }
                                }}
                                className="hover:underline"
                              >
                                Quick Edit
                              </button>
                              {page.slug !== "/" && (
                                <>
                                  <span>|</span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeletePage(page.id, page.name)}
                                    className="text-[#d63638] hover:underline"
                                  >
                                    Trash
                                  </button>
                                </>
                              )}
                              <span>|</span>
                              <Link
                                href={`/builder?siteId=${site.id}&pageId=${page.id}`}
                                className="hover:underline"
                              >
                                View
                              </Link>
                            </div>
                          </td>
                          <td className="p-3 text-[#646970]">Arham ahmed</td>
                          <td className="p-3 font-mono text-[#646970]">{page.slug}</td>
                          <td className="p-3 text-[#646970]">
                            Published<br />
                            <span className="text-[11px]">{typeof page.updatedAt === "number" ? new Date(page.updatedAt).toLocaleDateString() : "Recently"}</span>
                          </td>
                          <td className="p-3 text-right">
                            <Link
                              href={`/builder?siteId=${site.id}&pageId=${page.id}`}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded inline-flex items-center gap-1 transition-colors"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>Edit in Visual Studio</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: POSTS */}
          {activeTab === "posts" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-normal text-[#1d2327]">Posts</h1>
                <button
                  type="button"
                  onClick={() => setShowAddPostModal(true)}
                  className="px-2.5 py-1 text-xs font-semibold text-[#2271b1] border border-[#2271b1] hover:bg-[#2271b1] hover:text-white rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add New Post</span>
                </button>
              </div>

              <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#1d2327] font-bold">
                      <th className="p-3">Title</th>
                      <th className="p-3">Author</th>
                      <th className="p-3">Categories</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f1]">
                    {postsList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-xs text-[#646970]">
                          No posts found. Click &quot;Add New Post&quot; to write your first article.
                        </td>
                      </tr>
                    ) : (
                      postsList.map((post) => (
                        <tr key={post.id} className="hover:bg-[#f6f7f7] group transition-colors">
                          <td className="p-3">
                            <span className="font-bold text-[#2271b1] text-sm">{post.title}</span>
                            <div className="text-[11px] text-[#646970] mt-0.5 max-w-md truncate">
                              {post.excerpt}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-[#2271b1] opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleDeletePost(post.id, post.title)}
                                className="text-[#d63638] hover:underline"
                              >
                                Trash
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-[#646970]">{post.author}</td>
                          <td className="p-3 text-[#2271b1] font-semibold">{post.category}</td>
                          <td className="p-3 text-[#646970]">
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeletePost(post.id, post.title)}
                              className="p-1 text-[#d63638] hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-VIEW 4: MEDIA */}
          {activeTab === "media" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-normal text-[#1d2327]">Media Library</h1>
                <button
                  type="button"
                  onClick={() => setShowAddMediaModal(true)}
                  className="px-2.5 py-1 text-xs font-semibold text-[#2271b1] border border-[#2271b1] hover:bg-[#2271b1] hover:text-white rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>Add New Media File</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mediaList.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white border border-[#c3c4c7] p-2 rounded shadow-xs group relative flex flex-col justify-between"
                  >
                    <div className="h-28 overflow-hidden bg-[#f0f0f1] rounded flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.url}
                        alt={m.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="mt-2 text-[11px] text-[#1d2327] truncate font-semibold">
                      {m.name}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#646970] mt-1">
                      <span>{m.size || "200 KB"}</span>
                      <button
                        type="button"
                        onClick={() => deleteWebsiteMedia(site.id, m.id)}
                        className="text-[#d63638] hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW 5: FORMS & LEADS */}
          {activeTab === "forms" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-normal text-[#1d2327]">WPForms Entries</h1>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#2271b1] text-white">
                    {submissionsList.length} Total Leads
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold rounded shadow-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Entries (CSV)</span>
                </button>
              </div>

              <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#1d2327] font-bold">
                      <th className="p-3">Date</th>
                      <th className="p-3">Form Name</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Message</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f1]">
                    {submissionsList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-xs text-[#646970]">
                          No form submissions yet. Test your Contact Form or Newsletter CTA in the Nexoraft Visual Studio preview to capture live leads!
                        </td>
                      </tr>
                    ) : (
                      submissionsList.map((sub) => (
                        <tr key={sub.id} className="hover:bg-[#f6f7f7] transition-colors">
                          <td className="p-3 text-[#646970] whitespace-nowrap">
                            {new Date(sub.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 font-semibold text-[#1d2327]">{sub.formName}</td>
                          <td className="p-3 font-bold text-[#2271b1]">{sub.data.name || "Subscriber"}</td>
                          <td className="p-3 text-[#646970]">{sub.data.email || "N/A"}</td>
                          <td className="p-3 text-[#646970] max-w-xs truncate">
                            {sub.data.message || "Newsletter subscription"}
                          </td>
                          <td className="p-3">
                            <select
                              value={sub.status}
                              onChange={(e) => handleStatusChange(sub.id, e.target.value as SubmissionStatus)}
                              className="px-2 py-1 text-[11px] bg-white border border-[#8c8f94] rounded text-[#1d2327] focus:outline-none"
                            >
                              <option value="new">New</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="contacted">Contacted</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => deleteWebsiteSubmission(site.id, sub.id)}
                              className="p-1 text-[#d63638] hover:bg-red-50 rounded"
                              title="Delete submission"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-VIEW 6: APPEARANCE / MENUS */}
          {activeTab === "appearance" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <h1 className="text-2xl font-normal text-[#1d2327]">Appearance &amp; Menus</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Menu Structure */}
                <div className="bg-white border border-[#c3c4c7] p-5 shadow-xs rounded-sm">
                  <h3 className="text-sm font-bold text-[#1d2327] mb-2">Header Navigation Menu</h3>
                  <p className="text-xs text-[#646970] mb-4">
                    The top navigation links rendered across all website pages.
                  </p>
                  <div className="space-y-2">
                    {pagesList.map((p) => (
                      <div
                        key={p.id}
                        className="p-2.5 bg-[#f6f7f7] border border-[#dcdcde] rounded flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-[#1d2327]">{p.name}</span>
                        <span className="font-mono text-[#646970] text-[11px]">{p.slug}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Theme Design Tokens */}
                <div className="bg-white border border-[#c3c4c7] p-5 shadow-xs rounded-sm">
                  <h3 className="text-sm font-bold text-[#1d2327] mb-2">Theme Customizer</h3>
                  <p className="text-xs text-[#646970] mb-4">
                    Core styling tokens exported cleanly to Tailwind CSS and CSS variables.
                  </p>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[#646970] block font-semibold mb-1">Primary Brand Color</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-[#8c8f94]"
                          style={{ backgroundColor: site.theme?.primaryColor || "#3b82f6" }}
                        />
                        <span className="font-mono">{site.theme?.primaryColor || "#3b82f6"}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[#646970] block font-semibold mb-1">Typography</span>
                      <span className="font-mono">{site.theme?.fontFamily || "Inter, sans-serif"}</span>
                    </div>
                    <div>
                      <span className="text-[#646970] block font-semibold mb-1">Corner Radius</span>
                      <span className="capitalize">{site.theme?.borderRadius || "lg"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 7: PLUGINS */}
          {activeTab === "plugins" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h1 className="text-2xl font-normal text-[#1d2327]">Installed Plugins</h1>

              <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#1d2327] font-bold">
                      <th className="p-3">Plugin</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f1]">
                    <tr className="bg-[#f0f6fc]">
                      <td className="p-3 font-bold text-[#1d2327] whitespace-nowrap">
                        Nexoraft Pro Suite
                        <span className="ml-2 text-[10px] text-[#005c2a] font-bold uppercase bg-[#d1e4dd] px-1.5 py-0.5 rounded">Active</span>
                        <div className="text-[11px] text-[#646970] font-normal mt-0.5">Version 3.2.0 | By Nexoraft Core</div>
                      </td>
                      <td className="p-3 text-[#646970]">
                        The leading visual website builder for Nexoraft. Provides high-fidelity visual layout editing, responsive controls, and pro widgets (Bento Grids, Process Timelines, Pricing toggles, Accordions, Countdown Timers, Newsletter Capture).
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-[#1d2327] whitespace-nowrap">
                        Nexoraft Code Generator
                        <span className="ml-2 text-[10px] text-[#005c2a] font-bold uppercase bg-[#d1e4dd] px-1.5 py-0.5 rounded">Active</span>
                        <div className="text-[11px] text-[#646970] font-normal mt-0.5">Version 2.5.0 | By Nexoraft Studio</div>
                      </td>
                      <td className="p-3 text-[#646970]">
                        Converts visual builder element schemas into independent Next.js 15 App Router and React Vite bundles with full TypeScript typing and zero platform lock-in.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-[#1d2327] whitespace-nowrap">
                        Nexoraft Forms Pro
                        <span className="ml-2 text-[10px] text-[#005c2a] font-bold uppercase bg-[#d1e4dd] px-1.5 py-0.5 rounded">Active</span>
                        <div className="text-[11px] text-[#646970] font-normal mt-0.5">Version 2.8.0 | By Nexoraft Labs</div>
                      </td>
                      <td className="p-3 text-[#646970]">
                        Captures lead inquiries and newsletter subscribers directly into the Nexoraft CMS inbox with instant CSV export and email notification hooks.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-VIEW 8: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-5 animate-in fade-in duration-150 max-w-3xl">
              <h1 className="text-2xl font-normal text-[#1d2327]">General Settings</h1>

              <form onSubmit={handleSaveSettings} className="bg-white border border-[#c3c4c7] p-6 shadow-xs rounded-sm space-y-4 text-xs">
                {settingsSaved && (
                  <div className="p-2.5 bg-[#d1e4dd] text-[#005c2a] font-semibold rounded flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Settings saved successfully.</span>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">Site Title</label>
                  <input
                    type="text"
                    required
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                    className="w-full sm:w-96 px-3 py-1.5 bg-white border border-[#8c8f94] rounded text-[#1d2327] focus:outline-none focus:border-[#2271b1]"
                  />
                  <span className="text-[11px] text-[#646970] block mt-1">
                    Used in header navigation, SEO title tags, and exported project metadata.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">Tagline</label>
                  <input
                    type="text"
                    value={siteTagline}
                    onChange={(e) => setSiteTagline(e.target.value)}
                    className="w-full sm:w-96 px-3 py-1.5 bg-white border border-[#8c8f94] rounded text-[#1d2327] focus:outline-none focus:border-[#2271b1]"
                  />
                  <span className="text-[11px] text-[#646970] block mt-1">
                    In a few words, explain what this site is about.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">Administration Email Address</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full sm:w-96 px-3 py-1.5 bg-white border border-[#8c8f94] rounded text-[#1d2327] focus:outline-none focus:border-[#2271b1]"
                  />
                  <span className="text-[11px] text-[#646970] block mt-1">
                    This address is used for lead notifications and admin communication.
                  </span>
                </div>

                <div className="pt-4 border-t border-[#f0f0f1]">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold rounded cursor-pointer transition-colors shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SUB-VIEW 9: REVISIONS */}
          {activeTab === "revisions" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-normal text-[#1d2327]">Revisions &amp; Version History</h1>
                <span className="text-xs text-[#646970]">{revisionsList.length} saved snapshots</span>
              </div>

              {restoreSuccess && (
                <div className="p-3 bg-[#d1e4dd] text-[#005c2a] text-xs font-semibold rounded flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Website successfully restored to selected revision!</span>
                </div>
              )}

              <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#1d2327] font-bold">
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Author</th>
                      <th className="p-3">Summary</th>
                      <th className="p-3">Pages Snapshot</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f1]">
                    {revisionsList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-xs text-[#646970]">
                          No historical snapshots saved yet. Snapshots are created whenever you publish changes.
                        </td>
                      </tr>
                    ) : (
                      revisionsList.map((rev) => (
                        <tr key={rev.id} className="hover:bg-[#f6f7f7] transition-colors">
                          <td className="p-3 font-semibold text-[#1d2327] whitespace-nowrap">
                            {new Date(rev.timestamp).toLocaleString()}
                          </td>
                          <td className="p-3 text-[#646970]">{rev.author}</td>
                          <td className="p-3 font-medium text-[#2271b1]">{rev.summary}</td>
                          <td className="p-3 text-[#646970]">
                            {Object.keys(rev.pagesSnapshot || {}).length} Pages Saved
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRestore(rev.id, rev.summary)}
                              className="px-2.5 py-1 bg-[#f6f7f7] hover:bg-[#f0f0f1] text-[#2271b1] border border-[#2271b1] rounded text-[11px] font-semibold cursor-pointer"
                            >
                              Restore
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ADD NEW PAGE */}
      {showAddPageModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#c3c4c7] rounded shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-normal text-[#1d2327] mb-4">Add New Page</h3>
            <form onSubmit={handleCreatePage} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Page Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Services, Pricing, About Us"
                  value={newPageName}
                  onChange={(e) => {
                    setNewPageName(e.target.value);
                    if (!newPageSlug) {
                      setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded text-[#1d2327] focus:outline-none focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">URL Slug</label>
                <div className="flex items-center">
                  <span className="px-2.5 py-2 bg-[#f0f0f1] border border-r-0 border-[#8c8f94] rounded-l text-[#646970]">/</span>
                  <input
                    type="text"
                    required
                    placeholder="services"
                    value={newPageSlug}
                    onChange={(e) => setNewPageSlug(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded-r text-[#1d2327] focus:outline-none focus:border-[#2271b1]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#f0f0f1]">
                <button
                  type="button"
                  onClick={() => setShowAddPageModal(false)}
                  className="px-3 py-1.5 text-xs text-[#646970] hover:text-[#1d2327]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold rounded cursor-pointer"
                >
                  Publish Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW POST */}
      {showAddPostModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#c3c4c7] rounded shadow-xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-normal text-[#1d2327] mb-4">Add New Post</h3>
            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scaling Next.js 15 Applications in 2026"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded text-[#1d2327] focus:outline-none focus:border-[#2271b1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">Category</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded text-[#1d2327] focus:outline-none"
                  >
                    <option value="Product">Product</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Tutorial">Tutorial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">Slug</label>
                  <input
                    type="text"
                    placeholder="scaling-nextjs"
                    value={postSlug}
                    onChange={(e) => setPostSlug(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded text-[#1d2327] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Excerpt / Summary</label>
                <textarea
                  rows={2}
                  placeholder="Short summary for cards and search results..."
                  value={postExcerpt}
                  onChange={(e) => setPostExcerpt(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded text-[#1d2327] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Featured Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={postImage}
                  onChange={(e) => setPostImage(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded text-[#1d2327] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f0f0f1]">
                <button
                  type="button"
                  onClick={() => setShowAddPostModal(false)}
                  className="px-3 py-1.5 text-xs text-[#646970] hover:text-[#1d2327]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold rounded cursor-pointer"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MEDIA */}
      {showAddMediaModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#c3c4c7] rounded shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-normal text-[#1d2327] mb-4">Add Media Asset</h3>
            <form onSubmit={handleAddMedia} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded text-[#1d2327] focus:outline-none focus:border-[#2271b1]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hero Graphic, Team Photo"
                  value={mediaName}
                  onChange={(e) => setMediaName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded text-[#1d2327] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-[#1d2327] mb-1">Alt Text (Accessibility)</label>
                <input
                  type="text"
                  placeholder="Describe image for screen readers"
                  value={mediaAlt}
                  onChange={(e) => setMediaAlt(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#8c8f94] rounded text-[#1d2327] focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f0f0f1]">
                <button
                  type="button"
                  onClick={() => setShowAddMediaModal(false)}
                  className="px-3 py-1.5 text-xs text-[#646970]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold rounded"
                >
                  Add to Media Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPORT CODEBASE MODAL */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        site={site}
      />
    </div>
  );
}

export default function ProjectDashboard({ params }: ProjectDashboardProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f0f0f1] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#2271b1] animate-spin" />
        </div>
      }
    >
      <ProjectDashboardInner params={params} />
    </Suspense>
  );
}

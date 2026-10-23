"use client";

import React, { useMemo, useState } from "react";
import NavbarComponentWrapper from "./NavbarComponentWrapper";
import AppRenderer from "./AppRenderer";
import {
  elementSlice,
  useFormBuilderState,
} from "./context/FormBuilderContext";
import Modal from "./ui/Modal";
import {
  ReactFormBuilderProps,
  PreviewProps,
  ElementObjectMap,
  ElementNode,
  DeviceType,
} from "./types";
import {
  X,
  Trash2,
  Copy,
  Sliders,
  Plus,
  Layers,
  FileText,
  BookOpen,
  Image as ImageIcon,
  Mail,
  Palette,
  History,
  EyeOff,
  Download,
  Sparkles,
  Heading,
  Type,
  MousePointer,
  PanelBottom,
  RotateCcw,
  Layout,
  Columns,
  Minus,
  MoveVertical,
  Star,
  HelpCircle,
  BarChart3,
  Building,
  Clock,
  Play,
  Users,
} from "lucide-react";

const { removeElement, updateElement, addElement } = elementSlice;

function generateElementId(prefix = "elem"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
}

function getFocusedSubTreeIds(
  tree: ElementObjectMap | null | undefined,
  focusId: string
): string[] {
  const ids: string[] = [];
  function collect(id: string) {
    const node = tree?.[id];
    if (!node) return;
    ids.push(id);
    node.children?.forEach((childId) => collect(childId));
  }
  collect(focusId);
  return ids;
}

export const Preview: React.FC<PreviewProps> = ({
  rootId,
  isPreview = false,
  ...props
}) => {
  const { elements, focusedElement } = useFormBuilderState();
  const focusedSubTree = useMemo(
    () => (focusedElement ? getFocusedSubTreeIds(elements, focusedElement) : null),
    [elements, focusedElement]
  );

  const effectiveRootId = rootId || "root";

  return (
    <div
      id="nexoraft_canvas"
      className="classes w-full h-full p-2 sm:p-4 transition-all"
      style={{ overflow: "auto", scrollbarWidth: "none" }}
    >
      <AppRenderer
        {...props}
        id={effectiveRootId}
        key={effectiveRootId}
        isPreview={isPreview}
        style={{ width: "100%" }}
        focusedSubTree={focusedSubTree}
      />
    </div>
  );
};

export const ReactFormBuilder: React.FC<ReactFormBuilderProps> = (props) => {
  const {
    websiteName,
    elements,
    focusedElement,
    selectedElement,
    pages,
    activePage,
    setActivePage,
    themeCode,
    secondaryColor,
    fontFamily,
    borderRadius,
    updateTheme,
    posts,
    addPost,
    deletePost,
    media,
    addMedia,
    deleteMedia,
    submissions,
    updateSubmissionStatus,
    deleteSubmission,
    revisions,
    restoreRevision,
    addPage,
    deletePage,
    dispatch,
    setFocusedElement,
  } = useFormBuilderState();

  const [deviceType, setDeviceType] = useState<DeviceType>(
    props.deviceType || "desktop"
  );
  const [isPreview, setIsPreview] = useState(false);
  const [showInspector, setShowInspector] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<
    | "blocks"
    | "layers"
    | "pages"
    | "blog"
    | "media"
    | "leads"
    | "theme"
    | "revisions"
  >("blocks");

  // Inspector tab
  const [inspectorTab, setInspectorTab] = useState<
    "content" | "style" | "advanced"
  >("content");

  // Modals
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");

  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState("Product");
  const [postAuthor, setPostAuthor] = useState("Arham ahmed");

  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [mediaName, setMediaName] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");

  const activePageConfig = pages[activePage] || Object.values(pages)[0];
  const targetElementId = focusedElement || selectedElement;
  const elementConfig = targetElementId ? elements[targetElementId] : undefined;

  // Insert Element Handler
  const handleInsertElement = (type: string, label: string) => {
    const parentId =
      focusedElement && elements[focusedElement]?.elementType === "Container"
        ? focusedElement
        : activePageConfig?.rootElementId || "root";

    const newId = generateElementId("elem");
    let extraProps: Record<string, unknown> = {};

    switch (type) {
      case "Container":
        extraProps = {
          children: [],
          style: { padding: "32px", minHeight: "140px", backgroundColor: "#ffffff" },
        };
        break;
      case "NavbarSection":
        extraProps = {
          title: websiteName || "Nexoraft",
          subtitle: "Digital Studio",
          buttonText: "Get Started Free",
          items: [
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
          ],
        };
        break;
      case "HeroSection":
        extraProps = {
          badge: "✨ VISUAL ARCHITECTURE",
          title: "Build and Deploy Websites Without Boundaries",
          subtitle:
            "Design responsive layouts visually and export independent, production-grade Next.js 15 & React code.",
          buttonText: "Start Building Now",
          buttonSecondaryText: "View Documentation",
        };
        break;
      case "FeatureGridSection":
        extraProps = {
          title: "Engineered for Velocity",
          subtitle: "Comprehensive capabilities designed for creators and engineering teams.",
          items: [
            { title: "Visual Composition", description: "Design modular sections with real-time feedback." },
            { title: "Universal Export", description: "Exports clean Next.js App Router and React Vite bundles." },
            { title: "Zero Lock-In", description: "Host anywhere: Vercel, Netlify, Cloudflare, or custom servers." },
          ],
        };
        break;
      case "StatsSection":
        extraProps = {
          items: [
            { value: "99.99%", label: "Uptime Reliability", change: "+0.1%" },
            { value: "10k+", label: "Websites Shipped", change: "+140%" },
            { value: "<85ms", label: "Edge TTFB", change: "Blazing" },
            { value: "0", label: "Vendor Lock-In", change: "100% Free" },
          ],
        };
        break;
      case "TestimonialsSection":
        extraProps = {
          title: "Loved by Founders & Engineers",
          subtitle: "See how teams accelerate their go-to-market cycle with portable visual building.",
        };
        break;
      case "PricingSection":
        extraProps = {
          title: "Transparent, Predictable Pricing",
          subtitle: "Choose the plan that fits your growth stage. Upgrade or cancel anytime.",
        };
        break;
      case "FAQSection":
        extraProps = {
          title: "Frequently Asked Questions",
          subtitle: "Common questions about export fidelity, hosting, and code ownership.",
        };
        break;
      case "LogoStripSection":
        extraProps = {
          title: "TRUSTED BY FAST-MOVING COMPANIES WORLDWIDE",
        };
        break;
      case "CallToActionSection":
        extraProps = {
          title: "Ready to launch your next big idea?",
          subtitle: "Join over 10,000+ creators building fast, modern websites today.",
          buttonText: "Build Your Website Now",
        };
        break;
      case "ContactSection":
        extraProps = {
          title: "Get in Touch with Our Team",
          subtitle: "Fill out the form below. Leads are instantly saved to your site inbox.",
        };
        break;
      case "CountdownSection":
        extraProps = {
          title: "Limited Time Offer: Launch Special",
          subtitle: "Lock in lifetime early-access pricing before the countdown runs out.",
          buttonText: "Claim 50% Off Now",
        };
        break;
      case "PostsGridSection":
        extraProps = {
          title: "From the Nexoraft Publication",
          subtitle: "Tutorials, design system playbooks, and architectural deep-dives from our engineering team.",
        };
        break;
      case "TeamSection":
        extraProps = {
          title: "Meet the Minds Behind the Vision",
          subtitle: "Designers, builders, and engineers united by an obsession with visual craft and developer freedom.",
        };
        break;
      case "VideoSection":
        extraProps = {
          title: "Watch How Nexoraft Ships in Minutes",
          subtitle: "A complete walkthrough of the WordPress-grade CMS, Elementor Pro visual canvas, and Next.js 15 App Router export.",
          thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
          badge: "✦ FEATURE SHOWCASE",
        };
        break;
      case "FooterSection":
        extraProps = {
          title: websiteName || "Nexoraft Studio",
          content: "The visual website builder for modern creators and engineering teams. Export to Next.js in seconds.",
        };
        break;
      case "Heading":
        extraProps = { title: "New Section Headline", subtitle: "Enter descriptive subtitle text here." };
        break;
      case "Text":
        extraProps = { content: "Empowering teams to design, iterate, and deploy production-ready digital products with maximum speed." };
        break;
      case "Button":
        extraProps = { buttonText: "Click Action", variant: "primary" };
        break;
      case "Badge":
        extraProps = { badge: "✨ FEATURE HIGHLIGHT" };
        break;
      case "Image":
        extraProps = {
          src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
          alt: "Visual showcase preview",
        };
        break;
      case "Card":
        extraProps = {
          title: "Feature Card",
          description: "Modular card to highlight services, features, or products.",
          buttonText: "Explore More",
        };
        break;
      case "Divider":
        extraProps = { variant: "solid" };
        break;
      case "Spacer":
        extraProps = { height: 40 };
        break;
      default:
        break;
    }

    const newElement: ElementNode = {
      id: newId,
      label,
      elementType: type,
      visible: true,
      ...extraProps,
    };

    dispatch(addElement(parentId, newElement));
    setShowInspector(true);
  };

  const handleDuplicate = () => {
    if (!elementConfig) return;
    const newId = generateElementId("elem");
    const cloned = JSON.parse(JSON.stringify(elementConfig));
    cloned.id = newId;
    cloned.label = `${elementConfig.label || "Element"} (Copy)`;
    const parentId = activePageConfig?.rootElementId || "root";
    dispatch(addElement(parentId, cloned));
  };

  const handleDelete = () => {
    if (!elementConfig) return;
    dispatch(removeElement({ id: elementConfig.id }));
  };

  const handlePropertyChange = (key: string, value: unknown) => {
    if (!elementConfig) return;
    dispatch(updateElement(elementConfig.id, { [key]: value }));
  };

  const handleStyleChange = (key: string, value: unknown) => {
    if (!elementConfig) return;
    const currentStyles = elementConfig.style || {};
    dispatch(updateElement(elementConfig.id, { style: { ...currentStyles, [key]: value } }));
  };

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageName) return;
    addPage({
      name: newPageName,
      slug: newPageSlug || `/${newPageName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    });
    setNewPageName("");
    setNewPageSlug("");
    setShowNewPageModal(false);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle) return;
    addPost({
      title: postTitle,
      slug: postSlug || postTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      excerpt: postExcerpt,
      content: postContent,
      category: postCategory,
      author: postAuthor,
      status: "published",
    });
    setPostTitle("");
    setPostSlug("");
    setPostExcerpt("");
    setPostContent("");
    setShowNewPostModal(false);
  };

  const handleCreateMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl) return;
    addMedia({
      name: mediaName || "Uploaded Media",
      url: mediaUrl,
      alt: mediaAlt || "Website asset",
      size: "150 KB",
      mimeType: "image/jpeg",
    });
    setMediaName("");
    setMediaUrl("");
    setMediaAlt("");
    setShowAddMediaModal(false);
  };

  const handleExportLeadsCsv = () => {
    if (submissions.length === 0) return;
    const header = "Date,Form,Name,Email,Message\n";
    const rows = submissions
      .map((s) => {
        const date = new Date(s.submittedAt).toISOString();
        const name = (s.data.name || "").replace(/"/g, '""');
        const email = (s.data.email || "").replace(/"/g, '""');
        const msg = (s.data.message || "").replace(/"/g, '""');
        return `"${date}","${s.formName}","${name}","${email}","${msg}"`;
      })
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${websiteName.toLowerCase().replace(/\s+/g, "-")}-leads.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const computeDeviceContainerWidth = () => {
    if (deviceType === "mobile") {
      return "max-w-[390px] mx-auto shadow-2xl rounded-3xl border-8 border-slate-800 bg-white dark:bg-slate-900";
    } else if (deviceType === "tablet") {
      return "max-w-[768px] mx-auto shadow-2xl rounded-2xl border-4 border-slate-700 bg-white dark:bg-slate-900";
    }
    return "w-full max-w-7xl mx-auto rounded-xl shadow-xs";
  };

  return (
    <div className={`react-form-builder flex flex-col gap-3 w-full ${props.className || ""}`}>
      {/* Top Navbar Component */}
      <NavbarComponentWrapper
        pageConfig={activePageConfig}
        deviceType={deviceType}
        onDeviceChange={setDeviceType}
        isPreview={isPreview}
        onTogglePreview={() => setIsPreview(!isPreview)}
        calledFrom="builder"
      />

      {/* Main Studio Area */}
      <div className="flex gap-3 items-start w-full relative">
        {/* Left Drawer / Dock (Elementor-Grade) */}
        {!isPreview && (
          <aside className="w-80 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-slate-800 dark:text-slate-100 flex flex-col sticky top-3 max-h-[calc(100vh-100px)] overflow-hidden">
            {/* Tab Switcher Icons */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-2 py-1.5 bg-slate-50/60 dark:bg-slate-800/40">
              <button
                type="button"
                onClick={() => setActiveSidebarTab("blocks")}
                title="Blocks Library"
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  activeSidebarTab === "blocks"
                    ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveSidebarTab("layers")}
                title="Layers & Hierarchy"
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  activeSidebarTab === "layers"
                    ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveSidebarTab("pages")}
                title="Pages Management"
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  activeSidebarTab === "pages"
                    ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveSidebarTab("blog")}
                title="Blog Posts CMS"
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  activeSidebarTab === "blog"
                    ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <BookOpen className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveSidebarTab("media")}
                title="Media Assets"
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  activeSidebarTab === "media"
                    ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveSidebarTab("leads")}
                title="Form Leads Inbox"
                className={`p-2 rounded-xl text-xs font-bold transition-all relative ${
                  activeSidebarTab === "leads"
                    ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Mail className="w-4 h-4" />
                {submissions.filter((s) => s.status === "new").length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveSidebarTab("theme")}
                title="Design System & Theme Tokens"
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  activeSidebarTab === "theme"
                    ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Palette className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveSidebarTab("revisions")}
                title="Revisions History"
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  activeSidebarTab === "revisions"
                    ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <History className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 overflow-y-auto flex-1 max-h-[calc(100vh-160px)]">
              {/* 1. Blocks Tab */}
              {activeSidebarTab === "blocks" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
                      Marketing Sections
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { type: "HeroSection", label: "Hero Banner", icon: Sparkles },
                        { type: "FeatureGridSection", label: "Feature Grid", icon: Layout },
                        { type: "StatsSection", label: "Stats Counter", icon: BarChart3 },
                        { type: "TestimonialsSection", label: "Testimonials", icon: Star },
                        { type: "PricingSection", label: "Pricing Table", icon: Layout },
                        { type: "FAQSection", label: "FAQ Accordion", icon: HelpCircle },
                        { type: "CountdownSection", label: "Countdown Timer", icon: Clock },
                        { type: "PostsGridSection", label: "Posts Loop", icon: BookOpen },
                        { type: "TeamSection", label: "Team Grid", icon: Users },
                        { type: "VideoSection", label: "Video Showcase", icon: Play },
                        { type: "LogoStripSection", label: "Logo Strip", icon: Building },
                        { type: "CallToActionSection", label: "Call to Action", icon: MousePointer },
                        { type: "ContactSection", label: "Contact Form", icon: Mail },
                        { type: "NavbarSection", label: "Navbar Header", icon: PanelBottom },
                        { type: "FooterSection", label: "Site Footer", icon: PanelBottom },
                      ].map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => handleInsertElement(item.type, item.label)}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-700 flex flex-col items-center gap-1.5 transition-all text-slate-700 dark:text-slate-300 cursor-pointer text-center"
                        >
                          <item.icon className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-[11px]">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
                      Layout & Structure
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { type: "Container", label: "Section Box", icon: Layout },
                        { type: "Card", label: "Feature Card", icon: Columns },
                        { type: "Divider", label: "Divider Line", icon: Minus },
                        { type: "Spacer", label: "Vertical Spacer", icon: MoveVertical },
                      ].map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => handleInsertElement(item.type, item.label)}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-700 flex flex-col items-center gap-1.5 transition-all text-slate-700 dark:text-slate-300 cursor-pointer text-center"
                        >
                          <item.icon className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-[11px]">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
                      Content Elements
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { type: "Heading", label: "Heading Text", icon: Heading },
                        { type: "Text", label: "Paragraph", icon: Type },
                        { type: "Button", label: "Action Button", icon: MousePointer },
                        { type: "Badge", label: "Highlight Badge", icon: Sparkles },
                        { type: "Image", label: "Image Asset", icon: ImageIcon },
                      ].map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => handleInsertElement(item.type, item.label)}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-700 flex flex-col items-center gap-1.5 transition-all text-slate-700 dark:text-slate-300 cursor-pointer text-center"
                        >
                          <item.icon className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-[11px]">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Layers / Hierarchy Tab */}
              {activeSidebarTab === "layers" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Page Element Tree
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {Object.keys(elements).length} nodes
                    </span>
                  </div>

                  <div className="space-y-1">
                    {Object.values(elements).map((node) => {
                      const isFocused = targetElementId === node.id;
                      return (
                        <div
                          key={node.id}
                          onClick={() => setFocusedElement(node.id)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                            isFocused
                              ? "bg-blue-600 text-white font-bold"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-[10px] font-mono opacity-60">
                              #{node.id.slice(-4)}
                            </span>
                            <span className="truncate">{node.label || node.elementType || "Element"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {node.visible === false && (
                              <EyeOff className="w-3 h-3 text-slate-400" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Pages CMS Tab */}
              {activeSidebarTab === "pages" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Site Pages ({Object.keys(pages).length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowNewPageModal(true)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>New Page</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {Object.values(pages).map((p) => {
                      const isActive = p.id === activePage;
                      return (
                        <div
                          key={p.id}
                          className={`p-3 rounded-xl border transition-all ${
                            isActive
                              ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 shadow-xs"
                              : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div
                              onClick={() => setActivePage(p.id)}
                              className="cursor-pointer flex-1"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-900 dark:text-white">
                                  {p.name}
                                </span>
                                {isActive && (
                                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-600 text-white uppercase">
                                    Active
                                  </span>
                                )}
                              </div>
                              <code className="text-[10px] text-slate-500 font-mono">
                                {p.slug}
                              </code>
                            </div>
                            {Object.keys(pages).length > 1 && (
                              <button
                                type="button"
                                onClick={() => deletePage(p.id)}
                                title="Delete page"
                                className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Blog Posts CMS Tab */}
              {activeSidebarTab === "blog" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Blog Articles ({posts.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowNewPostModal(true)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>New Post</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {posts.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400">
                        No articles published yet. Click New Post to add one.
                      </div>
                    ) : (
                      posts.map((post) => (
                        <div
                          key={post.id}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                              {post.title}
                            </h4>
                            <button
                              type="button"
                              onClick={() => deletePost(post.id)}
                              className="text-slate-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                            <span>{post.category}</span>
                            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 5. Media Library Tab */}
              {activeSidebarTab === "media" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Media Assets ({media.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddMediaModal(true)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Upload</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {media.map((asset) => (
                      <div
                        key={asset.id}
                        className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex flex-col"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={asset.url}
                          alt={asset.alt}
                          className="w-full h-20 object-cover"
                        />
                        <div className="p-1.5 flex items-center justify-between text-[10px]">
                          <span className="truncate max-w-[80px] font-semibold text-slate-700 dark:text-slate-300">
                            {asset.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteMedia(asset.id)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        {elementConfig && elementConfig.src !== undefined && (
                          <button
                            type="button"
                            onClick={() => handlePropertyChange("src", asset.url)}
                            className="absolute inset-0 bg-blue-600/80 text-white font-bold text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            Apply Image
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Leads & Inquiries Tab */}
              {activeSidebarTab === "leads" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Form Leads ({submissions.length})
                    </h3>
                    {submissions.length > 0 && (
                      <button
                        type="button"
                        onClick={handleExportLeadsCsv}
                        className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>CSV</span>
                      </button>
                    )}
                  </div>

                  {submissions.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      No lead inquiries received yet. Submit a message via the Contact Form in preview to test lead capture.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {submissions.map((lead) => (
                        <div
                          key={lead.id}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {lead.data.name || "Anonymous"}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateSubmissionStatus(
                                  lead.id,
                                  lead.status === "new" ? "read" : "new"
                                )
                              }
                              title="Click to toggle read status"
                              className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase cursor-pointer ${
                                lead.status === "new"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {lead.status}
                            </button>
                          </div>
                          <p className="text-[11px] text-blue-600 dark:text-blue-400">
                            {lead.data.email}
                          </p>
                          {lead.data.message && (
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                              &ldquo;{lead.data.message}&rdquo;
                            </p>
                          )}
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span>{new Date(lead.submittedAt).toLocaleTimeString()}</span>
                            <button
                              type="button"
                              onClick={() => deleteSubmission(lead.id)}
                              className="text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 7. Design System & Theme Tab */}
              {activeSidebarTab === "theme" && (
                <div className="space-y-4 text-xs">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Global Design Tokens
                  </h3>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Primary Brand Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeCode}
                        onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                      />
                      <input
                        type="text"
                        value={themeCode}
                        onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Secondary Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Font Family
                    </label>
                    <select
                      value={fontFamily}
                      onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    >
                      <option value="Inter, sans-serif">Inter (Clean Modern Sans)</option>
                      <option value="Outfit, sans-serif">Outfit (Geometric Tech)</option>
                      <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans</option>
                      <option value="Space Grotesk, sans-serif">Space Grotesk (Neo-Brutalist)</option>
                      <option value="Playfair Display, serif">Playfair Display (Editorial Serif)</option>
                      <option value="Roboto, sans-serif">Roboto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Border Radius Scale
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      {(["none", "sm", "md", "lg"] as const).map((rad) => (
                        <button
                          key={rad}
                          type="button"
                          onClick={() => updateTheme({ borderRadius: rad })}
                          className={`py-1.5 rounded-lg border text-xs font-semibold capitalize ${
                            borderRadius === rad
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          {rad}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 8. Revisions & History Tab */}
              {activeSidebarTab === "revisions" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Publish Revisions ({revisions.length})
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {revisions.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {rev.summary}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>{rev.author}</span>
                          <span>{new Date(rev.timestamp).toLocaleString()}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Restore revision from ${new Date(rev.timestamp).toLocaleString()}?`)) {
                              restoreRevision(rev.id);
                            }
                          }}
                          className="w-full mt-1 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restore Version</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Central Visual Canvas Area */}
        <div className="flex-1 min-h-[calc(100vh-140px)] bg-slate-100/70 dark:bg-slate-950 p-2 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-center overflow-auto transition-all">
          <div className={`transition-all duration-300 min-h-[600px] overflow-hidden ${computeDeviceContainerWidth()}`}>
            <Preview rootId={activePageConfig?.rootElementId} isPreview={isPreview} />
          </div>
        </div>

        {/* Right Element Inspector Panel (Elementor-Grade) */}
        {!isPreview && showInspector && elementConfig && (
          <aside className="w-80 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm text-slate-800 dark:text-slate-100 flex flex-col gap-4 sticky top-3 max-h-[calc(100vh-100px)] overflow-y-auto">
            {/* Inspector Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Element Inspector
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleDuplicate}
                  title="Duplicate element"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  title="Delete element"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowInspector(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Element Identity Badge */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-xl text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {elementConfig.elementType || "Element"}
              </span>
              <code className="text-[10px] font-mono text-blue-500">
                #{elementConfig.id.slice(-6)}
              </code>
            </div>

            {/* Inspector Tabs: Content | Style | Advanced */}
            <div className="flex items-center border-b border-slate-100 dark:border-slate-800 text-xs">
              {(["content", "style", "advanced"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setInspectorTab(tab)}
                  className={`flex-1 py-1.5 font-bold uppercase tracking-wider border-b-2 capitalize transition-colors ${
                    inspectorTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Inspector Tab 1: Content */}
            {inspectorTab === "content" && (
              <div className="space-y-3.5 text-xs">
                {elementConfig.badge !== undefined && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={elementConfig.badge || ""}
                      onChange={(e) => handlePropertyChange("badge", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {elementConfig.title !== undefined && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Headline / Title
                    </label>
                    <input
                      type="text"
                      value={elementConfig.title || ""}
                      onChange={(e) => handlePropertyChange("title", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {elementConfig.subtitle !== undefined && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Subtitle / Description
                    </label>
                    <textarea
                      rows={3}
                      value={elementConfig.subtitle || ""}
                      onChange={(e) => handlePropertyChange("subtitle", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {elementConfig.content !== undefined && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Body Content
                    </label>
                    <textarea
                      rows={3}
                      value={elementConfig.content || ""}
                      onChange={(e) => handlePropertyChange("content", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {elementConfig.buttonText !== undefined && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={elementConfig.buttonText || ""}
                      onChange={(e) => handlePropertyChange("buttonText", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {elementConfig.buttonSecondaryText !== undefined && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Secondary Button
                    </label>
                    <input
                      type="text"
                      value={elementConfig.buttonSecondaryText || ""}
                      onChange={(e) => handlePropertyChange("buttonSecondaryText", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {elementConfig.src !== undefined && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={elementConfig.src || ""}
                      onChange={(e) => handlePropertyChange("src", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {elementConfig.alt !== undefined && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Alt Description (SEO)
                    </label>
                    <input
                      type="text"
                      value={elementConfig.alt || ""}
                      onChange={(e) => handlePropertyChange("alt", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Inspector Tab 2: Style */}
            {inspectorTab === "style" && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={String(elementConfig.style?.backgroundColor || "#ffffff")}
                      onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                      className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={String(elementConfig.style?.backgroundColor || "")}
                      onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                      placeholder="#ffffff or transparent"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Padding
                  </label>
                  <select
                    value={String(elementConfig.style?.padding || "16px")}
                    onChange={(e) => handleStyleChange("padding", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="0px">None (0px)</option>
                    <option value="8px">Small (8px)</option>
                    <option value="16px">Medium (16px)</option>
                    <option value="24px">Large (24px)</option>
                    <option value="32px">XL (32px)</option>
                    <option value="48px">2XL (48px)</option>
                    <option value="64px">3XL (64px)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Border Radius
                  </label>
                  <select
                    value={String(elementConfig.style?.borderRadius || "12px")}
                    onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="0px">Square (0px)</option>
                    <option value="8px">Rounded (8px)</option>
                    <option value="12px">Smooth (12px)</option>
                    <option value="20px">Curved (20px)</option>
                    <option value="9999px">Pill / Circle</option>
                  </select>
                </div>
              </div>
            )}

            {/* Inspector Tab 3: Advanced */}
            {inspectorTab === "advanced" && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Node ID
                  </label>
                  <input
                    type="text"
                    disabled
                    value={elementConfig.id}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[10px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Custom Tailwind / CSS Classes
                  </label>
                  <input
                    type="text"
                    value={elementConfig.className || ""}
                    onChange={(e) => handlePropertyChange("className", e.target.value)}
                    placeholder="e.g. shadow-2xl hover:scale-105"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Visible on Canvas
                  </span>
                  <input
                    type="checkbox"
                    checked={elementConfig.visible !== false}
                    onChange={(e) => handlePropertyChange("visible", e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* New Page Modal */}
      <Modal
        isOpen={showNewPageModal}
        onClose={() => setShowNewPageModal(false)}
        title="Create New Page"
      >
        <form onSubmit={handleCreatePage} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Page Name
            </label>
            <input
              type="text"
              required
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              placeholder="e.g. Services, Portfolio, Pricing"
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              URL Slug
            </label>
            <input
              type="text"
              value={newPageSlug}
              onChange={(e) => setNewPageSlug(e.target.value)}
              placeholder="/services"
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowNewPageModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Create Page
            </button>
          </div>
        </form>
      </Modal>

      {/* New Post Modal */}
      <Modal
        isOpen={showNewPostModal}
        onClose={() => setShowNewPostModal(false)}
        title="Publish New Blog Post"
      >
        <form onSubmit={handleCreatePost} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Article Title
            </label>
            <input
              type="text"
              required
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="e.g. Building Modern Web Applications"
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Author
              </label>
              <input
                type="text"
                value={postAuthor}
                onChange={(e) => setPostAuthor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Short Excerpt
            </label>
            <textarea
              rows={2}
              value={postExcerpt}
              onChange={(e) => setPostExcerpt(e.target.value)}
              placeholder="Summary for blog index cards..."
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Article Content
            </label>
            <textarea
              rows={4}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Full article content..."
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowNewPostModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Save Post
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Media Modal */}
      <Modal
        isOpen={showAddMediaModal}
        onClose={() => setShowAddMediaModal(false)}
        title="Add Media Asset"
      >
        <form onSubmit={handleCreateMedia} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Asset Name
            </label>
            <input
              type="text"
              required
              value={mediaName}
              onChange={(e) => setMediaName(e.target.value)}
              placeholder="e.g. Product Screenshot"
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Image URL
            </label>
            <input
              type="url"
              required
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Alt Text
            </label>
            <input
              type="text"
              value={mediaAlt}
              onChange={(e) => setMediaAlt(e.target.value)}
              placeholder="Descriptive text for accessibility"
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddMediaModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Add Asset
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReactFormBuilder;

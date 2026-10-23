"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageConfig, DeviceType, WebsiteSite, CustomBreakpoints } from "./types";
import { useFormBuilderState } from "./context/FormBuilderContext";
import Modal from "./ui/Modal";
import ExportModal from "./ExportModal";
import {
  Monitor,
  Tablet,
  Smartphone,
  Laptop,
  Sliders,
  Download,
  Eye,
  EyeOff,
  ChevronLeft,
  CheckCircle2,
  Undo2,
  Redo2,
  UploadCloud,
  ChevronDown,
  Globe,
  Edit2,
  Check,
  Loader2,
  FileText,
  Home,
} from "lucide-react";

export interface NavbarComponentWrapperProps {
  pageConfig?: PageConfig;
  deviceType?: DeviceType;
  computeRefWidth?: boolean;
  calledFrom?: string;
  onDeviceChange?: (device: DeviceType) => void;
  isPreview?: boolean;
  onTogglePreview?: () => void;
  className?: string;
}

export const NavbarComponentWrapper: React.FC<NavbarComponentWrapperProps> = ({
  deviceType = "desktop",
  onDeviceChange,
  isPreview = false,
  onTogglePreview,
  className = "",
}) => {
  const {
    websiteId,
    websiteName,
    websiteDescription,
    themeCode,
    secondaryColor,
    accentColor,
    fontFamily,
    headingFont,
    borderRadius,
    elements,
    pages,
    activePage,
    setActivePage,
    setWebsiteName,
    saveStatus,
    canUndo,
    canRedo,
    undo,
    redo,
    publishSite,
    posts,
    media,
    submissions,
    revisions,
    breakpoints,
    updateBreakpoints,
  } = useFormBuilderState();

  const [internalDevice, setInternalDevice] = useState<DeviceType>(deviceType);
  const activeDevice = onDeviceChange ? deviceType : internalDevice;
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showBreakpointsModal, setShowBreakpointsModal] = useState(false);
  const [tempBreakpoints, setTempBreakpoints] = useState<CustomBreakpoints>(
    breakpoints || { desktop: 1280, laptop: 1024, tablet: 768, mobile: 390, custom: 640 }
  );
  const [publishSummary, setPublishSummary] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(websiteName);
  const [showPageMenu, setShowPageMenu] = useState(false);

  const handleDeviceChange = (dev: DeviceType) => {
    setInternalDevice(dev);
    onDeviceChange?.(dev);
  };

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      setWebsiteName(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      publishSite(publishSummary || "Published changes from Nexoraft Studio");
      setIsPublishing(false);
      setShowPublishModal(false);
      setPublishSummary("");
    }, 400);
  };

  const activePageObj = pages[activePage] || Object.values(pages)[0];

  const currentSiteForExport = useMemo<WebsiteSite>(() => {
    return {
      id: websiteId,
      name: websiteName,
      slug: websiteName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: websiteDescription,
      category: "saas",
      status: "published",
      createdAt: 0,
      updatedAt: 0,
      theme: {
        primaryColor: themeCode,
        secondaryColor,
        accentColor,
        fontFamily,
        headingFont,
        borderRadius,
        mode: "light",
      },
      pages,
      activePage,
      elements,
      posts,
      media,
      submissions,
      revisions,
    };
  }, [
    websiteId,
    websiteName,
    websiteDescription,
    themeCode,
    secondaryColor,
    accentColor,
    fontFamily,
    headingFont,
    borderRadius,
    pages,
    activePage,
    elements,
    posts,
    media,
    submissions,
    revisions,
  ]);

  return (
    <>
      <header
        className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 sm:px-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-slate-800 dark:text-slate-100 ${className}`}
      >
        {/* Left Section: Back to Dashboard, Brand, Website Title & Page Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Back to Nexoraft Dedicated Dashboard */}
          <Link
            href={websiteId ? `/project/${websiteId}` : "/"}
            title="Return to Nexoraft CMS Dashboard"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#1d2327] hover:bg-[#2c3338] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#72aee6]" />
            <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
              N
            </div>
            <span className="hidden sm:inline font-semibold">Nexoraft CMS</span>
          </Link>

          {/* Return to All Sites Hub */}
          <Link
            href="/"
            title="All Website Projects"
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-medium transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Hub</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Inline Website Title Editor */}
          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                  if (e.key === "Escape") setIsEditingTitle(false);
                }}
                className="px-2 py-1 text-xs font-bold rounded-lg border border-blue-500 bg-white dark:bg-slate-800 focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveTitle}
                className="p-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => {
                setTempTitle(websiteName);
                setIsEditingTitle(true);
              }}
              title="Click to rename website"
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer group"
            >
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white max-w-[140px] sm:max-w-[200px] truncate">
                {websiteName}
              </span>
              <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}

          {/* Active Page Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPageMenu(!showPageMenu)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>{activePageObj?.name || "Page"}</span>
              <span className="text-[10px] text-slate-400">
                ({activePageObj?.slug || "/"})
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {showPageMenu && (
              <div className="absolute top-full left-0 mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs">
                <div className="px-3 py-1 font-bold text-[10px] uppercase text-slate-400">
                  Switch Page
                </div>
                {Object.values(pages).map((page) => (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => {
                      setActivePage(page.id);
                      setShowPageMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      page.id === activePage
                        ? "text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/40"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>{page.name}</span>
                    <span className="text-[10px] text-slate-400">{page.slug}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Undo/Redo & Device Breakpoint Switcher */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className={`p-1.5 rounded-lg text-slate-600 dark:text-slate-300 transition-colors ${
                canUndo
                  ? "hover:bg-white dark:hover:bg-slate-700 cursor-pointer"
                  : "opacity-30 cursor-not-allowed"
              }`}
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              className={`p-1.5 rounded-lg text-slate-600 dark:text-slate-300 transition-colors ${
                canRedo
                  ? "hover:bg-white dark:hover:bg-slate-700 cursor-pointer"
                  : "opacity-30 cursor-not-allowed"
              }`}
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Device Breakpoint Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleDeviceChange("desktop")}
              title={`Desktop View (${breakpoints?.desktop || 1280}px)`}
              className={`p-1.5 rounded-lg transition-all ${
                activeDevice === "desktop"
                  ? "bg-white dark:bg-slate-700 text-blue-600 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleDeviceChange("laptop")}
              title={`Laptop View (${breakpoints?.laptop || 1024}px)`}
              className={`p-1.5 rounded-lg transition-all ${
                activeDevice === "laptop"
                  ? "bg-white dark:bg-slate-700 text-blue-600 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Laptop className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleDeviceChange("tablet")}
              title={`Tablet View (${breakpoints?.tablet || 768}px)`}
              className={`p-1.5 rounded-lg transition-all ${
                activeDevice === "tablet"
                  ? "bg-white dark:bg-slate-700 text-blue-600 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleDeviceChange("mobile")}
              title={`Mobile View (${breakpoints?.mobile || 390}px)`}
              className={`p-1.5 rounded-lg transition-all ${
                activeDevice === "mobile"
                  ? "bg-white dark:bg-slate-700 text-blue-600 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>

            <div className="h-3 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

            <button
              type="button"
              onClick={() => {
                setTempBreakpoints(
                  breakpoints || { desktop: 1280, laptop: 1024, tablet: 768, mobile: 390, custom: 640 }
                );
                setShowBreakpointsModal(true);
              }}
              title="Custom Breakpoints & Viewport Settings"
              className="px-2 py-1 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 text-xs"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px] font-mono font-medium hidden sm:inline">
                {activeDevice === "desktop"
                  ? `${breakpoints?.desktop || 1280}px`
                  : activeDevice === "laptop"
                  ? `${breakpoints?.laptop || 1024}px`
                  : activeDevice === "tablet"
                  ? `${breakpoints?.tablet || 768}px`
                  : activeDevice === "mobile"
                  ? `${breakpoints?.mobile || 390}px`
                  : `${breakpoints?.custom || 640}px`}
              </span>
            </button>
          </div>
        </div>

        {/* Right Section: Save Status, Publish, Preview, and Export Code */}
        <div className="flex items-center gap-2">
          {/* Save Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="w-3 h-3 text-amber-500 animate-spin" />
                <span className="text-amber-600 dark:text-amber-400">Saving...</span>
              </>
            ) : saveStatus === "published" ? (
              <>
                <Globe className="w-3 h-3 text-purple-600" />
                <span className="text-purple-600 dark:text-purple-400 font-bold">Published</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Saved</span>
              </>
            )}
          </div>

          {/* Publish Button */}
          <button
            type="button"
            onClick={() => setShowPublishModal(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Publish</span>
          </button>

          {/* Live Preview Button */}
          <button
            type="button"
            onClick={onTogglePreview}
            title={isPreview ? "Exit Live Preview" : "Enter Live Preview"}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              isPreview
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
            }`}
          >
            {isPreview ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Exit Preview</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </>
            )}
          </button>

          {/* Export Code Button */}
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Code</span>
          </button>
        </div>
      </header>

      {/* Publish Revision Modal */}
      <Modal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title="Publish Live Revision"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2.5">
            <UploadCloud className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Publish Snapshot</p>
              <p className="text-[11px] text-purple-700 dark:text-purple-300 mt-0.5">
                Publishing creates an immutable revision snapshot. You can roll back or restore any previous published state at any time from the Revisions tab.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Revision Summary / Release Note
            </label>
            <input
              type="text"
              value={publishSummary}
              onChange={(e) => setPublishSummary(e.target.value)}
              placeholder="e.g. Added pricing FAQ, updated hero headline"
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowPublishModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all flex items-center gap-1.5"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Publish Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Responsive Breakpoints Settings Modal */}
      {showBreakpointsModal && (
        <Modal
          isOpen={showBreakpointsModal}
          onClose={() => setShowBreakpointsModal(false)}
          title="Responsive Breakpoint Configuration"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-500 dark:text-slate-400">
              Customize the exact pixel widths for your responsive design breakpoints. The Nexoraft canvas and preview adapt immediately.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Monitor className="w-3.5 h-3.5 text-blue-600" /> Desktop (px)
                </label>
                <input
                  type="number"
                  value={tempBreakpoints.desktop}
                  onChange={(e) =>
                    setTempBreakpoints((prev) => ({
                      ...prev,
                      desktop: Number(e.target.value) || 1280,
                    }))
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Laptop className="w-3.5 h-3.5 text-indigo-600" /> Laptop (px)
                </label>
                <input
                  type="number"
                  value={tempBreakpoints.laptop}
                  onChange={(e) =>
                    setTempBreakpoints((prev) => ({
                      ...prev,
                      laptop: Number(e.target.value) || 1024,
                    }))
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Tablet className="w-3.5 h-3.5 text-purple-600" /> Tablet (px)
                </label>
                <input
                  type="number"
                  value={tempBreakpoints.tablet}
                  onChange={(e) =>
                    setTempBreakpoints((prev) => ({
                      ...prev,
                      tablet: Number(e.target.value) || 768,
                    }))
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" /> Mobile (px)
                </label>
                <input
                  type="number"
                  value={tempBreakpoints.mobile}
                  onChange={(e) =>
                    setTempBreakpoints((prev) => ({
                      ...prev,
                      mobile: Number(e.target.value) || 390,
                    }))
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Custom Viewport Test Width
                </span>
                <span className="font-mono text-blue-600 font-bold">
                  {tempBreakpoints.custom || 640}px
                </span>
              </div>
              <input
                type="range"
                min="320"
                max="1920"
                step="10"
                value={tempBreakpoints.custom || 640}
                onChange={(e) =>
                  setTempBreakpoints((prev) => ({
                    ...prev,
                    custom: Number(e.target.value),
                  }))
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>320px (Mobile S)</span>
                <span>768px (Tablet)</span>
                <span>1024px (Laptop)</span>
                <span>1920px (Full HD)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setTempBreakpoints({
                    desktop: 1280,
                    laptop: 1024,
                    tablet: 768,
                    mobile: 390,
                    custom: 640,
                  });
                }}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Reset Defaults
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowBreakpointsModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateBreakpoints(tempBreakpoints);
                    setShowBreakpointsModal(false);
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Apply Breakpoints
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Export Code Modal */}
      {showExportModal && (
        <ExportModal
          site={currentSiteForExport}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </>
  );
};

export default NavbarComponentWrapper;

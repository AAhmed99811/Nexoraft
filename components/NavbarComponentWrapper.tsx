"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageConfig, DeviceType, WebsiteSite } from "./types";
import { useFormBuilderState, elementSlice } from "./context/FormBuilderContext";
import Modal from "./ui/Modal";
import ExportModal from "./ExportModal";
import {
  Monitor,
  Tablet,
  Smartphone,
  Plus,
  Trash2,
  Download,
  Eye,
  EyeOff,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Layers,
  FileText,
  DollarSign,
  Mail,
  PanelBottom,
  Heading,
  Type,
  MousePointer,
  SquareCheck,
  ImageIcon,
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
  pageConfig,
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
    fontFamily,
    focusedElement,
    elements,
    pages,
    activePage,
    dispatch,
    setWebsiteName,
  } = useFormBuilderState();

  const [activeDevice, setActiveDevice] = useState<DeviceType>(deviceType);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(websiteName);

  const handleDeviceChange = (dev: DeviceType) => {
    setActiveDevice(dev);
    onDeviceChange?.(dev);
  };

  const handleAddElement = (type: string, label: string) => {
    const parentId =
      focusedElement && elements[focusedElement]?.elementType === "Container"
        ? focusedElement
        : pageConfig?.rootElementId || "root";

    const newId = `elem-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
    let extraProps: Record<string, unknown> = {};

    switch (type) {
      case "Container":
        extraProps = { children: [], style: { padding: "24px", minHeight: "120px" } };
        break;
      case "NavbarSection":
        extraProps = {
          title: websiteName || "Brand",
          subtitle: "Digital Studio",
          buttonText: "Get Started",
          items: [
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "About", href: "#about" },
          ],
        };
        break;
      case "HeroSection":
        extraProps = {
          badge: "✨ NEW GENERATION BUILDER",
          title: "Build, Iterate, and Launch Your Vision",
          subtitle: "Create production-ready web experiences with complete design control and instant code export.",
          buttonText: "Start Free Trial",
          buttonSecondaryText: "Learn More",
        };
        break;
      case "FeatureGridSection":
        extraProps = {
          title: "Next-Level Capabilities",
          subtitle: "Designed from first principles to empower teams to ship modern software.",
          items: [
            { title: "Visual Flexibility", description: "Design responsive components with fine-grained control." },
            { title: "Production Code", description: "Exports clean Next.js and React components." },
            { title: "Universal Deployment", description: "Ready for Vercel, Netlify, and Cloudflare Pages." },
          ],
        };
        break;
      case "PricingSection":
        extraProps = {
          title: "Simple & Transparent Pricing",
          subtitle: "Select the plan that fits your business stage.",
        };
        break;
      case "CallToActionSection":
        extraProps = {
          title: "Start Building with WebCraft Today",
          subtitle: "Join the next wave of high-velocity web developers.",
          buttonText: "Get Started Free",
        };
        break;
      case "ContactSection":
        extraProps = {
          title: "Let's Build Something Great",
          subtitle: "Fill out the form below and we will get back to you within 24 hours.",
        };
        break;
      case "FooterSection":
        extraProps = {
          title: websiteName || "WebCraft Studio",
          content: "Visual website builder for modern developers and creators.",
        };
        break;
      case "Heading":
        extraProps = { title: "New Section Header", subtitle: "Enter subtitle description here" };
        break;
      case "Text":
        extraProps = { content: "Sample paragraph content describing features or services." };
        break;
      case "Button":
        extraProps = { buttonText: "Click Here", variant: "primary" };
        break;
      case "Badge":
        extraProps = { badge: "✨ FEATURE HIGHLIGHT" };
        break;
      case "Image":
        extraProps = {
          src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
          alt: "Website showcase",
        };
        break;
      case "TextInput":
        extraProps = { placeholder: "Enter text...", label: "Full Name" };
        break;
      case "TextArea":
        extraProps = { placeholder: "Write message...", label: "Message", rows: 3 };
        break;
      case "Select":
        extraProps = {
          label: "Choose Category",
          options: [
            { label: "Option A", value: "a" },
            { label: "Option B", value: "b" },
          ],
        };
        break;
      case "Checkbox":
        extraProps = { checkboxLabel: "I agree to the terms and privacy policy" };
        break;
      default:
        break;
    }

    const newElement = {
      id: newId,
      label,
      elementType: type,
      visible: true,
      ...extraProps,
    };

    dispatch(elementSlice.addElement(parentId, newElement));
    setShowAddMenu(false);
  };

  const handleDeleteFocused = () => {
    if (!focusedElement) return;
    const label = elements[focusedElement]?.label || "element";
    Modal.confirm({
      title: `Delete ${label}`,
      content: (
        <div style={{ width: "240px" }}>
          <div>Are you sure you want to delete this element?</div>
          <div className="text-xs text-slate-500 mt-1">
            This will remove the element and any nested children from this page.
          </div>
        </div>
      ),
      onOk: () => {
        dispatch(elementSlice.removeElement({ id: focusedElement }));
      },
    });
  };

  const currentWebsite: WebsiteSite = useMemo(
    () => ({
      id: websiteId,
      name: websiteName,
      slug: websiteName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: websiteDescription,
      category: "saas",
      updatedAt: 0,
      createdAt: 0,
      theme: {
        primaryColor: themeCode,
        fontFamily,
        mode: "light",
      },
      pages,
      activePage,
      elements,
    }),
    [websiteId, websiteName, websiteDescription, themeCode, fontFamily, pages, activePage, elements]
  );

  return (
    <>
      <aside
        className={`navbar-component-wrapper bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:px-4 shadow-sm flex flex-wrap items-center justify-between gap-3 w-full transition-all ${className}`}
      >
        {/* Left: Back Link & Website Name */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Websites</span>
          </Link>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Website Title (Click to Edit) */}
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (tempTitle.trim()) setWebsiteName(tempTitle.trim());
                  setIsEditingTitle(false);
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={() => {
                    if (tempTitle.trim()) setWebsiteName(tempTitle.trim());
                    setIsEditingTitle(false);
                  }}
                  autoFocus
                  className="px-2 py-1 text-sm font-bold bg-white dark:bg-slate-800 border border-blue-500 rounded-md text-slate-900 dark:text-white focus:outline-none"
                />
              </form>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTempTitle(websiteName);
                  setIsEditingTitle(true);
                }}
                title="Click to rename website"
                className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
              >
                <span>{websiteName || "My Website"}</span>
                <span className="text-[10px] text-slate-400 font-normal">✎</span>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
              <CheckCircle2 className="w-3 h-3" />
              <span>Saved</span>
            </div>
          </div>
        </div>

        {/* Center: Device Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => handleDeviceChange("desktop")}
            className={`p-1.5 sm:px-2.5 sm:py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeDevice === "desktop"
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
            title="Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => handleDeviceChange("tablet")}
            className={`p-1.5 sm:px-2.5 sm:py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeDevice === "tablet"
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
            title="Tablet View"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => handleDeviceChange("mobile")}
            className={`p-1.5 sm:px-2.5 sm:py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              activeDevice === "mobile"
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 relative">
          {/* Add Section/Element Button & Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Block</span>
            </button>

            {showAddMenu && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-96 overflow-y-auto">
                {/* Website Sections */}
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Website Sections
                </div>
                <button
                  type="button"
                  onClick={() => handleAddElement("HeroSection", "Hero Section")}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-100">Hero Section</div>
                    <div className="text-[10px] text-slate-400">Headline, CTA buttons, and badge</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement("NavbarSection", "Navigation Bar")}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-100">Navbar Header</div>
                    <div className="text-[10px] text-slate-400">Logo, links, and action button</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement("FeatureGridSection", "Features Grid")}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-100">Feature 3-Grid</div>
                    <div className="text-[10px] text-slate-400">Showcase core features & icons</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement("PricingSection", "Pricing Table")}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
                >
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-100">Pricing Table</div>
                    <div className="text-[10px] text-slate-400">Tier cards with feature checkmarks</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement("CallToActionSection", "CTA Banner")}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-100">Call to Action</div>
                    <div className="text-[10px] text-slate-400">High-converting gradient banner</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement("ContactSection", "Contact Section")}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-sky-600" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-100">Contact Form</div>
                    <div className="text-[10px] text-slate-400">Inquiry form with submit button</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement("FooterSection", "Footer Section")}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
                >
                  <PanelBottom className="w-4 h-4 text-slate-600" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-100">Site Footer</div>
                    <div className="text-[10px] text-slate-400">Copyright, links, and branding</div>
                  </div>
                </button>

                {/* Content Elements */}
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Components & Content
                </div>
                <button
                  type="button"
                  onClick={() => handleAddElement("Heading", "Headline")}
                  className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium"
                >
                  <Heading className="w-4 h-4 text-slate-500" />
                  <span>Heading Title</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement("Text", "Paragraph")}
                  className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium"
                >
                  <Type className="w-4 h-4 text-slate-500" />
                  <span>Text Paragraph</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement("Button", "Action Button")}
                  className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium"
                >
                  <MousePointer className="w-4 h-4 text-blue-500" />
                  <span>Button</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement("Image", "Image Showcase")}
                  className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-500" />
                  <span>Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement("TextInput", "Text Input")}
                  className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium"
                >
                  <SquareCheck className="w-4 h-4 text-slate-500" />
                  <span>Form Input Field</span>
                </button>
              </div>
            )}
          </div>

          {/* Delete Focused Element */}
          {focusedElement && (
            <button
              type="button"
              onClick={handleDeleteFocused}
              className="p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 transition-colors"
              title="Delete Selected Element"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Toggle Live Preview */}
          {onTogglePreview && (
            <button
              type="button"
              onClick={onTogglePreview}
              className={`p-2 rounded-xl border transition-colors ${
                isPreview
                  ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 border-blue-200"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800"
              }`}
              title={isPreview ? "Exit Preview" : "Live Preview"}
            >
              {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          {/* Export Project Button */}
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Project</span>
          </button>
        </div>
      </aside>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        website={currentWebsite}
      />
    </>
  );
};

export default NavbarComponentWrapper;

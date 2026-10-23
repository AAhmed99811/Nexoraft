"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
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
  LayoutGrid,
  Milestone,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Share2,
  ListCollapse,
  Database,
  Code,
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
      className="classes w-full min-h-full p-2 sm:p-4 transition-all"
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
    accentColor,
    backgroundColor,
    surfaceColor,
    textColor,
    fontFamily,
    headingFont,
    borderRadius,
    updateTheme,
    customVariables,
    addCustomVariable,
    removeCustomVariable,
    breakpoints,
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
    setSelectedElement,
  } = useFormBuilderState();

  const [newVarKey, setNewVarKey] = useState("");
  const [newVarVal, setNewVarVal] = useState("");

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
  const [expandedItemIndex, setExpandedItemIndex] = useState<number | null>(0);

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
  const isRootElement =
    Boolean(elementConfig?.isRoot) ||
    Object.values(pages).some((p) => p.rootElementId === elementConfig?.id);

  // Insert Element Handler
  const handleInsertElement = useCallback((type: string, label: string) => {
    const activePageRoot = activePageConfig?.rootElementId;
    let parentId = activePageRoot;

    if (
      focusedElement &&
      elements[focusedElement] &&
      elements[focusedElement]?.elementType === "Container"
    ) {
      parentId = focusedElement;
    } else if (!parentId || !elements[parentId]) {
      const foundRoot = Object.values(elements).find(
        (el) => el.isRoot || el.elementType === "Container"
      );
      parentId = foundRoot ? foundRoot.id : (activePageRoot || "root");
    }

    const newId = generateElementId("elem");
    let extraProps: Record<string, unknown> = {};

    switch (type) {
      case "Container":
        extraProps = {
          children: [],
          style: { padding: "32px", minHeight: "140px", backgroundColor: "#ffffff" },
        };
        break;
      case "DynamicCardsGridSection":
      case "DynamicCardsGrid":
      case "DynamicCollectionGrid":
        type = "DynamicCardsGridSection";
        extraProps = {
          badge: "⚡ LIVE DATABASE FEED",
          title: "Dynamic Content Grid",
          subtitle: "Directly bound to live Nexoraft CMS database collections with instant query filtering.",
          dataSource: "posts",
          columns: 3,
          count: 6,
          cardStyle: "modern",
          containerWidth: "7xl",
          enableSearch: false,
        };
        break;
      case "FloatingPillNavbar":
        type = "NavbarSection";
        extraProps = {
          title: websiteName || "Nexoraft",
          subtitle: "Pro Studio",
          buttonText: "Launch Studio",
          layoutVariant: "floating-pill",
          isSticky: true,
          transparent: true,
          containerWidth: "7xl",
          items: [
            { label: "Features", href: "#features" },
            { label: "Collections", href: "#collections" },
            { label: "Pricing", href: "#pricing" },
            { label: "Docs", href: "/docs" },
          ],
        };
        break;
      case "NavbarSection":
        extraProps = {
          title: websiteName || "Nexoraft",
          subtitle: "Digital Studio",
          buttonText: "Get Started Free",
          layoutVariant: "standard",
          isSticky: true,
          transparent: true,
          containerWidth: "7xl",
          items: [
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
          ],
        };
        break;
      case "SaaSSplitHero":
        type = "HeroSection";
        extraProps = {
          badge: "✨ NEXT-GEN ARCHITECTURE",
          title: "Ship Production Web Apps 10x Faster",
          subtitle: "Visual design studio powering modern teams with live CMS records, responsive tokens, and zero-runtime lock-in.",
          buttonText: "Start Building Free",
          buttonSecondaryText: "Live Interactive Demo",
          layoutVariant: "split-image-right",
          bgVariant: "radial-glow",
          heroHeight: "large",
          heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
          showSocialProof: true,
          socialProofCount: "5,000+ engineers",
          containerWidth: "7xl",
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
          layoutVariant: "centered",
          bgVariant: "radial-glow",
          heroHeight: "large",
          heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
          showSocialProof: true,
          socialProofCount: "4,200+ founders",
          containerWidth: "7xl",
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
          subtitle: "A complete walkthrough of the Nexoraft CMS dashboard, Nexoraft Visual Studio canvas, and Next.js 15 App Router export.",
          thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
          badge: "✦ FEATURE SHOWCASE",
        };
        break;
      case "BentoGridSection":
      case "BentoGrid":
        extraProps = {
          badge: "✨ NEXORAFT PRO BENTO ENGINE",
          title: "Precision-Engineered for Speed, Scale & Visual Craft",
          subtitle: "Every module is designed to maximize conversion, edge delivery, and production code fidelity.",
          card1Tag: "EDGE COMPUTING",
          card1Title: "Global Sub-10ms TTFB Distribution",
          card1Desc: "Pre-rendered static HTML and assets distributed globally across 300+ edge locations with zero runtime overhead.",
          card2Score: "100/100",
          card2Tag: "PERFORMANCE SCORE",
          card2Title: "Flawless Lighthouse Metrics",
          card3Tag: "CODE PORTABILITY",
          card3Title: "1-Click React & Next.js 15 Export",
          card3Desc: "Extract clean, modular TSX code with Tailwind CSS utilities and zero external dependencies.",
          card4Tag: "INTEGRATED CMS",
          card4Title: "Built-in CMS & Lead Capture",
          card4Desc: "Manage pages, blog posts, navigation menus, and lead captures without external plugins.",
        };
        break;
      case "TimelineSection":
      case "ProcessSection":
      case "WorkflowSection":
        extraProps = {
          badge: "✨ STREAMLINED WORKFLOW",
          title: "From Visual Idea to Production Code in 4 Steps",
          subtitle: "How creators, marketing teams, and developers ship extraordinary web experiences in record time with Nexoraft.",
        };
        break;
      case "NewsletterSection":
      case "LeadMagnetSection":
        extraProps = {
          badge: "✨ WEEKLY ENGINEERING DISPATCH",
          title: "Stay Ahead of Modern Web Craft & Architecture",
          subtitle: "Join 25,000+ developers, designers, and founders receiving curated production components, Next.js 15 guides, and visual builder updates.",
          buttonText: "Subscribe Free",
          placeholder: "Enter your work email address...",
          disclaimer: "🔒 No spam ever • Instant 1-click unsubscribe • Includes free Starter Template Kit",
        };
        break;
      case "StatsCounterSection":
      case "MetricsSection":
        extraProps = {
          title: "Enterprise Grade Impact Metrics",
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
      case "FlipBoxSection":
      case "FlipBox":
        extraProps = {
          badge: "✨ INTERACTIVE 3D CARDS",
          title: "Engage Visitors with Interactive Flip Modules",
          subtitle: "Hover or tap on any card to reveal details, calls to action, and interactive features in full 3D space.",
          items: [
            {
              frontBadge: "ARCHITECT",
              frontTitle: "Visual Studio Canvas",
              frontDesc: "Design fluid responsive layouts with full drag-and-drop precision, auto-layout tokens, and real-time previews.",
              backTitle: "Design Faster Than Ever",
              backDesc: "Cut frontend assembly time by 80% while preserving 100% clean Next.js 15 App Router code structure.",
              buttonText: "Launch Studio",
              buttonHref: "#contact",
            },
            {
              frontBadge: "PERFORMANCE",
              frontTitle: "Sub-10ms Edge Delivery",
              frontDesc: "Deploy static and server-rendered HTML globally across 300+ CDN edge nodes with zero cold starts.",
              backTitle: "Score 100 on Lighthouse",
              backDesc: "Zero bloat, zero cumulative layout shift, and instant core web vitals that guarantee top search rank.",
              buttonText: "View Benchmarks",
              buttonHref: "#pricing",
            },
            {
              frontBadge: "PORTABILITY",
              frontTitle: "Zero Platform Lock-In",
              frontDesc: "Export clean TypeScript, Tailwind CSS, and React source code. Run and deploy anywhere with npm install.",
              backTitle: "100% Code Ownership",
              backDesc: "No subscription required to keep your site online. Deploy freely to Vercel, Netlify, Cloudflare, or AWS.",
              buttonText: "Export Code",
              buttonHref: "#contact",
            },
          ],
        };
        break;
      case "PriceListSection":
      case "PriceList":
        extraProps = {
          badge: "✦ CURATED RATE CARD",
          title: "Professional Services & Transparent Pricing",
          subtitle: "High-velocity development, custom enterprise design systems, and dedicated full-stack architecture.",
          items: [
            {
              title: "Custom Visual Design System Architecture",
              price: "$2,400",
              description: "Tailored component tokens, typography scales, dark mode variables, and reusable Figma UI libraries.",
              tag: "Popular",
            },
            {
              title: "1-Click Full Multi-Page Website Migration",
              price: "$1,800",
              description: "Full AST compilation of your legacy site into modern Next.js 15 App Router code with zero lock-in.",
              tag: "Fast Track",
            },
            {
              title: "Headless CMS API & Webhook Integration",
              price: "$1,200",
              description: "Automated webhook handlers, lead pipelines, CRM synchronization, and automated email dispatches.",
            },
            {
              title: "Edge Performance & Lighthouse Optimization",
              price: "$950",
              description: "Comprehensive Core Web Vitals audit, sub-10ms edge caching rules, and asset compression pipeline.",
            },
          ],
        };
        break;
      case "TableOfContentsSection":
      case "TableOfContents":
        extraProps = {
          badge: "✦ PAGE DIRECTORY",
          title: "Table of Contents",
          subtitle: "Quickly navigate through all architecture sections and modules on this page.",
          items: [
            { label: "Executive Overview & Hero", href: "#hero" },
            { label: "Bento High-Density Architecture", href: "#bento" },
            { label: "Core Velocity Features", href: "#features" },
            { label: "Flexible Pricing & Billing", href: "#pricing" },
            { label: "Client Testimonials & Reviews", href: "#testimonials" },
            { label: "Knowledge Base & FAQ", href: "#faq" },
            { label: "Inquiries & Contact Form", href: "#contact" },
          ],
        };
        break;
      case "AlertBoxSection":
      case "AlertBox":
        extraProps = {
          variant: "info",
          title: "Nexoraft 2.0 Engine Update Live",
          description: "Enjoy 2x faster visual compilation, instant live item repeaters, and zero-runtime Next.js 15 App Router code export.",
          buttonText: "Explore Release Notes",
          href: "#features",
        };
        break;
      case "ShareButtonsSection":
      case "ShareButtons":
        extraProps = {
          title: "Share this Website with Your Network",
          subtitle: "Help founders, creators, and engineering teams discover portable visual web building.",
          shareUrl: "https://nexoraft.com",
          shareText: "Check out Nexoraft - The visual builder with zero platform lock-in!",
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
    setFocusedElement(newId);
    setSelectedElement(newId);
    setShowInspector(true);
  }, [activePageConfig, elements, focusedElement, dispatch, setFocusedElement, setSelectedElement, websiteName]);

  useEffect(() => {
    const handleCustomInsert = (e: Event) => {
      const customEvent = e as CustomEvent<{ type: string; label: string }>;
      if (customEvent.detail?.type) {
        handleInsertElement(
          customEvent.detail.type,
          customEvent.detail.label || customEvent.detail.type
        );
      }
    };
    window.addEventListener("nexoraft-insert-element", handleCustomInsert);
    return () => {
      window.removeEventListener("nexoraft-insert-element", handleCustomInsert);
    };
  }, [handleInsertElement]);

  const handleDuplicate = () => {
    if (!elementConfig) return;
    const newId = generateElementId("elem");
    const cloned = JSON.parse(JSON.stringify(elementConfig));
    cloned.id = newId;
    cloned.label = `${elementConfig.label || "Element"} (Copy)`;
    const parentId = activePageConfig?.rootElementId || "root";
    dispatch(addElement(parentId, cloned));
    setFocusedElement(newId);
    setSelectedElement(newId);
  };

  const handleDelete = () => {
    if (!elementConfig || isRootElement) return;
    dispatch(removeElement({ id: elementConfig.id }));
  };

  const handlePropertyChange = (key: string, value: unknown) => {
    if (!elementConfig) return;
    dispatch(updateElement(elementConfig.id, { [key]: value }));
  };

  const handleUpdateItem = (itemIndex: number, field: string, value: unknown) => {
    if (!elementConfig || !Array.isArray(elementConfig.items)) return;
    const nextItems = elementConfig.items.map((item, idx) => {
      if (idx !== itemIndex) return item;
      return { ...item, [field]: value };
    });
    dispatch(updateElement(elementConfig.id, { items: nextItems }));
  };

  const handleAddItem = () => {
    if (!elementConfig) return;
    const currentItems = Array.isArray(elementConfig.items) ? elementConfig.items : [];
    let defaultItem: Record<string, unknown> = {
      title: "New Item",
      description: "Description of the new item.",
    };
    if (elementConfig.elementType === "PricingSection") {
      defaultItem = {
        title: "Enterprise Plus",
        price: "$149",
        period: "/month",
        description: "Custom capabilities for high-velocity teams.",
        features: ["All Pro Features", "Dedicated Engineering Support", "Custom AST Compilers", "99.99% SLA"],
        buttonText: "Contact Us",
      };
    } else if (elementConfig.elementType === "FAQSection") {
      defaultItem = {
        question: "Can I customize the items dynamically?",
        answer: "Yes, you can edit questions, answers, and add as many items as needed in the Element Inspector.",
      };
    } else if (elementConfig.elementType === "TestimonialsSection") {
      defaultItem = {
        name: "Jordan Lee",
        role: "Chief Technology Officer",
        company: "Veloce Systems",
        quote: "The visual repeater controls and 1-click Next.js export saved us dozens of development hours.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      };
    } else if (elementConfig.elementType === "StatsSection" || elementConfig.elementType === "StatsCounterSection") {
      defaultItem = {
        value: "99.99%",
        label: "Performance Benchmark",
        change: "+25% MoM",
      };
    } else if (elementConfig.elementType === "TimelineSection" || elementConfig.elementType === "ProcessSection") {
      defaultItem = {
        step: `0${currentItems.length + 1}`,
        title: "Scale & Deploy",
        description: "Continuous integration pipeline and instant edge distribution.",
        tag: "DevOps",
      };
    } else if (elementConfig.elementType === "TeamSection") {
      defaultItem = {
        name: "Alex Rivera",
        role: "Lead Interface Designer",
        bio: "Specializing in micro-animations, accessible color tokens, and responsive canvas design.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      };
    } else if (elementConfig.elementType === "FlipBoxSection" || elementConfig.elementType === "FlipBox") {
      defaultItem = {
        frontBadge: "INNOVATION",
        frontTitle: "3D Dynamic Card",
        frontDesc: "Interactive card front with hover micro-animation.",
        backTitle: "Take Immediate Action",
        backDesc: "Expanded content and direct call-to-action link.",
        buttonText: "Explore More",
        buttonHref: "#contact",
      };
    } else if (elementConfig.elementType === "PriceListSection" || elementConfig.elementType === "PriceList") {
      defaultItem = {
        title: "Enterprise Custom Architecture",
        price: "$3,200",
        description: "Full end-to-end design, database schema, and automated cloud infrastructure.",
        tag: "Enterprise",
      };
    } else if (elementConfig.elementType === "TableOfContentsSection" || elementConfig.elementType === "TableOfContents") {
      defaultItem = {
        label: "Additional Section",
        href: "#section",
      };
    } else if (elementConfig.elementType === "LogoStripSection") {
      defaultItem = {
        name: "NextGen Brand",
      };
    } else if (elementConfig.elementType === "NavbarSection") {
      defaultItem = {
        label: "Resources",
        href: "/resources",
      };
    }

    const nextItems = [...currentItems, defaultItem];
    dispatch(updateElement(elementConfig.id, { items: nextItems }));
    setExpandedItemIndex(nextItems.length - 1);
  };

  const handleRemoveItem = (itemIndex: number) => {
    if (!elementConfig || !Array.isArray(elementConfig.items)) return;
    if (elementConfig.items.length <= 1) return;
    const nextItems = elementConfig.items.filter((_, idx) => idx !== itemIndex);
    dispatch(updateElement(elementConfig.id, { items: nextItems }));
    if (expandedItemIndex === itemIndex) {
      setExpandedItemIndex(Math.max(0, itemIndex - 1));
    }
  };

  const handleUpdateItemFeature = (itemIndex: number, featureIndex: number, value: string) => {
    if (!elementConfig || !Array.isArray(elementConfig.items)) return;
    const item = elementConfig.items[itemIndex] as Record<string, unknown>;
    if (!item || !Array.isArray(item.features)) return;
    const nextFeatures = [...item.features];
    nextFeatures[featureIndex] = value;
    handleUpdateItem(itemIndex, "features", nextFeatures);
  };

  const handleAddItemFeature = (itemIndex: number) => {
    if (!elementConfig || !Array.isArray(elementConfig.items)) return;
    const item = elementConfig.items[itemIndex] as Record<string, unknown>;
    const currentFeatures = Array.isArray(item?.features) ? item.features : [];
    handleUpdateItem(itemIndex, "features", [...currentFeatures, "New Feature Capability"]);
  };

  const handleRemoveItemFeature = (itemIndex: number, featureIndex: number) => {
    if (!elementConfig || !Array.isArray(elementConfig.items)) return;
    const item = elementConfig.items[itemIndex] as Record<string, unknown>;
    if (!item || !Array.isArray(item.features)) return;
    const nextFeatures = item.features.filter((_, fIdx) => fIdx !== featureIndex);
    handleUpdateItem(itemIndex, "features", nextFeatures);
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

  const deviceContainerConfig = useMemo<{
    className: string;
    style: React.CSSProperties;
  }>(() => {
    if (deviceType === "mobile") {
      const w = breakpoints?.mobile || 390;
      return {
        className:
          "mx-auto shadow-2xl rounded-3xl border-8 border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300",
        style: { width: "100%", maxWidth: `${w}px` },
      };
    } else if (deviceType === "tablet") {
      const w = breakpoints?.tablet || 768;
      return {
        className:
          "mx-auto shadow-2xl rounded-2xl border-4 border-slate-700 bg-white dark:bg-slate-900 transition-all duration-300",
        style: { width: "100%", maxWidth: `${w}px` },
      };
    } else if (deviceType === "laptop") {
      const w = breakpoints?.laptop || 1024;
      return {
        className:
          "mx-auto shadow-xl rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 transition-all duration-300",
        style: { width: "100%", maxWidth: `${w}px` },
      };
    } else if (deviceType === "custom") {
      const w = breakpoints?.custom || 640;
      return {
        className:
          "mx-auto shadow-xl rounded-xl border border-dashed border-blue-500/50 bg-white dark:bg-slate-900 transition-all duration-300",
        style: { width: "100%", maxWidth: `${w}px` },
      };
    }
    const w = breakpoints?.desktop || 1280;
    return {
      className: "w-full mx-auto rounded-xl shadow-xs transition-all duration-300",
      style: { width: "100%", maxWidth: `${w}px` },
    };
  }, [deviceType, breakpoints]);

  const canvasCustomStyles = useMemo<React.CSSProperties>(() => {
    const cssVars: Record<string, string> = {
      "--color-primary": themeCode || "#3b82f6",
      "--color-secondary": secondaryColor || "#6366f1",
      "--color-accent": accentColor || "#ec4899",
      "--color-bg": backgroundColor || "#ffffff",
      "--color-surface": surfaceColor || "#ffffff",
      "--color-text": textColor || "#0f172a",
      "--font-family": fontFamily || "Inter, sans-serif",
      "--font-heading": headingFont || fontFamily || "Outfit, sans-serif",
      ...(customVariables || {}),
    };
    return cssVars as unknown as React.CSSProperties;
  }, [
    themeCode,
    secondaryColor,
    accentColor,
    backgroundColor,
    surfaceColor,
    textColor,
    fontFamily,
    headingFont,
    customVariables,
  ]);

  return (
    <div className={`react-form-builder flex flex-col h-full max-h-full overflow-hidden w-full gap-2.5 ${props.className || ""}`}>
      {/* Top Navbar Component */}
      <div className="shrink-0">
        <NavbarComponentWrapper
          pageConfig={activePageConfig}
          deviceType={deviceType}
          onDeviceChange={setDeviceType}
          isPreview={isPreview}
          onTogglePreview={() => setIsPreview(!isPreview)}
          calledFrom="builder"
        />
      </div>

      {/* Main Studio Area */}
      <div className="flex-1 min-h-0 flex gap-2.5 items-stretch w-full overflow-hidden relative">
        {/* Left Drawer / Dock (Nexoraft Pro Suite) */}
        {!isPreview && (
          <aside className="w-80 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-slate-800 dark:text-slate-100 flex flex-col h-full max-h-full overflow-hidden">
            {/* Tab Switcher Icons */}
            <div className="shrink-0 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-2 py-1.5 bg-slate-50/60 dark:bg-slate-800/40">
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
                title="Media Asset Manager"
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
            <div className="p-3.5 overflow-y-auto flex-1 min-h-0">
              {/* 1. Blocks Tab */}
              {activeSidebarTab === "blocks" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Nexoraft Pro Widgets</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { type: "FlipBoxSection", label: "3D Flip Box", icon: RefreshCw },
                        { type: "PriceListSection", label: "Rate Card Menu", icon: BarChart3 },
                        { type: "TableOfContentsSection", label: "Page Directory", icon: ListCollapse },
                        { type: "AlertBoxSection", label: "Alert Notification", icon: AlertCircle },
                        { type: "ShareButtonsSection", label: "Social Share", icon: Share2 },
                        { type: "BentoGridSection", label: "Bento Grid", icon: LayoutGrid },
                        { type: "TimelineSection", label: "Process Flow", icon: Milestone },
                        { type: "CountdownSection", label: "Countdown Timer", icon: Clock },
                        { type: "VideoSection", label: "Video Showcase", icon: Play },
                        { type: "NewsletterSection", label: "Newsletter VIP", icon: Mail },
                      ].map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => handleInsertElement(item.type, item.label)}
                          className="p-2.5 rounded-xl border border-blue-200/60 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/30 hover:bg-blue-100/60 dark:hover:bg-blue-900/50 hover:border-blue-400 dark:hover:border-blue-600 flex flex-col items-center gap-1.5 transition-all text-slate-800 dark:text-slate-200 cursor-pointer text-center"
                        >
                          <item.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="font-semibold text-[11px]">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Database Collections */}
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2.5 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5" />
                      <span>Database Collections</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        {
                          type: "DynamicCardsGridSection",
                          label: "CMS Cards Grid",
                          icon: Database,
                          desc: "Live DB Cards",
                        },
                        {
                          type: "PostsGridSection",
                          label: "Live Posts Loop",
                          icon: BookOpen,
                          desc: "Live Articles",
                        },
                        {
                          type: "TeamSection",
                          label: "Live Team Grid",
                          icon: Users,
                          desc: "Staff Directory",
                        },
                      ].map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => handleInsertElement(item.type, item.label)}
                          className="p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/30 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/50 hover:border-emerald-400 dark:hover:border-emerald-600 flex flex-col items-center gap-1.5 transition-all text-slate-800 dark:text-slate-200 cursor-pointer text-center"
                        >
                          <item.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="font-semibold text-[11px]">{item.label}</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-full font-bold">
                            {item.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
                      Marketing Sections
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { type: "HeroSection", label: "Hero (Centered)", icon: Sparkles },
                        { type: "SaaSSplitHero", label: "Hero (SaaS Split)", icon: Layout },
                        { type: "FeatureGridSection", label: "Feature Grid", icon: Layout },
                        { type: "StatsSection", label: "Stats Counter", icon: BarChart3 },
                        { type: "TestimonialsSection", label: "Testimonials", icon: Star },
                        { type: "PricingSection", label: "Pricing Table", icon: Layout },
                        { type: "FAQSection", label: "FAQ Accordion", icon: HelpCircle },
                        { type: "LogoStripSection", label: "Logo Strip", icon: Building },
                        { type: "CallToActionSection", label: "Call to Action", icon: MousePointer },
                        { type: "ContactSection", label: "Contact Form", icon: Mail },
                        { type: "NavbarSection", label: "Navbar Header", icon: PanelBottom },
                        { type: "FloatingPillNavbar", label: "Floating Navbar", icon: PanelBottom },
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
                  {/* Curated Theme Presets */}
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                      <span>Curated Presets</span>
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    </h3>
                    <div className="grid grid-cols-1 gap-1.5">
                      {[
                        {
                          name: "Midnight SaaS",
                          primary: "#3b82f6",
                          secondary: "#6366f1",
                          accent: "#ec4899",
                          bg: "#0b0f19",
                          surface: "#111827",
                          text: "#f8fafc",
                          font: "Inter, sans-serif",
                          heading: "Outfit, sans-serif",
                          radius: "lg" as const,
                          desc: "Deep navy glassmorphism for enterprise SaaS",
                        },
                        {
                          name: "Cyber Emerald",
                          primary: "#10b981",
                          secondary: "#06b6d4",
                          accent: "#f59e0b",
                          bg: "#022c22",
                          surface: "#064e3b",
                          text: "#ecfdf5",
                          font: "Plus Jakarta Sans, sans-serif",
                          heading: "Space Grotesk, sans-serif",
                          radius: "md" as const,
                          desc: "High-contrast cyber tech and fintech palette",
                        },
                        {
                          name: "Obsidian Gold",
                          primary: "#f59e0b",
                          secondary: "#d97706",
                          accent: "#fbbf24",
                          bg: "#18181b",
                          surface: "#27272a",
                          text: "#fffbeb",
                          font: "Inter, sans-serif",
                          heading: "Playfair Display, serif",
                          radius: "sm" as const,
                          desc: "Luxury editorial styling for high-ticket brands",
                        },
                        {
                          name: "Sunset Velvet",
                          primary: "#8b5cf6",
                          secondary: "#ec4899",
                          accent: "#f43f5e",
                          bg: "#0f172a",
                          surface: "#1e293b",
                          text: "#f1f5f9",
                          font: "Outfit, sans-serif",
                          heading: "Outfit, sans-serif",
                          radius: "full" as const,
                          desc: "Vibrant neon gradients for creators & AI apps",
                        },
                        {
                          name: "Clean Minimalist",
                          primary: "#2563eb",
                          secondary: "#4f46e5",
                          accent: "#0ea5e9",
                          bg: "#f8fafc",
                          surface: "#ffffff",
                          text: "#0f172a",
                          font: "Inter, sans-serif",
                          heading: "Inter, sans-serif",
                          radius: "md" as const,
                          desc: "Crisp white studio layout with clean contrast",
                        },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            updateTheme({
                              primaryColor: preset.primary,
                              secondaryColor: preset.secondary,
                              accentColor: preset.accent,
                              backgroundColor: preset.bg,
                              surfaceColor: preset.surface,
                              textColor: preset.text,
                              fontFamily: preset.font,
                              headingFont: preset.heading,
                              borderRadius: preset.radius,
                            });
                          }}
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-700 flex items-center justify-between text-left transition-all cursor-pointer group"
                        >
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block group-hover:text-blue-600">
                              {preset.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {preset.desc}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <div
                              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                              style={{ backgroundColor: preset.primary }}
                            />
                            <div
                              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                              style={{ backgroundColor: preset.secondary }}
                            />
                            <div
                              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                              style={{ backgroundColor: preset.surface }}
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Brand & Canvas Colors */}
                  <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Color Palette Tokens
                    </h3>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Primary Brand Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={themeCode || "#3b82f6"}
                          onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                          className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300"
                        />
                        <input
                          type="text"
                          value={themeCode || "#3b82f6"}
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
                          value={secondaryColor || "#6366f1"}
                          onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                          className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300"
                        />
                        <input
                          type="text"
                          value={secondaryColor || "#6366f1"}
                          onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Accent Highlight Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={accentColor || "#ec4899"}
                          onChange={(e) => updateTheme({ accentColor: e.target.value })}
                          className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300"
                        />
                        <input
                          type="text"
                          value={accentColor || "#ec4899"}
                          onChange={(e) => updateTheme({ accentColor: e.target.value })}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs uppercase"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Canvas Background
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={backgroundColor || "#ffffff"}
                            onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                            className="w-6 h-6 rounded cursor-pointer border border-slate-300"
                          />
                          <input
                            type="text"
                            value={backgroundColor || "#ffffff"}
                            onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                            className="w-full px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-[11px]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Card Surface
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={surfaceColor || "#ffffff"}
                            onChange={(e) => updateTheme({ surfaceColor: e.target.value })}
                            className="w-6 h-6 rounded cursor-pointer border border-slate-300"
                          />
                          <input
                            type="text"
                            value={surfaceColor || "#ffffff"}
                            onChange={(e) => updateTheme({ surfaceColor: e.target.value })}
                            className="w-full px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Text &amp; Headline Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={textColor || "#0f172a"}
                          onChange={(e) => updateTheme({ textColor: e.target.value })}
                          className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300"
                        />
                        <input
                          type="text"
                          value={textColor || "#0f172a"}
                          onChange={(e) => updateTheme({ textColor: e.target.value })}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Typography Tokens */}
                  <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Typography Scale
                    </h3>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Heading Font
                      </label>
                      <select
                        value={headingFont || fontFamily}
                        onChange={(e) => updateTheme({ headingFont: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      >
                        <option value="Outfit, sans-serif">Outfit (Geometric Tech)</option>
                        <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans</option>
                        <option value="Space Grotesk, sans-serif">Space Grotesk (Neo-Brutalist)</option>
                        <option value="Playfair Display, serif">Playfair Display (Editorial Serif)</option>
                        <option value="Inter, sans-serif">Inter (Clean Modern Sans)</option>
                        <option value="Roboto, sans-serif">Roboto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Body Font
                      </label>
                      <select
                        value={fontFamily}
                        onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      >
                        <option value="Inter, sans-serif">Inter (Clean Modern Sans)</option>
                        <option value="Roboto, sans-serif">Roboto</option>
                        <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans</option>
                        <option value="Outfit, sans-serif">Outfit (Geometric Tech)</option>
                      </select>
                    </div>
                  </div>

                  {/* Border Radius Tokens */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                      Border Radius Scale
                    </label>
                    <div className="grid grid-cols-5 gap-1 text-center">
                      {(["none", "sm", "md", "lg", "full"] as const).map((rad) => (
                        <button
                          key={rad}
                          type="button"
                          onClick={() => updateTheme({ borderRadius: rad })}
                          className={`py-1 rounded-lg border text-[11px] font-semibold capitalize ${
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

                  {/* Custom CSS Variables & Design Tokens Manager */}
                  <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-blue-600" />
                        <span>Custom CSS Variables</span>
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {Object.keys(customVariables || {}).length} variables
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Define custom CSS tokens (e.g. <code className="font-mono text-blue-600">--brand-glow</code>) injected live across the canvas.
                    </p>

                    {/* Add New Variable Form */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="font-bold text-[10px] text-slate-600 dark:text-slate-300 uppercase block">
                        + Add Custom Variable
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={newVarKey}
                          onChange={(e) => setNewVarKey(e.target.value)}
                          placeholder="--hero-glow"
                          className="px-2 py-1 text-xs rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
                        />
                        <input
                          type="text"
                          value={newVarVal}
                          onChange={(e) => setNewVarVal(e.target.value)}
                          placeholder="#3b82f640 or 20px"
                          className="px-2 py-1 text-xs rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (newVarKey.trim() && newVarVal.trim()) {
                            let key = newVarKey.trim();
                            if (!key.startsWith("--")) key = `--${key}`;
                            addCustomVariable(key, newVarVal.trim());
                            setNewVarKey("");
                            setNewVarVal("");
                          }
                        }}
                        disabled={!newVarKey.trim() || !newVarVal.trim()}
                        className="w-full py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Token</span>
                      </button>
                    </div>

                    {/* Existing Variables List */}
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {Object.entries(customVariables || {}).map(([key, val]) => (
                        <div
                          key={key}
                          className="p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <span className="font-mono font-bold text-[11px] text-blue-600 dark:text-blue-400 block truncate">
                              {key}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500 truncate block">
                              {val}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCustomVariable(key)}
                            title="Remove variable"
                            className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
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
        <div className="flex-1 min-h-0 h-full bg-slate-100/70 dark:bg-slate-950 p-2 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-center overflow-y-auto overflow-x-hidden transition-all">
          <div
            className={deviceContainerConfig.className}
            style={{ ...deviceContainerConfig.style, ...canvasCustomStyles }}
          >
            <Preview rootId={activePageConfig?.rootElementId} isPreview={isPreview} />
          </div>
        </div>

        {/* Right Element Inspector Panel (Nexoraft Pro Suite) */}
        {!isPreview && showInspector && elementConfig && (
          <aside className="w-84 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-slate-800 dark:text-slate-100 flex flex-col h-full max-h-full overflow-hidden">
            {/* Inspector Header */}
            <div className="shrink-0 p-3.5 pb-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
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
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {!isRootElement && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    title="Delete element"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowInspector(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Element Identity Badge & Tab Selector */}
            <div className="shrink-0 px-3.5 pt-2.5 pb-2 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {elementConfig.elementType || "Element"}
                </span>
                <code className="text-[10px] font-mono text-blue-500">
                  #{elementConfig.id.slice(-6)}
                </code>
              </div>

              {/* Inspector Tabs: Content | Style | Advanced */}
              <div className="flex items-center text-xs">
                {(["content", "style", "advanced"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setInspectorTab(tab)}
                    className={`flex-1 py-1.5 font-bold uppercase tracking-wider border-b-2 capitalize transition-colors cursor-pointer ${
                      inspectorTab === tab
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Inspector Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-4">
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
                      Primary Button Text
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
                      Secondary Button Text
                    </label>
                    <input
                      type="text"
                      value={elementConfig.buttonSecondaryText || ""}
                      onChange={(e) => handlePropertyChange("buttonSecondaryText", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {elementConfig.variant !== undefined && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Button Style Variant
                    </label>
                    <select
                      value={String(elementConfig.variant || "primary")}
                      onChange={(e) => handlePropertyChange("variant", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="primary">Primary (Blue Gradient)</option>
                      <option value="secondary">Secondary (Slate Neutral)</option>
                      <option value="outline">Outline Border</option>
                      <option value="danger">Danger Accent</option>
                    </select>
                  </div>
                )}

                {elementConfig.href !== undefined && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Action Link URL (href)
                    </label>
                    <input
                      type="text"
                      value={String(elementConfig.href || "")}
                      onChange={(e) => handlePropertyChange("href", e.target.value)}
                      placeholder="e.g. /pricing, #contact, https://..."
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {elementConfig.annualDiscount !== undefined && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Annual Discount Badge
                    </label>
                    <input
                      type="text"
                      value={String(elementConfig.annualDiscount || "")}
                      onChange={(e) => handlePropertyChange("annualDiscount", e.target.value)}
                      placeholder="e.g. Save 20%"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {elementConfig.urgencyText !== undefined && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Countdown Urgency Text
                    </label>
                    <input
                      type="text"
                      value={String(elementConfig.urgencyText || "")}
                      onChange={(e) => handlePropertyChange("urgencyText", e.target.value)}
                      placeholder="⚡ SPECIAL EARLY BIRD ACCESS ENDS IN:"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {elementConfig.searchPlaceholder !== undefined && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      FAQ Search Placeholder
                    </label>
                    <input
                      type="text"
                      value={String(elementConfig.searchPlaceholder || "")}
                      onChange={(e) => handlePropertyChange("searchPlaceholder", e.target.value)}
                      placeholder="Search questions or keywords..."
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Bento Grid Special Properties */}
                {elementConfig.card1Title !== undefined && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Bento Card 1 (Edge Computing)
                    </span>
                    <input
                      type="text"
                      value={String(elementConfig.card1Title || "")}
                      onChange={(e) => handlePropertyChange("card1Title", e.target.value)}
                      placeholder="Card 1 Title"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                    />
                  </div>
                )}

                {elementConfig.card2Score !== undefined && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Bento Card 2 (Performance Score)
                    </span>
                    <input
                      type="text"
                      value={String(elementConfig.card2Score || "")}
                      onChange={(e) => handlePropertyChange("card2Score", e.target.value)}
                      placeholder="e.g. 100/100"
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
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

                {/* Pro Component specific fields: AlertBox variant */}
                {(elementConfig.elementType === "AlertBoxSection" || elementConfig.elementType === "AlertBox") && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Alert Notification Style
                    </label>
                    <select
                      value={String(elementConfig.variant || "info")}
                      onChange={(e) => handlePropertyChange("variant", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="info">Information (Blue)</option>
                      <option value="success">Success (Emerald)</option>
                      <option value="warning">Warning Notice (Amber)</option>
                      <option value="danger">Urgent / Danger (Red)</option>
                    </select>
                  </div>
                )}

                {/* Video Thumbnail */}
                {elementConfig.thumbnail !== undefined && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Video Cover Thumbnail URL
                    </label>
                    <input
                      type="text"
                      value={String(elementConfig.thumbnail || "")}
                      onChange={(e) => handlePropertyChange("thumbnail", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Social Share Buttons */}
                {elementConfig.shareUrl !== undefined && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        URL to Share
                      </label>
                      <input
                        type="text"
                        value={String(elementConfig.shareUrl || "")}
                        onChange={(e) => handlePropertyChange("shareUrl", e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                      />
                    </div>
                    {elementConfig.shareText !== undefined && (
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Share Message Preset
                        </label>
                        <input
                          type="text"
                          value={String(elementConfig.shareText || "")}
                          onChange={(e) => handlePropertyChange("shareText", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* HeroSection Pro Design Controls */}
                {elementConfig.elementType === "HeroSection" && (
                  <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Hero Layout &amp; Atmosphere</span>
                    </h4>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Hero Layout Variant
                      </label>
                      <select
                        value={String(elementConfig.layoutVariant || "centered")}
                        onChange={(e) => handlePropertyChange("layoutVariant", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="centered">Centered Display (High-Impact Lead)</option>
                        <option value="split-image-right">Split Right (Showcase Image on Right)</option>
                        <option value="split-image-left">Split Left (Showcase Image on Left)</option>
                        <option value="minimal-lead">Minimalist Lead (Clean Typographic)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Atmospheric Background
                      </label>
                      <select
                        value={String(elementConfig.bgVariant || "radial-glow")}
                        onChange={(e) => handlePropertyChange("bgVariant", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="radial-glow">Radial Blue Glow Effect</option>
                        <option value="mesh-gradient">Vibrant Mesh Gradient</option>
                        <option value="dark-glass">Dark Glassmorphism Backdrop</option>
                        <option value="pattern-grid">Engineering Tech Grid</option>
                        <option value="solid">Clean Solid Background</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Hero Height Mode
                      </label>
                      <select
                        value={String(elementConfig.heroHeight || "large")}
                        onChange={(e) => handlePropertyChange("heroHeight", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="screen">Full Screen Viewport (100vh)</option>
                        <option value="large">Spacious (Min 80vh)</option>
                        <option value="medium">Balanced (Min 65vh)</option>
                        <option value="compact">Compact Banner (Min 45vh)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Showcase Media Image URL
                      </label>
                      <input
                        type="text"
                        value={String(elementConfig.heroImage || "")}
                        onChange={(e) => handlePropertyChange("heroImage", e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                        Social Proof Avatar Cluster
                      </span>
                      <input
                        type="checkbox"
                        checked={Boolean(elementConfig.showSocialProof ?? true)}
                        onChange={(e) => handlePropertyChange("showSocialProof", e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    {Boolean(elementConfig.showSocialProof ?? true) && (
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Social Proof Label
                        </label>
                        <input
                          type="text"
                          value={String(elementConfig.socialProofCount || "4,200+ founders")}
                          onChange={(e) => handlePropertyChange("socialProofCount", e.target.value)}
                          placeholder="e.g. 4,200+ founders"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* NavbarSection Pro Controls */}
                {elementConfig.elementType === "NavbarSection" && (
                  <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <PanelBottom className="w-3.5 h-3.5" />
                      <span>Navbar Design &amp; Behavior</span>
                    </h4>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Navbar Style Layout
                      </label>
                      <select
                        value={String(elementConfig.layoutVariant || "standard")}
                        onChange={(e) => handlePropertyChange("layoutVariant", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="standard">Standard Full-Width Header</option>
                        <option value="floating-pill">Modern Floating Glass Pill</option>
                        <option value="split-minimal">Split Minimalist Header</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Brand Logo Image URL (Optional)
                      </label>
                      <input
                        type="text"
                        value={String(elementConfig.logoUrl || "")}
                        onChange={(e) => handlePropertyChange("logoUrl", e.target.value)}
                        placeholder="https://... logo.png (Leave blank for text logo)"
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Sticky</span>
                        <input
                          type="checkbox"
                          checked={Boolean(elementConfig.isSticky ?? true)}
                          onChange={(e) => handlePropertyChange("isSticky", e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Glass Blur</span>
                        <input
                          type="checkbox"
                          checked={Boolean(elementConfig.transparent ?? true)}
                          onChange={(e) => handlePropertyChange("transparent", e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* DynamicCardsGridSection Controls */}
                {(elementConfig.elementType === "DynamicCardsGridSection" ||
                  elementConfig.elementType === "DynamicCardsGrid" ||
                  elementConfig.elementType === "DynamicCollectionGrid") && (
                  <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Connected directly to live database records with zero static hardcoding.</span>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Database Data Source
                      </label>
                      <select
                        value={String(elementConfig.dataSource || "posts")}
                        onChange={(e) => handlePropertyChange("dataSource", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="posts">Live Nexoraft Blog Posts ({posts.length} records)</option>
                        <option value="team">Live Nexoraft Team Members</option>
                        <option value="leads">Live Captured Inquiries ({submissions.length} records)</option>
                        <option value="api">External REST API Endpoint (Custom JSON)</option>
                      </select>
                    </div>

                    {elementConfig.dataSource === "api" && (
                      <div className="space-y-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            API Endpoint URL
                          </label>
                          <input
                            type="text"
                            value={String(elementConfig.apiUrl || "")}
                            onChange={(e) => handlePropertyChange("apiUrl", e.target.value)}
                            placeholder="https://api.example.com/v1/items"
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Data Array JSON Key Path
                          </label>
                          <input
                            type="text"
                            value={String(elementConfig.apiDataPath || "")}
                            onChange={(e) => handlePropertyChange("apiDataPath", e.target.value)}
                            placeholder="e.g. data or results (empty for root array)"
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Grid Columns
                        </label>
                        <select
                          value={Number(elementConfig.columns || 3)}
                          onChange={(e) => handlePropertyChange("columns", Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                        >
                          <option value={1}>1 Single Column</option>
                          <option value={2}>2 Columns</option>
                          <option value={3}>3 Columns (Standard)</option>
                          <option value={4}>4 Columns (Dense)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Max Item Limit
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={48}
                          value={Number(elementConfig.count || 6)}
                          onChange={(e) => handlePropertyChange("count", Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Card Presentation Style
                      </label>
                      <select
                        value={String(elementConfig.cardStyle || "modern")}
                        onChange={(e) => handlePropertyChange("cardStyle", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                      >
                        <option value="modern">Modern Glass Card with Subtle Border</option>
                        <option value="minimal">Clean Minimalist Outline</option>
                        <option value="elevated">Elevated Floating Card (Deep Shadow)</option>
                        <option value="compact">Compact Row View</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Filter by Category (Optional)
                      </label>
                      <input
                        type="text"
                        value={String(elementConfig.filterCategory || "")}
                        onChange={(e) => handlePropertyChange("filterCategory", e.target.value)}
                        placeholder="e.g. Design, Engineering, Product..."
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                        Interactive Search Bar
                      </span>
                      <input
                        type="checkbox"
                        checked={Boolean(elementConfig.enableSearch ?? false)}
                        onChange={(e) => handlePropertyChange("enableSearch", e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600"
                      />
                    </div>
                  </div>
                )}

                {/* Universal Dynamic Items Repeater Control */}
                {elementConfig.items && Array.isArray(elementConfig.items) && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-800 dark:text-slate-200 block">
                          Repeater Items ({elementConfig.items.length})
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Live editable collection items
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Item</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {elementConfig.items.map((item, itemIdx) => {
                        const isExpanded = expandedItemIndex === itemIdx;
                        const itemRecord = item as Record<string, unknown>;
                        const itemTitle =
                          itemRecord.title ||
                          itemRecord.name ||
                          itemRecord.frontTitle ||
                          itemRecord.question ||
                          itemRecord.label ||
                          itemRecord.value ||
                          `Item #${itemIdx + 1}`;

                        return (
                          <div
                            key={itemIdx}
                            className={`rounded-xl border transition-all ${
                              isExpanded
                                ? "border-blue-500/50 bg-blue-50/20 dark:bg-blue-950/20 shadow-xs"
                                : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300"
                            }`}
                          >
                            {/* Item Title Bar */}
                            <div className="p-2.5 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedItemIndex(isExpanded ? null : itemIdx)
                                }
                                className="flex items-center gap-2 text-left truncate flex-1 cursor-pointer font-semibold text-xs text-slate-800 dark:text-slate-200"
                              >
                                <div
                                  className={`w-4 h-4 rounded flex items-center justify-center transition-transform ${
                                    isExpanded ? "rotate-90 text-blue-600" : "text-slate-400"
                                  }`}
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </div>
                                <span className="truncate">{String(itemTitle)}</span>
                              </button>

                              <div className="flex items-center gap-1">
                                {elementConfig.items && elementConfig.items.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveItem(itemIdx)}
                                    title="Delete this item"
                                    className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Item Expanded Form */}
                            {isExpanded && (
                              <div className="p-3 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5 mt-1">
                                {/* Title / Name / Question / Label */}
                                {(itemRecord.title !== undefined ||
                                  itemRecord.name !== undefined ||
                                  itemRecord.frontTitle !== undefined ||
                                  itemRecord.question !== undefined ||
                                  itemRecord.label !== undefined) && (
                                  <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                                      {itemRecord.question !== undefined
                                        ? "Question Title"
                                        : itemRecord.name !== undefined
                                        ? "Person / Brand Name"
                                        : itemRecord.frontTitle !== undefined
                                        ? "Front Title"
                                        : "Item Title"}
                                    </label>
                                    <input
                                      type="text"
                                      value={String(
                                        itemRecord.title ??
                                          itemRecord.name ??
                                          itemRecord.frontTitle ??
                                          itemRecord.question ??
                                          itemRecord.label ??
                                          ""
                                      )}
                                      onChange={(e) => {
                                        const key =
                                          itemRecord.question !== undefined
                                            ? "question"
                                            : itemRecord.name !== undefined
                                            ? "name"
                                            : itemRecord.frontTitle !== undefined
                                            ? "frontTitle"
                                            : itemRecord.label !== undefined
                                            ? "label"
                                            : "title";
                                        handleUpdateItem(itemIdx, key, e.target.value);
                                      }}
                                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-1 focus:ring-blue-500"
                                    />
                                  </div>
                                )}

                                {/* Price & Period */}
                                {itemRecord.price !== undefined && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                                        Price
                                      </label>
                                      <input
                                        type="text"
                                        value={String(itemRecord.price || "")}
                                        onChange={(e) =>
                                          handleUpdateItem(itemIdx, "price", e.target.value)
                                        }
                                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold"
                                      />
                                    </div>
                                    {itemRecord.period !== undefined && (
                                      <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                                          Period
                                        </label>
                                        <input
                                          type="text"
                                          value={String(itemRecord.period || "")}
                                          onChange={(e) =>
                                            handleUpdateItem(itemIdx, "period", e.target.value)
                                          }
                                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Description / Answer / Bio / Quote / Excerpt */}
                                {(itemRecord.description !== undefined ||
                                  itemRecord.answer !== undefined ||
                                  itemRecord.bio !== undefined ||
                                  itemRecord.quote !== undefined ||
                                  itemRecord.excerpt !== undefined ||
                                  itemRecord.frontDesc !== undefined) && (
                                  <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                                      {itemRecord.answer !== undefined
                                        ? "Answer Text"
                                        : itemRecord.quote !== undefined
                                        ? "Testimonial Quote"
                                        : itemRecord.bio !== undefined
                                        ? "Bio Description"
                                        : itemRecord.frontDesc !== undefined
                                        ? "Front Description"
                                        : "Description"}
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={String(
                                        itemRecord.description ??
                                          itemRecord.answer ??
                                          itemRecord.quote ??
                                          itemRecord.bio ??
                                          itemRecord.excerpt ??
                                          itemRecord.frontDesc ??
                                          ""
                                      )}
                                      onChange={(e) => {
                                        const key =
                                          itemRecord.answer !== undefined
                                            ? "answer"
                                            : itemRecord.quote !== undefined
                                            ? "quote"
                                            : itemRecord.bio !== undefined
                                            ? "bio"
                                            : itemRecord.excerpt !== undefined
                                            ? "excerpt"
                                            : itemRecord.frontDesc !== undefined
                                            ? "frontDesc"
                                            : "description";
                                        handleUpdateItem(itemIdx, key, e.target.value);
                                      }}
                                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                                    />
                                  </div>
                                )}

                                {/* FlipBox Back Title & Description */}
                                {itemRecord.backTitle !== undefined && (
                                  <div className="p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2">
                                    <span className="font-bold text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                                      Flip Card Back Side
                                    </span>
                                    <div>
                                      <label className="block text-[10px] text-slate-500 mb-0.5">
                                        Back Title
                                      </label>
                                      <input
                                        type="text"
                                        value={String(itemRecord.backTitle || "")}
                                        onChange={(e) =>
                                          handleUpdateItem(itemIdx, "backTitle", e.target.value)
                                        }
                                        className="w-full px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                                      />
                                    </div>
                                    {itemRecord.backDesc !== undefined && (
                                      <div>
                                        <label className="block text-[10px] text-slate-500 mb-0.5">
                                          Back Description
                                        </label>
                                        <textarea
                                          rows={2}
                                          value={String(itemRecord.backDesc || "")}
                                          onChange={(e) =>
                                            handleUpdateItem(itemIdx, "backDesc", e.target.value)
                                          }
                                          className="w-full px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Features List Repeater (for Pricing Cards) */}
                                {Array.isArray(itemRecord.features) && (
                                  <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                        Feature Bullets ({itemRecord.features.length})
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleAddItemFeature(itemIdx)}
                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span>Add Bullet</span>
                                      </button>
                                    </div>

                                    <div className="space-y-1.5">
                                      {itemRecord.features.map((feat, fIdx) => (
                                        <div key={fIdx} className="flex items-center gap-1.5">
                                          <input
                                            type="text"
                                            value={String(feat || "")}
                                            onChange={(e) =>
                                              handleUpdateItemFeature(itemIdx, fIdx, e.target.value)
                                            }
                                            className="flex-1 px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                                          />
                                          {Array.isArray(itemRecord.features) && itemRecord.features.length > 1 && (
                                            <button
                                              type="button"
                                              onClick={() => handleRemoveItemFeature(itemIdx, fIdx)}
                                              className="text-slate-400 hover:text-red-600 p-0.5 cursor-pointer"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Button Text & URL */}
                                {(itemRecord.buttonText !== undefined ||
                                  itemRecord.href !== undefined ||
                                  itemRecord.buttonHref !== undefined) && (
                                  <div className="grid grid-cols-2 gap-2">
                                    {itemRecord.buttonText !== undefined && (
                                      <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                                          Button Text
                                        </label>
                                        <input
                                          type="text"
                                          value={String(itemRecord.buttonText || "")}
                                          onChange={(e) =>
                                            handleUpdateItem(itemIdx, "buttonText", e.target.value)
                                          }
                                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                                        />
                                      </div>
                                    )}
                                    {(itemRecord.href !== undefined ||
                                      itemRecord.buttonHref !== undefined) && (
                                      <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                                          Link Target (href)
                                        </label>
                                        <input
                                          type="text"
                                          value={String(
                                            itemRecord.buttonHref ?? itemRecord.href ?? ""
                                          )}
                                          onChange={(e) => {
                                            const key =
                                              itemRecord.buttonHref !== undefined
                                                ? "buttonHref"
                                                : "href";
                                            handleUpdateItem(itemIdx, key, e.target.value);
                                          }}
                                          placeholder="#contact"
                                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Metric Stats value & label */}
                                {itemRecord.value !== undefined && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                                        Stat Value
                                      </label>
                                      <input
                                        type="text"
                                        value={String(itemRecord.value || "")}
                                        onChange={(e) =>
                                          handleUpdateItem(itemIdx, "value", e.target.value)
                                        }
                                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold font-mono"
                                      />
                                    </div>
                                    {itemRecord.change !== undefined && (
                                      <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                                          Trend Pill
                                        </label>
                                        <input
                                          type="text"
                                          value={String(itemRecord.change || "")}
                                          onChange={(e) =>
                                            handleUpdateItem(itemIdx, "change", e.target.value)
                                          }
                                          placeholder="+140%"
                                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Star Rating & Highlight Toggle */}
                                <div className="flex items-center justify-between pt-1">
                                  {itemRecord.rating !== undefined && (
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                                        Rating:
                                      </span>
                                      <select
                                        value={Number(itemRecord.rating || 5)}
                                        onChange={(e) =>
                                          handleUpdateItem(
                                            itemIdx,
                                            "rating",
                                            parseInt(e.target.value, 10)
                                          )
                                        }
                                        className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                                      >
                                        {[5, 4, 3, 2, 1].map((r) => (
                                          <option key={r} value={r}>
                                            {r} Stars
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  )}

                                  {(itemRecord.highlighted !== undefined ||
                                    itemRecord.popular !== undefined) && (
                                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                                      <input
                                        type="checkbox"
                                        checked={Boolean(
                                          itemRecord.highlighted || itemRecord.popular
                                        )}
                                        onChange={(e) => {
                                          const key =
                                            itemRecord.highlighted !== undefined
                                              ? "highlighted"
                                              : "popular";
                                          handleUpdateItem(itemIdx, key, e.target.checked);
                                        }}
                                        className="w-3.5 h-3.5 rounded text-blue-600"
                                      />
                                      <span>Featured Plan</span>
                                    </label>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Inspector Tab 2: Style */}
            {inspectorTab === "style" && (
              <div className="space-y-3.5 text-xs">
                {/* Responsive Container Max-Width */}
                <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                      Container Max-Width (Sizing)
                    </label>
                    <span className="text-[10px] font-mono text-blue-600 font-semibold">
                      {String(elementConfig.containerWidth || "7xl")}
                    </span>
                  </div>
                  <select
                    value={String(elementConfig.containerWidth || "7xl")}
                    onChange={(e) => handlePropertyChange("containerWidth", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                  >
                    <option value="full">Full Bleed (100% Edge-to-Edge)</option>
                    <option value="7xl">Standard Layout (7xl / 80rem / 1280px)</option>
                    <option value="5xl">Medium Content (5xl / 64rem / 1024px)</option>
                    <option value="3xl">Narrow Focus (3xl / 48rem / 768px)</option>
                    <option value="xl">Compact Card Island (xl / 36rem / 576px)</option>
                  </select>
                </div>

                {/* Section Grid Columns */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Grid Columns
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    {[1, 2, 3, 4].map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => handlePropertyChange("columns", col)}
                        className={`py-1.5 rounded-lg border text-xs font-semibold ${
                          Number(elementConfig.columns || 3) === col
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {col} Col
                      </button>
                    ))}
                  </div>
                </div>
                {/* Background Color */}
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
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Text / Foreground Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={String(elementConfig.style?.color || "#0f172a")}
                      onChange={(e) => handleStyleChange("color", e.target.value)}
                      className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={String(elementConfig.style?.color || "")}
                      onChange={(e) => handleStyleChange("color", e.target.value)}
                      placeholder="#0f172a or inherit"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Text Alignment */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Text Alignment
                  </label>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    {[
                      { val: "left", icon: AlignLeft },
                      { val: "center", icon: AlignCenter },
                      { val: "right", icon: AlignRight },
                      { val: "justify", icon: AlignJustify },
                    ].map((align) => {
                      const isActive = (elementConfig.style?.textAlign || "left") === align.val;
                      return (
                        <button
                          key={align.val}
                          type="button"
                          onClick={() => handleStyleChange("textAlign", align.val)}
                          className={`flex-1 py-1 rounded-lg flex items-center justify-center transition-all ${
                            isActive
                              ? "bg-white dark:bg-slate-700 text-blue-600 shadow-xs font-bold"
                              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <align.icon className="w-3.5 h-3.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Font Scale / Size
                  </label>
                  <select
                    value={String(elementConfig.style?.fontSize || "inherit")}
                    onChange={(e) => handleStyleChange("fontSize", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="inherit">Default / Inherit</option>
                    <option value="12px">Extra Small (12px)</option>
                    <option value="14px">Small (14px)</option>
                    <option value="16px">Base Body (16px)</option>
                    <option value="18px">Medium Lead (18px)</option>
                    <option value="24px">Headline H3 (24px)</option>
                    <option value="32px">Headline H2 (32px)</option>
                    <option value="48px">Hero Display H1 (48px)</option>
                  </select>
                </div>

                {/* Padding */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Padding (Inner Space)
                  </label>
                  <select
                    value={String(elementConfig.style?.padding || "16px")}
                    onChange={(e) => handleStyleChange("padding", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="0px">None (0px)</option>
                    <option value="8px">Compact (8px)</option>
                    <option value="16px">Standard (16px)</option>
                    <option value="24px">Spacious (24px)</option>
                    <option value="32px">Generous (32px)</option>
                    <option value="48px">Section Padding (48px)</option>
                    <option value="64px">Hero Large (64px)</option>
                  </select>
                </div>

                {/* Margin */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Margin (Outer Space)
                  </label>
                  <select
                    value={String(elementConfig.style?.margin || "0px")}
                    onChange={(e) => handleStyleChange("margin", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="0px">None (0px)</option>
                    <option value="8px">Small (8px)</option>
                    <option value="16px">Medium (16px)</option>
                    <option value="24px">Large (24px)</option>
                    <option value="32px">Extra Large (32px)</option>
                  </select>
                </div>

                {/* Border Radius */}
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
                    <option value="9999px">Pill / Circle (9999px)</option>
                  </select>
                </div>

                {/* Box Shadow */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Elevation &amp; Shadow
                  </label>
                  <select
                    value={String(elementConfig.style?.boxShadow || "none")}
                    onChange={(e) => handleStyleChange("boxShadow", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="none">Flat (None)</option>
                    <option value="0 1px 3px rgba(0,0,0,0.1)">Subtle Card</option>
                    <option value="0 10px 25px -5px rgba(0,0,0,0.1)">Medium Floating</option>
                    <option value="0 20px 25px -5px rgba(59,130,246,0.25)">Blue Glow Halo</option>
                    <option value="0 20px 25px -5px rgba(16,185,129,0.2)">Emerald Glow</option>
                  </select>
                </div>
              </div>
            )}

            {/* Inspector Tab 3: Advanced */}
            {inspectorTab === "advanced" && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Element Unique Node ID
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
                    placeholder="e.g. shadow-2xl hover:scale-102 transition-all"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Entrance Micro-Animation
                  </label>
                  <select
                    value={String(elementConfig.animation || "none")}
                    onChange={(e) => handlePropertyChange("animation", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="none">None (Standard)</option>
                    <option value="fade-in">Fade In (Smooth)</option>
                    <option value="slide-up">Slide In From Bottom</option>
                    <option value="zoom-in">Zoom In Scale</option>
                    <option value="pulse">Subtle Ambient Pulse</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Hide on Mobile (&lt;640px)
                    </span>
                    <input
                      type="checkbox"
                      checked={Boolean(elementConfig.hideOnMobile)}
                      onChange={(e) => handlePropertyChange("hideOnMobile", e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Hide on Desktop (&gt;=1024px)
                    </span>
                    <input
                      type="checkbox"
                      checked={Boolean(elementConfig.hideOnDesktop)}
                      onChange={(e) => handlePropertyChange("hideOnDesktop", e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Visible on Visual Canvas
                    </span>
                    <input
                      type="checkbox"
                      checked={elementConfig.visible !== false}
                      onChange={(e) => handlePropertyChange("visible", e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
            </div>
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

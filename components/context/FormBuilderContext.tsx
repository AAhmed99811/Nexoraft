"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import {
  ElementNode,
  ElementObjectMap,
  PageConfig,
  PageState,
  NavbarMode,
  WebsiteSite,
  BlogPost,
  MediaAsset,
  FormSubmission,
  Revision,
  WebsiteTheme,
  SubmissionStatus,
  CustomBreakpoints,
} from "../types";
import { TEMPLATES } from "../../lib/templates";

export interface FormBuilderStoreState {
  websiteId: string;
  websiteName: string;
  websiteDescription: string;
  elements: ElementObjectMap;
  focusedElement: string | null;
  selectedElement: string | null;
  hoveredElement: string | null;
  activePage: string;
  pageState: PageState;
  pages: Record<string, PageConfig>;
  navbarMode: NavbarMode;
  themeCode: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  textMutedColor: string;
  borderColor: string;
  fontFamily: string;
  headingFont: string;
  borderRadius: "none" | "sm" | "md" | "lg" | "full";
  customVariables: Record<string, string>;
  breakpoints: CustomBreakpoints;
  variables: Record<string, unknown>;
  posts: BlogPost[];
  media: MediaAsset[];
  submissions: FormSubmission[];
  revisions: Revision[];
  saveStatus: "saved" | "saving" | "published";
  canUndo: boolean;
  canRedo: boolean;
}

export type ActionType =
  | { type: "element/removeElement"; payload?: { id?: string } }
  | {
      type: "element/addElement";
      payload: { parentId: string; element: ElementNode };
    }
  | {
      type: "element/updateElement";
      payload: { id: string; changes: Partial<ElementNode> };
    }
  | {
      type: "element/reorderElement";
      payload: { parentId: string; startIndex: number; endIndex: number };
    }
  | {
      type: "variables/addMultipleVariables";
      payload: { allVariablesList: Record<string, unknown> };
    }
  | { type: "navbar/setMode"; payload: NavbarMode }
  | { type: string; payload?: unknown };

export interface FormBuilderContextValue extends FormBuilderStoreState {
  dispatch: (action: ActionType) => void;
  setFocusedElement: (id: string | null) => void;
  setSelectedElement: (id: string | null) => void;
  setNavbarMode: (mode: NavbarMode) => void;
  setActivePage: (pageId: string) => void;
  setWebsiteName: (name: string) => void;
  setThemeCode: (color: string) => void;
  setFontFamily: (font: string) => void;
  updateTheme: (theme: Partial<WebsiteTheme>) => void;
  eventDispatcher: (eventName: string, payload: unknown) => void;
  // Custom Variables & Breakpoints
  setCustomVariables: (
    vars:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => void;
  addCustomVariable: (key: string, value: string) => void;
  removeCustomVariable: (key: string) => void;
  updateBreakpoints: (breakpoints: Partial<CustomBreakpoints>) => void;
  // History / Undo / Redo
  undo: () => void;
  redo: () => void;
  // CMS Pages
  addPage: (page: { name: string; slug: string; templateType?: string }) => void;
  updatePage: (pageId: string, changes: Partial<PageConfig>) => void;
  deletePage: (pageId: string) => void;
  // CMS Posts
  addPost: (post: Omit<BlogPost, "id" | "publishedAt">) => void;
  updatePost: (id: string, changes: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  // CMS Media
  addMedia: (asset: Omit<MediaAsset, "id" | "createdAt">) => void;
  deleteMedia: (id: string) => void;
  // Lead Submissions
  addSubmission: (
    submission: Omit<FormSubmission, "id" | "submittedAt" | "status">
  ) => void;
  updateSubmissionStatus: (id: string, status: SubmissionStatus) => void;
  deleteSubmission: (id: string) => void;
  // Revisions & Publishing
  publishSite: (summary?: string) => Revision;
  restoreRevision: (revisionId: string) => boolean;
  setSaveStatus: (status: "saved" | "saving" | "published") => void;
}

const defaultTemplate = TEMPLATES["saas-landing"];

const FormBuilderContext = createContext<FormBuilderContextValue | null>(null);

export interface FormBuilderProviderProps {
  children: ReactNode;
  initialWebsiteId?: string;
  initialWebsiteName?: string;
  initialWebsiteDescription?: string;
  initialElements?: ElementObjectMap;
  initialPages?: Record<string, PageConfig>;
  initialActivePage?: string;
  initialThemeCode?: string;
  initialSecondaryColor?: string;
  initialAccentColor?: string;
  initialBackgroundColor?: string;
  initialSurfaceColor?: string;
  initialTextColor?: string;
  initialTextMutedColor?: string;
  initialBorderColor?: string;
  initialFontFamily?: string;
  initialHeadingFont?: string;
  initialBorderRadius?: "none" | "sm" | "md" | "lg" | "full";
  initialCustomVariables?: Record<string, string>;
  initialBreakpoints?: CustomBreakpoints;
  initialNavbarMode?: NavbarMode;
  initialPosts?: BlogPost[];
  initialMedia?: MediaAsset[];
  initialSubmissions?: FormSubmission[];
  initialRevisions?: Revision[];
  onSave?: (site: WebsiteSite) => void;
}

export const FormBuilderProvider: React.FC<FormBuilderProviderProps> = ({
  children,
  initialWebsiteId = defaultTemplate.id,
  initialWebsiteName = defaultTemplate.name,
  initialWebsiteDescription = defaultTemplate.description,
  initialElements = defaultTemplate.elements,
  initialPages = defaultTemplate.pages,
  initialActivePage = defaultTemplate.activePage,
  initialThemeCode = defaultTemplate.theme.primaryColor,
  initialSecondaryColor = defaultTemplate.theme.secondaryColor || "#6366f1",
  initialAccentColor = defaultTemplate.theme.accentColor || "#10b981",
  initialBackgroundColor = defaultTemplate.theme.backgroundColor || "#ffffff",
  initialSurfaceColor = defaultTemplate.theme.surfaceColor || "#f8fafc",
  initialTextColor = defaultTemplate.theme.textColor || "#0f172a",
  initialTextMutedColor = defaultTemplate.theme.textMutedColor || "#64748b",
  initialBorderColor = defaultTemplate.theme.borderColor || "#e2e8f0",
  initialFontFamily = defaultTemplate.theme.fontFamily,
  initialHeadingFont = defaultTemplate.theme.headingFont || "Inter, sans-serif",
  initialBorderRadius = defaultTemplate.theme.borderRadius || "lg",
  initialCustomVariables = defaultTemplate.theme.customVariables || {
    "--brand-glow": "#3b82f640",
    "--card-surface": "#ffffff",
    "--accent-gradient": "linear-gradient(135deg, #3b82f6, #6366f1)",
  },
  initialBreakpoints = defaultTemplate.theme.breakpoints || {
    desktop: 1280,
    laptop: 1024,
    tablet: 768,
    mobile: 390,
  },
  initialNavbarMode = "horizontal",
  initialPosts = defaultTemplate.posts || [],
  initialMedia = defaultTemplate.media || [],
  initialSubmissions = defaultTemplate.submissions || [],
  initialRevisions = defaultTemplate.revisions || [],
}) => {
  const [websiteId] = useState<string>(initialWebsiteId);
  const [websiteName, setWebsiteName] = useState<string>(initialWebsiteName);
  const [websiteDescription] = useState<string>(initialWebsiteDescription);
  const [elements, setElements] = useState<ElementObjectMap>(initialElements);
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [hoveredElement] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<string>(initialActivePage);

  const switchPage = useCallback((newPageId: string) => {
    setActivePage(newPageId);
    setFocusedElement(null);
    setSelectedElement(null);
  }, []);
  const [pages, setPages] =
    useState<Record<string, PageConfig>>(initialPages);
  const [navbarMode, setNavbarMode] = useState<NavbarMode>(initialNavbarMode);
  const [themeCode, setThemeCode] = useState<string>(initialThemeCode);
  const [secondaryColor, setSecondaryColor] =
    useState<string>(initialSecondaryColor);
  const [accentColor, setAccentColor] = useState<string>(initialAccentColor);
  const [fontFamily, setFontFamily] = useState<string>(initialFontFamily);
  const [headingFont, setHeadingFont] = useState<string>(initialHeadingFont);
  const [borderRadius, setBorderRadius] = useState<
    "none" | "sm" | "md" | "lg" | "full"
  >(initialBorderRadius);
  const [backgroundColor, setBackgroundColor] = useState<string>(
    initialBackgroundColor
  );
  const [surfaceColor, setSurfaceColor] = useState<string>(initialSurfaceColor);
  const [textColor, setTextColor] = useState<string>(initialTextColor);
  const [textMutedColor, setTextMutedColor] = useState<string>(
    initialTextMutedColor
  );
  const [borderColor, setBorderColor] = useState<string>(initialBorderColor);
  const [customVariables, setCustomVariables] = useState<Record<string, string>>(
    initialCustomVariables
  );
  const [breakpoints, setBreakpoints] = useState<CustomBreakpoints>(
    initialBreakpoints
  );

  const addCustomVariable = useCallback((key: string, value: string) => {
    const formattedKey = key.startsWith("--") ? key : `--${key}`;
    setCustomVariables((prev) => ({ ...prev, [formattedKey]: value }));
  }, []);

  const removeCustomVariable = useCallback((key: string) => {
    setCustomVariables((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const updateBreakpoints = useCallback(
    (bpChanges: Partial<CustomBreakpoints>) => {
      setBreakpoints((prev) => ({ ...prev, ...bpChanges }));
    },
    []
  );

  const [variables, setVariables] = useState<Record<string, unknown>>({});
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [media, setMedia] = useState<MediaAsset[]>(initialMedia);
  const [submissions, setSubmissions] =
    useState<FormSubmission[]>(initialSubmissions);
  const [revisions, setRevisions] = useState<Revision[]>(initialRevisions);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "published">(
    "saved"
  );

  // Undo / Redo history stacks
  const [history, setHistory] = useState<ElementObjectMap[]>([initialElements]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isUndoingOrRedoing = useRef(false);

  const pushToHistory = useCallback((nextElements: ElementObjectMap) => {
    if (isUndoingOrRedoing.current) return;
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, nextElements].slice(-30); // max 30 history states
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 29));
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoingOrRedoing.current = true;
      const targetState = history[historyIndex - 1];
      setHistoryIndex((prev) => prev - 1);
      setElements(targetState);
      setTimeout(() => {
        isUndoingOrRedoing.current = false;
      }, 50);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoingOrRedoing.current = true;
      const targetState = history[historyIndex + 1];
      setHistoryIndex((prev) => prev + 1);
      setElements(targetState);
      setTimeout(() => {
        isUndoingOrRedoing.current = false;
      }, 50);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const eventDispatcher = useCallback(
    (eventName: string, payload: unknown) => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(`website-event:${eventName}`, { detail: payload })
        );
      }
    },
    []
  );

  // Handle lead submission from preview forms
  const addSubmission = useCallback(
    (submission: Omit<FormSubmission, "id" | "submittedAt" | "status">) => {
      const newLead: FormSubmission = {
        ...submission,
        id: `sub-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
        submittedAt: Date.now(),
        status: "new",
      };
      setSubmissions((prev) => [newLead, ...prev]);
    },
    []
  );

  const updateSubmissionStatus = useCallback(
    (id: string, status: SubmissionStatus) => {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    },
    []
  );

  const deleteSubmission = useCallback((id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // Listen for lead submissions emitted from preview
  useEffect(() => {
    const handleLeadEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        addSubmission({
          formName: customEvent.detail.formName || "Contact Form",
          pageId: activePage,
          data: {
            name: customEvent.detail.name || "Anonymous",
            email: customEvent.detail.email || "unknown@domain.com",
            message: customEvent.detail.message || "",
          },
        });
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("website-event:lead-submitted", handleLeadEvent);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "website-event:lead-submitted",
          handleLeadEvent
        );
      }
    };
  }, [activePage, addSubmission]);

  const dispatch = useCallback(
    (action: ActionType) => {
      if (!action || !action.type) return;

      switch (action.type) {
        case "element/removeElement": {
          const payload = action.payload as { id?: string } | undefined;
          const targetId = payload?.id || focusedElement || selectedElement;
          if (!targetId) return;

          setElements((prev) => {
            const next: ElementObjectMap = { ...prev };

            const idsToRemove = new Set<string>();
            const collect = (id: string) => {
              idsToRemove.add(id);
              next[id]?.children?.forEach((childId) => collect(childId));
            };
            collect(targetId);

            Object.keys(next).forEach((k) => {
              if (next[k]?.children?.includes(targetId)) {
                next[k] = {
                  ...next[k],
                  children: next[k].children?.filter((c) => c !== targetId),
                };
              }
            });

            idsToRemove.forEach((id) => {
              delete next[id];
            });

            pushToHistory(next);
            return next;
          });

          if (focusedElement === targetId) setFocusedElement(null);
          if (selectedElement === targetId) setSelectedElement(null);
          break;
        }

        case "element/addElement": {
          const { parentId, element } = action.payload as {
            parentId: string;
            element: ElementNode;
          };
          setElements((prev) => {
            const next: ElementObjectMap = { ...prev, [element.id]: element };
            if (next[parentId]) {
              next[parentId] = {
                ...next[parentId],
                children: [...(next[parentId].children || []), element.id],
              };
            }
            pushToHistory(next);
            return next;
          });
          setFocusedElement(element.id);
          break;
        }

        case "element/updateElement": {
          const { id, changes } = action.payload as {
            id: string;
            changes: Partial<ElementNode>;
          };
          setElements((prev) => {
            if (!prev[id]) return prev;
            const next = {
              ...prev,
              [id]: {
                ...prev[id],
                ...changes,
              },
            };
            pushToHistory(next);
            return next;
          });
          break;
        }

        case "variables/addMultipleVariables": {
          const { allVariablesList } = action.payload as {
            allVariablesList: Record<string, unknown>;
          };
          setVariables((prev) => ({
            ...prev,
            ...allVariablesList,
          }));
          break;
        }

        case "navbar/setMode": {
          setNavbarMode(action.payload as NavbarMode);
          break;
        }

        default:
          break;
      }
    },
    [focusedElement, selectedElement, pushToHistory]
  );

  // Pages CRUD
  const addPage = useCallback(
    ({
      name,
      slug,
      templateType = "blank",
    }: {
      name: string;
      slug: string;
      templateType?: string;
    }) => {
      const pageId = `page-${Date.now().toString(36)}`;
      const rootId = `root-${pageId}`;
      const cleanSlug = slug.startsWith("/") ? slug : `/${slug}`;

      const newRootElement: ElementNode = {
        id: rootId,
        label: `${name} Root`,
        elementType: "Container",
        isRoot: true,
        visible: true,
        children: [`nav-${pageId}`, `hero-${pageId}`, `footer-${pageId}`],
        style: {
          backgroundColor: "#ffffff",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        },
      };

      const newNav: ElementNode = {
        id: `nav-${pageId}`,
        label: "Navbar",
        elementType: "NavbarSection",
        title: websiteName || "Nexoraft",
        buttonText: "Get Started",
        items: [
          { label: "Home", href: "/" },
          { label: name, href: cleanSlug },
        ],
        visible: true,
      };

      const newHero: ElementNode = {
        id: `hero-${pageId}`,
        label: "Hero Section",
        elementType: "HeroSection",
        badge: "PAGE",
        title: name,
        subtitle: `Welcome to the ${name} page. Add sections and style content from the inspector.`,
        buttonText: "Explore More",
        visible: true,
      };

      const newFooter: ElementNode = {
        id: `footer-${pageId}`,
        label: "Footer",
        elementType: "FooterSection",
        title: websiteName || "Nexoraft",
        content: "Built with Nexoraft Visual Website Builder.",
        visible: true,
      };

      const newPageConfig: PageConfig = {
        id: pageId,
        name,
        slug: cleanSlug,
        rootElementId: rootId,
        status: "published",
        order: Object.keys(pages).length + 1,
        templateId: templateType,
        seo: {
          title: `${name} | ${websiteName}`,
          description: `Discover ${name} on ${websiteName}.`,
        },
      };

      setElements((prev) => ({
        ...prev,
        [rootId]: newRootElement,
        [`nav-${pageId}`]: newNav,
        [`hero-${pageId}`]: newHero,
        [`footer-${pageId}`]: newFooter,
      }));

      setPages((prev) => ({
        ...prev,
        [pageId]: newPageConfig,
      }));

      switchPage(pageId);
    },
    [pages, websiteName, switchPage]
  );

  const updatePage = useCallback(
    (pageId: string, changes: Partial<PageConfig>) => {
      setPages((prev) => {
        if (!prev[pageId]) return prev;
        return {
          ...prev,
          [pageId]: {
            ...prev[pageId],
            ...changes,
          },
        };
      });
    },
    []
  );

  const deletePage = useCallback(
    (pageId: string) => {
      if (Object.keys(pages).length <= 1) return; // Keep at least one page
      setPages((prev) => {
        const next = { ...prev };
        delete next[pageId];
        return next;
      });
      if (activePage === pageId) {
        const remaining = Object.keys(pages).filter((k) => k !== pageId);
        if (remaining.length > 0) switchPage(remaining[0]);
      }
    },
    [pages, activePage, switchPage]
  );

  // Blog Posts CRUD
  const addPost = useCallback(
    (postData: Omit<BlogPost, "id" | "publishedAt">) => {
      const newPost: BlogPost = {
        ...postData,
        id: `post-${Date.now().toString(36)}`,
        publishedAt: Date.now(),
      };
      setPosts((prev) => [newPost, ...prev]);
    },
    []
  );

  const updatePost = useCallback(
    (id: string, changes: Partial<BlogPost>) => {
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...changes } : p))
      );
    },
    []
  );

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Media Library CRUD
  const addMedia = useCallback(
    (assetData: Omit<MediaAsset, "id" | "createdAt">) => {
      const newAsset: MediaAsset = {
        ...assetData,
        id: `media-${Date.now().toString(36)}`,
        createdAt: Date.now(),
      };
      setMedia((prev) => [newAsset, ...prev]);
    },
    []
  );

  const deleteMedia = useCallback((id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // Revisions & Publishing
  const publishSite = useCallback(
    (summary: string = "Published latest changes"): Revision => {
      const newRev: Revision = {
        id: `rev-${Date.now().toString(36)}`,
        timestamp: Date.now(),
        summary,
        author: "Arham ahmed",
        elementsSnapshot: JSON.parse(JSON.stringify(elements)),
        pagesSnapshot: JSON.parse(JSON.stringify(pages)),
      };
      setRevisions((prev) => [newRev, ...prev]);
      setSaveStatus("published");
      return newRev;
    },
    [elements, pages]
  );

  const restoreRevision = useCallback(
    (revisionId: string): boolean => {
      const target = revisions.find((r) => r.id === revisionId);
      if (!target) return false;
      setElements(JSON.parse(JSON.stringify(target.elementsSnapshot)));
      setPages(JSON.parse(JSON.stringify(target.pagesSnapshot)));
      pushToHistory(JSON.parse(JSON.stringify(target.elementsSnapshot)));
      return true;
    },
    [revisions, pushToHistory]
  );

  const updateTheme = useCallback((themeChanges: Partial<WebsiteTheme>) => {
    if (themeChanges.primaryColor) setThemeCode(themeChanges.primaryColor);
    if (themeChanges.secondaryColor) setSecondaryColor(themeChanges.secondaryColor);
    if (themeChanges.accentColor) setAccentColor(themeChanges.accentColor);
    if (themeChanges.backgroundColor) setBackgroundColor(themeChanges.backgroundColor);
    if (themeChanges.surfaceColor) setSurfaceColor(themeChanges.surfaceColor);
    if (themeChanges.textColor) setTextColor(themeChanges.textColor);
    if (themeChanges.textMutedColor) setTextMutedColor(themeChanges.textMutedColor);
    if (themeChanges.borderColor) setBorderColor(themeChanges.borderColor);
    if (themeChanges.fontFamily) setFontFamily(themeChanges.fontFamily);
    if (themeChanges.headingFont) setHeadingFont(themeChanges.headingFont);
    if (themeChanges.borderRadius) setBorderRadius(themeChanges.borderRadius);
    if (themeChanges.customVariables) setCustomVariables(themeChanges.customVariables);
    if (themeChanges.breakpoints)
      setBreakpoints((prev) => ({ ...prev, ...themeChanges.breakpoints }));
  }, []);

  const contextValue: FormBuilderContextValue = useMemo(
    () => ({
      websiteId,
      websiteName,
      websiteDescription,
      elements,
      focusedElement,
      selectedElement,
      hoveredElement,
      activePage,
      pageState: { activePage, pages },
      pages,
      navbarMode,
      themeCode,
      secondaryColor,
      accentColor,
      backgroundColor,
      surfaceColor,
      textColor,
      textMutedColor,
      borderColor,
      fontFamily,
      headingFont,
      borderRadius,
      customVariables,
      breakpoints,
      variables,
      posts,
      media,
      submissions,
      revisions,
      saveStatus,
      canUndo,
      canRedo,
      dispatch,
      setFocusedElement,
      setSelectedElement,
      setNavbarMode,
      setActivePage: switchPage,
      setWebsiteName,
      setThemeCode,
      setFontFamily,
      updateTheme,
      setCustomVariables,
      addCustomVariable,
      removeCustomVariable,
      updateBreakpoints,
      eventDispatcher,
      undo,
      redo,
      addPage,
      updatePage,
      deletePage,
      addPost,
      updatePost,
      deletePost,
      addMedia,
      deleteMedia,
      addSubmission,
      updateSubmissionStatus,
      deleteSubmission,
      publishSite,
      restoreRevision,
      setSaveStatus,
    }),
    [
      websiteId,
      websiteName,
      websiteDescription,
      elements,
      focusedElement,
      selectedElement,
      hoveredElement,
      activePage,
      pages,
      navbarMode,
      themeCode,
      secondaryColor,
      accentColor,
      backgroundColor,
      surfaceColor,
      textColor,
      textMutedColor,
      borderColor,
      fontFamily,
      headingFont,
      borderRadius,
      customVariables,
      breakpoints,
      variables,
      posts,
      media,
      submissions,
      revisions,
      saveStatus,
      canUndo,
      canRedo,
      dispatch,
      updateTheme,
      setCustomVariables,
      addCustomVariable,
      removeCustomVariable,
      updateBreakpoints,
      eventDispatcher,
      undo,
      redo,
      addPage,
      updatePage,
      deletePage,
      addPost,
      updatePost,
      deletePost,
      addMedia,
      deleteMedia,
      addSubmission,
      updateSubmissionStatus,
      deleteSubmission,
      publishSite,
      restoreRevision,
      switchPage,
    ]
  );

  return (
    <FormBuilderContext.Provider value={contextValue}>
      {children}
    </FormBuilderContext.Provider>
  );
};

export function useFormBuilderState(): FormBuilderContextValue {
  const ctx = useContext(FormBuilderContext);
  if (!ctx) {
    const fallbackDispatch: (action: ActionType) => void = () => {};
    return {
      websiteId: defaultTemplate.id,
      websiteName: defaultTemplate.name,
      websiteDescription: defaultTemplate.description,
      elements: defaultTemplate.elements,
      focusedElement: null,
      selectedElement: null,
      hoveredElement: null,
      activePage: "home",
      pageState: { activePage: "home", pages: defaultTemplate.pages },
      pages: defaultTemplate.pages,
      navbarMode: "horizontal",
      themeCode: defaultTemplate.theme.primaryColor,
      secondaryColor: "#6366f1",
      accentColor: "#10b981",
      backgroundColor: "#ffffff",
      surfaceColor: "#f8fafc",
      textColor: "#0f172a",
      textMutedColor: "#64748b",
      borderColor: "#e2e8f0",
      fontFamily: defaultTemplate.theme.fontFamily,
      headingFont: "Inter, sans-serif",
      borderRadius: "lg",
      customVariables: {
        "--brand-glow": "#3b82f640",
        "--card-surface": "#ffffff",
      },
      breakpoints: {
        desktop: 1280,
        laptop: 1024,
        tablet: 768,
        mobile: 390,
      },
      variables: {},
      posts: [],
      media: [],
      submissions: [],
      revisions: [],
      saveStatus: "saved",
      canUndo: false,
      canRedo: false,
      dispatch: fallbackDispatch,
      setFocusedElement: () => {},
      setSelectedElement: () => {},
      setNavbarMode: () => {},
      setActivePage: () => {},
      setWebsiteName: () => {},
      setThemeCode: () => {},
      setFontFamily: () => {},
      updateTheme: () => {},
      setCustomVariables: () => {},
      addCustomVariable: () => {},
      removeCustomVariable: () => {},
      updateBreakpoints: () => {},
      eventDispatcher: () => {},
      undo: () => {},
      redo: () => {},
      addPage: () => {},
      updatePage: () => {},
      deletePage: () => {},
      addPost: () => {},
      updatePost: () => {},
      deletePost: () => {},
      addMedia: () => {},
      deleteMedia: () => {},
      addSubmission: () => {},
      updateSubmissionStatus: () => {},
      deleteSubmission: () => {},
      publishSite: () => ({
        id: "rev-stub",
        timestamp: Date.now(),
        summary: "Stub",
        author: "User",
        elementsSnapshot: {},
        pagesSnapshot: {},
      }),
      restoreRevision: () => false,
      setSaveStatus: () => {},
    };
  }
  return ctx;
}

// Action creators
export const elementSlice = {
  removeElement: (payload: { id?: string } = {}) => ({
    type: "element/removeElement" as const,
    payload,
  }),
  addElement: (parentId: string, element: ElementNode) => ({
    type: "element/addElement" as const,
    payload: { parentId, element },
  }),
  updateElement: (id: string, changes: Partial<ElementNode>) => ({
    type: "element/updateElement" as const,
    payload: { id, changes },
  }),
};

export const variablesSlice = {
  addMultipleVariables: (payload: {
    allVariablesList: Record<string, unknown>;
  }) => ({
    type: "variables/addMultipleVariables" as const,
    payload,
  }),
};

// Hooks
export const hooks = {
  useElementObject: () => {
    const { elements } = useFormBuilderState();
    return elements;
  },
  useElementState: () => {
    const { focusedElement, selectedElement, hoveredElement } =
      useFormBuilderState();
    return { focusedElement, selectedElement, hoveredElement };
  },
  useElementSelector: (id?: string) => {
    const { elements, focusedElement, selectedElement } = useFormBuilderState();
    if (id) {
      return elements[id];
    }
    const targetId = focusedElement || selectedElement;
    return targetId ? elements[targetId] : undefined;
  },
  usePageState: () => {
    const { pageState } = useFormBuilderState();
    return pageState;
  },
  usePageSelector: (pageId?: string) => {
    const { pages, pageState } = useFormBuilderState();
    const id = pageId || pageState.activePage;
    return pages[id];
  },
  useModuleThemeSelector: () => {
    const { themeCode } = useFormBuilderState();
    return themeCode;
  },
  useModuleFontFamilySelector: () => {
    const { fontFamily } = useFormBuilderState();
    return fontFamily;
  },
  useWebsiteInfo: () => {
    const { websiteId, websiteName, websiteDescription } =
      useFormBuilderState();
    return { websiteId, websiteName, websiteDescription };
  },
  // Legacy stubs kept for backwards compatibility
  useUser: () => ({ data: { userId: "creator", userName: "Website Creator" } }),
  useAppId: () => "website",
  useAppsData: () => ({ isEnableTotp: false }),
};

export const useDispatch = () => {
  const { dispatch } = useFormBuilderState();
  return dispatch;
};

export const useSelector = <T,>(
  selector: (state: {
    navbarSlice?: { mode: NavbarMode };
    elementSlice?: { elements: ElementObjectMap };
    pageSlice?: { activePage: string; pages: Record<string, PageConfig> };
    variablesSlice?: Record<string, unknown>;
  }) => T
): T => {
  const ctx = useFormBuilderState();
  const rootState = {
    navbarSlice: { mode: ctx.navbarMode },
    elementSlice: { elements: ctx.elements },
    pageSlice: { activePage: ctx.pageState.activePage, pages: ctx.pages },
    variablesSlice: ctx.variables,
  };
  return selector(rootState);
};

export const useAppEventContext = () => {
  const { eventDispatcher } = useFormBuilderState();
  return {
    eventDispacher: eventDispatcher,
  };
};

export default FormBuilderContext;

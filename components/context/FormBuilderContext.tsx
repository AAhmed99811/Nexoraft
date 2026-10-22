"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import {
  ElementNode,
  ElementObjectMap,
  PageConfig,
  PageState,
  NavbarMode,
  WebsiteSite,
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
  fontFamily: string;
  variables: Record<string, unknown>;
}

export type ActionType =
  | { type: "element/removeElement"; payload?: { id?: string } }
  | { type: "element/addElement"; payload: { parentId: string; element: ElementNode } }
  | { type: "element/updateElement"; payload: { id: string; changes: Partial<ElementNode> } }
  | { type: "element/reorderElement"; payload: { parentId: string; startIndex: number; endIndex: number } }
  | { type: "variables/addMultipleVariables"; payload: { allVariablesList: Record<string, unknown> } }
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
  eventDispatcher: (eventName: string, payload: unknown) => void;
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
  initialFontFamily?: string;
  initialNavbarMode?: NavbarMode;
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
  initialFontFamily = defaultTemplate.theme.fontFamily,
  initialNavbarMode = "horizontal",
}) => {
  const [websiteId] = useState<string>(initialWebsiteId);
  const [websiteName, setWebsiteName] = useState<string>(initialWebsiteName);
  const [websiteDescription] = useState<string>(initialWebsiteDescription);
  const [elements, setElements] = useState<ElementObjectMap>(initialElements);
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [hoveredElement] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<string>(initialActivePage);
  const [pages] = useState<Record<string, PageConfig>>(initialPages);
  const [navbarMode, setNavbarMode] = useState<NavbarMode>(initialNavbarMode);
  const [themeCode, setThemeCode] = useState<string>(initialThemeCode);
  const [fontFamily, setFontFamily] = useState<string>(initialFontFamily);
  const [variables, setVariables] = useState<Record<string, unknown>>({});

  const eventDispatcher = useCallback((eventName: string, payload: unknown) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(`website-event:${eventName}`, { detail: payload }));
    }
  }, []);

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

            // Recursively collect all descendant IDs to remove
            const idsToRemove = new Set<string>();
            const collect = (id: string) => {
              idsToRemove.add(id);
              next[id]?.children?.forEach((childId) => collect(childId));
            };
            collect(targetId);

            // Remove from parent's children array
            Object.keys(next).forEach((k) => {
              if (next[k]?.children?.includes(targetId)) {
                next[k] = {
                  ...next[k],
                  children: next[k].children?.filter((c) => c !== targetId),
                };
              }
            });

            // Delete nodes
            idsToRemove.forEach((id) => {
              delete next[id];
            });

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
            return {
              ...prev,
              [id]: {
                ...prev[id],
                ...changes,
              },
            };
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
    [focusedElement, selectedElement]
  );

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
      fontFamily,
      variables,
      dispatch,
      setFocusedElement,
      setSelectedElement,
      setNavbarMode,
      setActivePage,
      setWebsiteName,
      setThemeCode,
      setFontFamily,
      eventDispatcher,
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
      fontFamily,
      variables,
      dispatch,
      eventDispatcher,
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
      fontFamily: defaultTemplate.theme.fontFamily,
      variables: {},
      dispatch: fallbackDispatch,
      setFocusedElement: () => {},
      setSelectedElement: () => {},
      setNavbarMode: () => {},
      setActivePage: () => {},
      setWebsiteName: () => {},
      setThemeCode: () => {},
      setFontFamily: () => {},
      eventDispatcher: () => {},
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
  addMultipleVariables: (payload: { allVariablesList: Record<string, unknown> }) => ({
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
    const { focusedElement, selectedElement, hoveredElement } = useFormBuilderState();
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
    const { websiteId, websiteName, websiteDescription } = useFormBuilderState();
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

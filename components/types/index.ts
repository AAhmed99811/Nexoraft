import React from "react";

export type DeviceType = "desktop" | "tablet" | "mobile" | string;
export type NavbarMode = "vertical" | "horizontal";
export type SiteStatus = "draft" | "published" | "archived";
export type PageStatus = "draft" | "published";
export type SubmissionStatus = "new" | "read" | "archived";

export interface ElementNode {
  id: string;
  label?: string;
  elementType?: string;
  isRoot?: boolean;
  isPersist?: boolean;
  visible?: boolean | string | Record<string, unknown>;
  children?: string[];
  style?: React.CSSProperties;
  className?: string;
  props?: Record<string, unknown>;
  title?: string;
  subtitle?: string;
  badge?: string;
  content?: string;
  buttonText?: string;
  buttonSecondaryText?: string;
  variant?: string;
  placeholder?: string;
  defaultValue?: unknown;
  value?: unknown;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  src?: string;
  alt?: string;
  href?: string;
  items?: Array<Record<string, unknown>>;
  options?: Array<{ label: string; value: string }>;
  checkboxLabel?: string;
  [key: string]: unknown;
}

export type ElementObjectMap = Record<string, ElementNode>;

export interface PageSeoConfig {
  title?: string;
  description?: string;
  ogImage?: string;
  keywords?: string;
  noIndex?: boolean;
}

export interface PageConfig {
  id: string;
  name: string;
  slug: string;
  rootElementId: string;
  status?: PageStatus;
  seo?: PageSeoConfig;
  order?: number;
  templateId?: string;
  [key: string]: unknown;
}

export interface PageState {
  activePage: string;
  pages?: Record<string, PageConfig>;
}

export interface ElementState {
  focusedElement?: string | null;
  selectedElement?: string | null;
  hoveredElement?: string | null;
}

export interface WebsiteTheme {
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily: string;
  headingFont?: string;
  borderRadius?: "none" | "sm" | "md" | "lg" | "full";
  mode?: "light" | "dark" | "system";
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string[];
  author: string;
  featuredImage?: string;
  publishedAt: number;
  status: "draft" | "published";
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  size?: string;
  mimeType?: string;
  createdAt: number;
}

export interface NavMenuItem {
  id: string;
  label: string;
  href: string;
  target?: "_self" | "_blank";
  isExternal?: boolean;
}

export interface NavMenu {
  id: string;
  name: string;
  location: "header" | "footer";
  items: NavMenuItem[];
}

export interface FormSubmission {
  id: string;
  formName: string;
  pageId?: string;
  submittedAt: number;
  data: Record<string, string>;
  status: SubmissionStatus;
}

export interface Revision {
  id: string;
  timestamp: number;
  summary: string;
  author: string;
  elementsSnapshot: ElementObjectMap;
  pagesSnapshot: Record<string, PageConfig>;
}

export interface WebsiteSite {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: "saas" | "portfolio" | "agency" | "ecommerce" | "blog" | "blank";
  status?: SiteStatus;
  version?: number;
  updatedAt: number;
  createdAt: number;
  theme: WebsiteTheme;
  pages: Record<string, PageConfig>;
  activePage: string;
  elements: ElementObjectMap;
  posts?: BlogPost[];
  media?: MediaAsset[];
  menus?: NavMenu[];
  submissions?: FormSubmission[];
  revisions?: Revision[];
}

export interface NavbarSliceState {
  mode: NavbarMode;
}

export interface ReactFormBuilderProps {
  deviceType?: DeviceType;
  show_description?: boolean;
  toolbarItems?: unknown[];
  className?: string;
  style?: React.CSSProperties;
  mode?: NavbarMode;
}

export interface PreviewProps {
  rootId?: string;
  style?: React.CSSProperties;
  className?: string;
  isPreview?: boolean;
  [key: string]: unknown;
}

export interface AppRendererProps {
  id: string;
  isEditable?: boolean;
  isPreview?: boolean;
  getVariableValue?: (varName: string) => unknown;
  useVisible?: (visibleRule: unknown) => boolean;
  myRenderIndex?: number;
  parent?: string;
  style?: React.CSSProperties;
  focusedSubTree?: string[] | null;
  [key: string]: unknown;
}

// Deprecated legacy types kept for temporary compatibility
export interface UserVO {
  data?: {
    userId?: string;
    userName?: string;
    email?: string;
  };
}

export interface AppData {
  appId?: string;
  isEnableTotp?: boolean;
  [key: string]: unknown;
}

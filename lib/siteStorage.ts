import { WebsiteSite, Revision, FormSubmission } from "../components/types";
import { TEMPLATES } from "./templates";

const STORAGE_KEY = "nexoraft_websites_v2";
const LEGACY_STORAGE_KEY = "webcraft_websites_v1";

function isClient(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function subscribeToWebsites(listener: () => void): () => void {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

let cachedSnapshot: WebsiteSite[] = [];
let cachedRaw: string | null = null;

export function getWebsitesSnapshot(): WebsiteSite[] {
  if (!isClient()) {
    return Object.values(TEMPLATES);
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw && cachedSnapshot.length > 0) {
      return cachedSnapshot;
    }
    cachedRaw = raw;
    cachedSnapshot = getAllWebsites();
    return cachedSnapshot;
  } catch {
    return Object.values(TEMPLATES);
  }
}

export function getWebsitesServerSnapshot(): WebsiteSite[] {
  return Object.values(TEMPLATES);
}

export function getAllWebsites(): WebsiteSite[] {
  if (!isClient()) {
    return Object.values(TEMPLATES);
  }

  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check for legacy data migration
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        try {
          const parsedLegacy = JSON.parse(legacyRaw);
          if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
            localStorage.setItem(STORAGE_KEY, legacyRaw);
            raw = legacyRaw;
          }
        } catch {
          // ignore legacy parse errors
        }
      }
    }

    if (!raw) {
      const initial = Object.values(TEMPLATES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    }

    const initial = Object.values(TEMPLATES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch (err) {
    console.error("Error reading websites from localStorage:", err);
    return Object.values(TEMPLATES);
  }
}

export function getWebsite(id: string): WebsiteSite | null {
  const all = getAllWebsites();
  const found = all.find((site) => site.id === id);
  if (found) return found;

  const fromTemplates = Object.values(TEMPLATES).find((t) => t.id === id);
  return fromTemplates || null;
}

export function saveWebsite(website: WebsiteSite): void {
  if (!isClient()) return;
  const all = getAllWebsites();
  const updatedSite: WebsiteSite = {
    ...website,
    updatedAt: Date.now(),
  };

  const existingIndex = all.findIndex((s) => s.id === website.id);
  let nextSites: WebsiteSite[];
  if (existingIndex >= 0) {
    nextSites = [...all];
    nextSites[existingIndex] = updatedSite;
  } else {
    nextSites = [updatedSite, ...all];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSites));
    cachedRaw = null;
    notifyListeners();
  } catch (err) {
    console.error("Failed to save website to localStorage:", err);
  }
}

export function createWebsite(options: {
  name: string;
  templateKey?: string;
  description?: string;
  category?: "saas" | "portfolio" | "agency" | "ecommerce" | "blog" | "blank";
}): WebsiteSite {
  const templateKey = options.templateKey || "saas-landing";
  const baseTemplate = TEMPLATES[templateKey] || TEMPLATES["blank-canvas"];
  const newId = `site-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const slug = options.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const newSite: WebsiteSite = {
    ...baseTemplate,
    id: newId,
    name: options.name,
    slug: slug || "my-website",
    description: options.description || baseTemplate.description,
    category: options.category || baseTemplate.category,
    status: "draft",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    elements: JSON.parse(JSON.stringify(baseTemplate.elements)),
    pages: JSON.parse(JSON.stringify(baseTemplate.pages)),
    posts: baseTemplate.posts ? JSON.parse(JSON.stringify(baseTemplate.posts)) : [],
    media: baseTemplate.media ? JSON.parse(JSON.stringify(baseTemplate.media)) : [],
    menus: baseTemplate.menus ? JSON.parse(JSON.stringify(baseTemplate.menus)) : [],
    submissions: [],
    revisions: [
      {
        id: `rev-${Date.now().toString(36)}`,
        timestamp: Date.now(),
        summary: "Initial Project Created",
        author: "Arham ahmed",
        elementsSnapshot: JSON.parse(JSON.stringify(baseTemplate.elements)),
        pagesSnapshot: JSON.parse(JSON.stringify(baseTemplate.pages)),
      },
    ],
  };

  saveWebsite(newSite);
  return newSite;
}

export function duplicateWebsite(id: string): WebsiteSite | null {
  const source = getWebsite(id);
  if (!source) return null;

  const newId = `site-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const cloned: WebsiteSite = {
    ...source,
    id: newId,
    name: `${source.name} (Copy)`,
    slug: `${source.slug}-copy`,
    status: "draft",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    elements: JSON.parse(JSON.stringify(source.elements)),
    pages: JSON.parse(JSON.stringify(source.pages)),
    posts: source.posts ? JSON.parse(JSON.stringify(source.posts)) : [],
    media: source.media ? JSON.parse(JSON.stringify(source.media)) : [],
    menus: source.menus ? JSON.parse(JSON.stringify(source.menus)) : [],
    submissions: [],
    revisions: [],
  };

  saveWebsite(cloned);
  return cloned;
}

export function deleteWebsite(id: string): void {
  if (!isClient()) return;
  const all = getAllWebsites();
  const nextSites = all.filter((s) => s.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSites));
    cachedRaw = null;
    notifyListeners();
  } catch (err) {
    console.error("Failed to delete website from localStorage:", err);
  }
}

export function toggleArchiveWebsite(id: string): void {
  const site = getWebsite(id);
  if (!site) return;
  const nextStatus = site.status === "archived" ? "published" : "archived";
  saveWebsite({ ...site, status: nextStatus });
}

export function publishWebsite(id: string, summary: string = "Published latest changes"): Revision | null {
  const site = getWebsite(id);
  if (!site) return null;

  const newRevision: Revision = {
    id: `rev-${Date.now().toString(36)}`,
    timestamp: Date.now(),
    summary,
    author: "Arham ahmed",
    elementsSnapshot: JSON.parse(JSON.stringify(site.elements)),
    pagesSnapshot: JSON.parse(JSON.stringify(site.pages)),
  };

  const updatedRevisions = [newRevision, ...(site.revisions || [])];
  saveWebsite({
    ...site,
    status: "published",
    revisions: updatedRevisions,
  });

  return newRevision;
}

export function restoreWebsiteRevision(siteId: string, revisionId: string): boolean {
  const site = getWebsite(siteId);
  if (!site || !site.revisions) return false;

  const targetRevision = site.revisions.find((r) => r.id === revisionId);
  if (!targetRevision) return false;

  saveWebsite({
    ...site,
    elements: JSON.parse(JSON.stringify(targetRevision.elementsSnapshot)),
    pages: JSON.parse(JSON.stringify(targetRevision.pagesSnapshot)),
    updatedAt: Date.now(),
  });

  return true;
}

export function addWebsiteSubmission(siteId: string, submission: Omit<FormSubmission, "id" | "submittedAt" | "status">): void {
  const site = getWebsite(siteId);
  if (!site) return;

  const newSubmission: FormSubmission = {
    ...submission,
    id: `sub-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    submittedAt: Date.now(),
    status: "new",
  };

  const updatedSubmissions = [newSubmission, ...(site.submissions || [])];
  saveWebsite({
    ...site,
    submissions: updatedSubmissions,
  });
}

export function resetToDefaults(): WebsiteSite[] {
  if (!isClient()) return Object.values(TEMPLATES);
  const defaults = Object.values(TEMPLATES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    cachedRaw = null;
    notifyListeners();
  } catch (err) {
    console.error("Failed to reset defaults:", err);
  }
  return defaults;
}

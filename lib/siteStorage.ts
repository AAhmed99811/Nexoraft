import { WebsiteSite } from "../components/types";
import { TEMPLATES } from "./templates";

const STORAGE_KEY = "webcraft_websites_v1";

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
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed initial templates
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

  // Fallback to template if id matches a template id
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
    createdAt: Date.now(),
    updatedAt: Date.now(),
    // Deep clone elements to prevent cross-mutations
    elements: JSON.parse(JSON.stringify(baseTemplate.elements)),
    pages: JSON.parse(JSON.stringify(baseTemplate.pages)),
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
    createdAt: Date.now(),
    updatedAt: Date.now(),
    elements: JSON.parse(JSON.stringify(source.elements)),
    pages: JSON.parse(JSON.stringify(source.pages)),
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

"use client";

import React, { Suspense, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import {
  FormBuilderProvider,
  useFormBuilderState,
} from "../../components/context/FormBuilderContext";
import { ReactFormBuilder } from "../../components/ReactFormBuilder";
import { getWebsite, saveWebsite } from "../../lib/siteStorage";
import { WebsiteSite } from "../../components/types";
import { TEMPLATES } from "../../lib/templates";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const emptySubscribe = () => () => {};

function BuilderContent() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get("siteId") || "site-saas-launch";
  const pageIdParam = searchParams.get("pageId");
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const site = useMemo(() => {
    return getWebsite(siteId) || TEMPLATES["saas-landing"];
  }, [siteId]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Website Not Found
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            The website you are looking for does not exist.
          </p>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const initialActivePage =
    pageIdParam && site.pages && site.pages[pageIdParam]
      ? pageIdParam
      : site.activePage || Object.keys(site.pages || {})[0] || "page-home";

  return (
    <FormBuilderProvider
      initialWebsiteId={site.id}
      initialWebsiteName={site.name}
      initialWebsiteDescription={site.description}
      initialElements={site.elements}
      initialPages={site.pages}
      initialActivePage={initialActivePage}
      initialThemeCode={site.theme?.primaryColor || "#3b82f6"}
      initialSecondaryColor={site.theme?.secondaryColor || "#6366f1"}
      initialAccentColor={site.theme?.accentColor || "#10b981"}
      initialFontFamily={site.theme?.fontFamily || "Inter, sans-serif"}
      initialHeadingFont={site.theme?.headingFont || "Inter, sans-serif"}
      initialBorderRadius={site.theme?.borderRadius || "lg"}
      initialPosts={site.posts || []}
      initialMedia={site.media || []}
      initialSubmissions={site.submissions || []}
      initialRevisions={site.revisions || []}
    >
      <AutoSaveListener siteId={site.id} category={site.category} status={site.status} />
      <div className="h-full w-full max-w-[1850px] mx-auto p-2 sm:p-3 flex flex-col overflow-hidden">
        <ReactFormBuilder deviceType="desktop" className="h-full flex-1 min-h-0" />
      </div>
    </FormBuilderProvider>
  );
}

// Subcomponent to listen to element state changes and auto-persist to siteStorage
function AutoSaveListener({
  siteId,
  category,
  status = "draft",
}: {
  siteId: string;
  category?: string;
  status?: "draft" | "published" | "archived";
}) {
  const {
    websiteName,
    websiteDescription,
    elements,
    pages,
    activePage,
    themeCode,
    secondaryColor,
    accentColor,
    fontFamily,
    headingFont,
    borderRadius,
    posts,
    media,
    submissions,
    revisions,
    setSaveStatus,
  } = useFormBuilderState();

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus("saving");
    const timeout = setTimeout(() => {
      const updatedWebsite: WebsiteSite = {
        id: siteId,
        name: websiteName,
        slug: websiteName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: websiteDescription,
        category:
          (category as
            | "saas"
            | "portfolio"
            | "agency"
            | "ecommerce"
            | "blog"
            | "blank") || "saas",
        status: status || "draft",
        createdAt: Date.now(),
        updatedAt: Date.now(),
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

      saveWebsite(updatedWebsite);
      setSaveStatus("saved");
    }, 600);

    return () => clearTimeout(timeout);
  }, [
    websiteName,
    websiteDescription,
    elements,
    pages,
    activePage,
    themeCode,
    secondaryColor,
    accentColor,
    fontFamily,
    headingFont,
    borderRadius,
    posts,
    media,
    submissions,
    revisions,
    siteId,
    category,
    status,
    setSaveStatus,
  ]);

  return null;
}

export default function BuilderPage() {
  return (
    <main className="h-screen max-h-screen w-screen overflow-hidden flex flex-col bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        }
      >
        <BuilderContent />
      </Suspense>
    </main>
  );
}

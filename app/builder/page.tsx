"use client";

import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { FormBuilderProvider, useFormBuilderState } from "../../components/context/FormBuilderContext";
import { ReactFormBuilder } from "../../components/ReactFormBuilder";
import { getWebsite, saveWebsite } from "../../lib/siteStorage";
import { WebsiteSite } from "../../components/types";
import { TEMPLATES } from "../../lib/templates";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

function BuilderContent() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get("siteId") || "site-saas-launch";

  const site = useMemo(() => {
    return getWebsite(siteId) || TEMPLATES["saas-landing"];
  }, [siteId]);

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Website Not Found</h2>
          <p className="text-xs text-slate-500 mb-4">The website you are looking for does not exist.</p>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Websites List</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <FormBuilderProvider
      initialWebsiteId={site.id}
      initialWebsiteName={site.name}
      initialWebsiteDescription={site.description}
      initialElements={site.elements}
      initialPages={site.pages}
      initialActivePage={site.activePage}
      initialThemeCode={site.theme?.primaryColor || "#3b82f6"}
      initialFontFamily={site.theme?.fontFamily || "Inter, sans-serif"}
    >
      <AutoSaveListener siteId={site.id} category={site.category} />
      <div className="p-3 sm:p-5 max-w-[1600px] mx-auto">
        <ReactFormBuilder deviceType="desktop" />
      </div>
    </FormBuilderProvider>
  );
}

// Subcomponent to listen to element state changes and auto-persist to siteStorage
function AutoSaveListener({ siteId, category }: { siteId: string; category?: string }) {
  const { websiteName, websiteDescription, elements, pages, activePage, themeCode, fontFamily } =
    useFormBuilderState();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const updatedWebsite: WebsiteSite = {
      id: siteId,
      name: websiteName,
      slug: websiteName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: websiteDescription,
      category: (category as "saas" | "portfolio" | "agency" | "ecommerce" | "blog" | "blank") || "saas",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      theme: {
        primaryColor: themeCode,
        fontFamily,
        mode: "light",
      },
      pages,
      activePage,
      elements,
    };

    saveWebsite(updatedWebsite);
  }, [websiteName, websiteDescription, elements, pages, activePage, themeCode, fontFamily, siteId, category]);

  return null;
}

export default function BuilderPage() {
  return (
    <main className="min-h-screen bg-slate-100/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        }
      >
        <BuilderContent />
      </Suspense>
    </main>
  );
}

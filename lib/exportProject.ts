import JSZip from "jszip";
import { WebsiteSite, ElementObjectMap } from "../components/types";

type ItemRecord = Record<string, unknown>;

// Generates clean semantic JSX string for any element node and its children
export function generateElementJsx(
  elementId: string,
  elements: ElementObjectMap,
  indent = 2
): string {
  const node = elements[elementId];
  if (!node || node.visible === false) return "";

  const pad = " ".repeat(indent);
  const type = node.elementType || "Container";

  switch (type) {
    case "NavbarSection": {
      const title = node.title || "Brand";
      const subtitle = node.subtitle ? `<span className="text-xs text-slate-400 font-normal"> | ${escapeJsx(node.subtitle)}</span>` : "";
      const buttonText = node.buttonText || "Get Started";
      const items = Array.isArray(node.items) ? (node.items as ItemRecord[]) : [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "About", href: "#about" },
      ];

      return `${pad}<header className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
${pad}    <div className="flex items-center gap-2">
${pad}      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
${pad}        ${escapeJsx(title)}
${pad}      </span>
${pad}      ${subtitle}
${pad}    </div>
${pad}    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
${items.map((it) => `${pad}      <a href="${String(it.href || '#')}" className="hover:text-blue-600 transition-colors">${escapeJsx(String(it.label || 'Link'))}</a>`).join("\n")}
${pad}    </nav>
${pad}    <a href="#contact" className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-all">
${pad}      ${escapeJsx(buttonText)}
${pad}    </a>
${pad}  </div>
${pad}</header>`;
    }

    case "HeroSection": {
      const badge = node.badge || "✨ NEXT-GEN EXPERIENCE";
      const title = node.title || "Build Stunning Websites in Minutes";
      const subtitle = node.subtitle || "The modern platform engineered for speed, flexibility, and instant production export.";
      const btnPrimary = node.buttonText || "Get Started Free";
      const btnSecondary = node.buttonSecondaryText || "Learn More";

      return `${pad}<section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-b from-blue-50/50 via-white to-white">
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
${pad}    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-6">
${pad}      ${escapeJsx(badge)}
${pad}    </div>
${pad}    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
${pad}      ${escapeJsx(title)}
${pad}    </h1>
${pad}    <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
${pad}      ${escapeJsx(subtitle)}
${pad}    </p>
${pad}    <div className="mt-10 flex flex-wrap justify-center gap-4">
${pad}      <a href="#cta" className="px-8 py-3.5 rounded-xl font-semibold bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all">
${pad}        ${escapeJsx(btnPrimary)}
${pad}      </a>
${pad}      <a href="#features" className="px-8 py-3.5 rounded-xl font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all">
${pad}        ${escapeJsx(btnSecondary)}
${pad}      </a>
${pad}    </div>
${pad}  </div>
${pad}</section>`;
    }

    case "FeatureGridSection": {
      const title = node.title || "Engineered for Velocity";
      const subtitle = node.subtitle || "Built with modern primitives for performance and ease of use.";
      const items = Array.isArray(node.items) ? (node.items as ItemRecord[]) : [
        { title: "Visual Editing", description: "Design layouts directly in your browser with responsive controls." },
        { title: "Direct Code Export", description: "Clean Next.js & React source code you own completely." },
        { title: "Blazing Speed", description: "Optimized for fast rendering and core web vitals." },
      ];

      return `${pad}<section id="features" className="py-20 bg-white">
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${pad}    <div className="text-center max-w-3xl mx-auto mb-16">
${pad}      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
${pad}        ${escapeJsx(title)}
${pad}      </h2>
${pad}      <p className="mt-4 text-base text-slate-600">
${pad}        ${escapeJsx(subtitle)}
${pad}      </p>
${pad}    </div>
${pad}    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
${items.map((it) => `${pad}      <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-slate-200 transition-all">
${pad}        <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-lg mb-6">
${pad}          ★
${pad}        </div>
${pad}        <h3 className="text-xl font-semibold text-slate-900 mb-2">${escapeJsx(String(it.title || 'Feature'))}</h3>
${pad}        <p className="text-sm text-slate-600 leading-relaxed">${escapeJsx(String(it.description || ''))}</p>
${pad}      </div>`).join("\n")}
${pad}    </div>
${pad}  </div>
${pad}</section>`;
    }

    case "PricingSection": {
      const title = node.title || "Simple, Transparent Pricing";
      const subtitle = node.subtitle || "Choose the ideal plan for your projects.";
      const items = Array.isArray(node.items) ? (node.items as ItemRecord[]) : [
        { title: "Starter", price: "$0", period: "/month", description: "For testing & hobby projects", features: ["1 Project", "Basic Export"], buttonText: "Get Started" },
        { title: "Pro", price: "$29", period: "/month", description: "For fast-moving creators", features: ["Unlimited Sites", "Next.js & Vite Export", "Priority Support"], buttonText: "Upgrade to Pro", highlighted: true },
        { title: "Enterprise", price: "$99", period: "/month", description: "For teams & agencies", features: ["Custom Domains", "Team Collab", "Dedicated SLA"], buttonText: "Contact Us" },
      ];

      return `${pad}<section id="pricing" className="py-20 bg-slate-50">
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${pad}    <div className="text-center max-w-3xl mx-auto mb-16">
${pad}      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
${pad}        ${escapeJsx(title)}
${pad}      </h2>
${pad}      <p className="mt-4 text-base text-slate-600">
${pad}        ${escapeJsx(subtitle)}
${pad}      </p>
${pad}    </div>
${pad}    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
${items.map((it) => {
  const isHigh = Boolean(it.highlighted);
  const featureList = Array.isArray(it.features) ? (it.features as string[]) : ['Feature 1', 'Feature 2'];
  return `${pad}      <div className="rounded-2xl p-8 flex flex-col justify-between ${isHigh ? 'bg-white border-2 border-blue-600 shadow-xl relative' : 'bg-white border border-slate-200'}">
${isHigh ? `${pad}        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white uppercase tracking-wider">Most Popular</span>\n` : ''}${pad}        <div>
${pad}          <h3 className="text-lg font-bold text-slate-900">${escapeJsx(String(it.title || 'Plan'))}</h3>
${pad}          <p className="text-xs text-slate-500 mt-1">${escapeJsx(String(it.description || ''))}</p>
${pad}          <div className="mt-4 flex items-baseline gap-1">
${pad}            <span className="text-4xl font-extrabold text-slate-900">${escapeJsx(String(it.price || '$0'))}</span>
${pad}            <span className="text-sm text-slate-500">${escapeJsx(String(it.period || '/mo'))}</span>
${pad}          </div>
${pad}          <ul className="mt-6 space-y-2.5 text-sm text-slate-600">
${featureList.map((f: string) => `${pad}            <li className="flex items-center gap-2">✓ ${escapeJsx(f)}</li>`).join('\n')}
${pad}          </ul>
${pad}        </div>
${pad}        <button className="mt-8 w-full py-2.5 rounded-xl font-semibold text-sm ${isHigh ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'} transition-all">
${pad}          ${escapeJsx(String(it.buttonText || 'Choose Plan'))}
${pad}        </button>
${pad}      </div>`;
}).join("\n")}
${pad}    </div>
${pad}  </div>
${pad}</section>`;
    }

    case "CallToActionSection": {
      const title = node.title || "Ready to launch your next website?";
      const subtitle = node.subtitle || "Join thousands of developers and creators building with modern visual tools.";
      const buttonText = node.buttonText || "Get Started Free";

      return `${pad}<section id="cta" className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
${pad}    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
${pad}      ${escapeJsx(title)}
${pad}    </h2>
${pad}    <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-base sm:text-lg">
${pad}      ${escapeJsx(subtitle)}
${pad}    </p>
${pad}    <button className="px-8 py-3.5 rounded-xl font-semibold bg-white text-blue-600 shadow-lg hover:bg-blue-50 transition-all">
${pad}      ${escapeJsx(buttonText)}
${pad}    </button>
${pad}  </div>
${pad}</section>`;
    }

    case "ContactSection": {
      const title = node.title || "Get in Touch";
      const subtitle = node.subtitle || "Send us a message and our team will get back to you shortly.";

      return `${pad}<section id="contact" className="py-20 bg-white">
${pad}  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
${pad}    <div className="text-center mb-12">
${pad}      <h2 className="text-3xl font-bold text-slate-900">${escapeJsx(title)}</h2>
${pad}      <p className="mt-2 text-sm text-slate-600">${escapeJsx(subtitle)}</p>
${pad}    </div>
${pad}    <form onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }} className="space-y-4 bg-slate-50 p-8 rounded-2xl border border-slate-200">
${pad}      <div>
${pad}        <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
${pad}        <input type="text" required placeholder="Alice Smith" className="w-full px-3.5 py-2.5 text-sm bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
${pad}      </div>
${pad}      <div>
${pad}        <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
${pad}        <input type="email" required placeholder="alice@example.com" className="w-full px-3.5 py-2.5 text-sm bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
${pad}      </div>
${pad}      <div>
${pad}        <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
${pad}        <textarea rows={4} required placeholder="Tell us about your project..." className="w-full px-3.5 py-2.5 text-sm bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
${pad}      </div>
${pad}      <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm">
${pad}        Send Message
${pad}      </button>
${pad}    </form>
${pad}  </div>
${pad}</section>`;
    }

    case "FooterSection": {
      const title = node.title || "Brand Studio";
      const content = node.content || "Empowering creators to design and deploy modern web experiences effortlessly.";

      return `${pad}<footer className="py-12 bg-slate-900 text-slate-400">
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
${pad}    <div>
${pad}      <span className="text-lg font-bold text-white">${escapeJsx(title)}</span>
${pad}      <p className="text-xs text-slate-400 mt-1 max-w-sm">${escapeJsx(content)}</p>
${pad}    </div>
${pad}    <div className="flex gap-6 text-xs">
${pad}      <a href="#features" className="hover:text-white transition-colors">Features</a>
${pad}      <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
${pad}      <a href="#contact" className="hover:text-white transition-colors">Contact</a>
${pad}      <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
${pad}    </div>
${pad}  </div>
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
${pad}    © {new Date().getFullYear()} ${escapeJsx(title)}. All rights reserved.
${pad}  </div>
${pad}</footer>`;
    }

    case "Heading": {
      const title = node.title || "Section Heading";
      const subtitle = node.subtitle;
      return `${pad}<div className="my-4">
${pad}  <h2 className="text-2xl font-bold tracking-tight text-slate-900">${escapeJsx(title)}</h2>
${subtitle ? `${pad}  <p className="text-sm text-slate-500 mt-1">${escapeJsx(subtitle)}</p>\n` : ""}${pad}</div>`;
    }

    case "Text": {
      const content = node.content || "Sample text content goes here.";
      return `${pad}<p className="text-sm text-slate-600 leading-relaxed my-2">${escapeJsx(content)}</p>`;
    }

    case "Button": {
      const text = node.buttonText || "Click Me";
      const variant = node.variant || "primary";
      const styleClass = variant === "secondary"
        ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
        : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm";
      return `${pad}<button className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${styleClass}">
${pad}  ${escapeJsx(text)}
${pad}</button>`;
    }

    case "TextInput":
    case "Input": {
      const label = node.label || "Field Label";
      const placeholder = node.placeholder || "Enter value...";
      const required = Boolean(node.required);
      return `${pad}<div className="flex flex-col gap-1.5 my-2">
${pad}  <label className="text-xs font-semibold text-slate-700">${escapeJsx(label)}${required ? ' *' : ''}</label>
${pad}  <input type="text" placeholder="${escapeJsx(placeholder)}" className="px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
${pad}</div>`;
    }

    case "TextArea": {
      const label = node.label || "Field Label";
      const placeholder = node.placeholder || "Enter details...";
      const rows = node.rows || 3;
      return `${pad}<div className="flex flex-col gap-1.5 my-2">
${pad}  <label className="text-xs font-semibold text-slate-700">${escapeJsx(label)}</label>
${pad}  <textarea rows={${rows}} placeholder="${escapeJsx(placeholder)}" className="px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
${pad}</div>`;
    }

    case "Container":
    default: {
      const childrenIds = node.children || [];
      const childrenJsx = childrenIds
        .map((childId) => generateElementJsx(childId, elements, indent + 2))
        .filter(Boolean)
        .join("\n");

      return `${pad}<div className="${node.isRoot ? 'w-full min-h-screen bg-white text-slate-900 flex flex-col' : 'p-4 rounded-xl border border-slate-100'}">
${childrenJsx}
${pad}</div>`;
    }
  }
}

function escapeJsx(text?: string): string {
  if (!text) return "";
  return text.replace(/[{}]/g, "");
}

// Generate complete Next.js Project File Tree
export function generateNextJsProjectFiles(website: WebsiteSite): Record<string, string> {
  const activePageConfig = website.pages[website.activePage] || Object.values(website.pages)[0];
  const rootId = activePageConfig?.rootElementId || "root";
  const bodyJsx = generateElementJsx(rootId, website.elements, 4);

  const packageJson = JSON.stringify(
    {
      name: website.slug || "my-website",
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
      },
      dependencies: {
        next: "15.1.0",
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        "lucide-react": "^0.475.0",
      },
      devDependencies: {
        "@types/node": "^20",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        typescript: "^5",
        tailwindcss: "^4",
        "@tailwindcss/postcss": "^4",
        postcss: "^8",
      },
    },
    null,
    2
  );

  const layoutTsx = `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "${website.name}",
  description: "${website.description}",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
`;

  const pageTsx = `"use client";

import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
${bodyJsx}
    </main>
  );
}
`;

  const globalsCss = `@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #0f172a;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: ${website.theme?.fontFamily || "Inter, sans-serif"};
}
`;

  const readmeMd = `# ${website.name}

Exported from **WebCraft Website Builder**.

## 🚀 Getting Started

First, install dependencies:

\`\`\`bash
npm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see your website!

## 🚢 Deploying

### Deploy on Vercel (Recommended)
1. Push this repository to GitHub / GitLab.
2. Go to [Vercel](https://vercel.com/new).
3. Import your repository and click **Deploy**. Next.js is automatically configured!

### Deploy on Netlify
\`\`\`bash
npm run build
npx netlify deploy --prod
\`\`\`
`;

  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
`;

  const tsconfig = JSON.stringify(
    {
      compilerOptions: {
        target: "ES2017",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./*"] },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"],
    },
    null,
    2
  );

  return {
    "package.json": packageJson,
    "app/layout.tsx": layoutTsx,
    "app/page.tsx": pageTsx,
    "app/globals.css": globalsCss,
    "next.config.mjs": nextConfig,
    "tsconfig.json": tsconfig,
    "README.md": readmeMd,
  };
}

// Generate complete React + Vite Project File Tree
export function generateReactViteProjectFiles(website: WebsiteSite): Record<string, string> {
  const activePageConfig = website.pages[website.activePage] || Object.values(website.pages)[0];
  const rootId = activePageConfig?.rootElementId || "root";
  const bodyJsx = generateElementJsx(rootId, website.elements, 4);

  const packageJson = JSON.stringify(
    {
      name: website.slug || "my-website",
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc -b && vite build",
        preview: "vite preview",
      },
      dependencies: {
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        "lucide-react": "^0.475.0",
      },
      devDependencies: {
        "@vitejs/plugin-react": "^4.3.4",
        "@tailwindcss/vite": "^4",
        tailwindcss: "^4",
        typescript: "^5.7.2",
        vite: "^6.1.0",
      },
    },
    null,
    2
  );

  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${website.name}</title>
    <meta name="description" content="${website.description}" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

  const appTsx = `import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
${bodyJsx}
    </div>
  );
}
`;

  const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;

  const indexCss = `@import "tailwindcss";

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}
`;

  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`;

  const readmeMd = `# ${website.name} (React + Vite)

Exported from **WebCraft Website Builder**.

## 🚀 Quickstart

\`\`\`bash
npm install
npm run dev
\`\`\`

## 🚢 Build & Deploy
\`\`\`bash
npm run build
\`\`\`
The output in \`dist/\` can be deployed to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages).
`;

  return {
    "package.json": packageJson,
    "index.html": indexHtml,
    "src/App.tsx": appTsx,
    "src/main.tsx": mainTsx,
    "src/index.css": indexCss,
    "vite.config.ts": viteConfig,
    "README.md": readmeMd,
  };
}

// Download project bundle as a .ZIP file directly in the browser
export async function downloadProjectZip(
  website: WebsiteSite,
  format: "nextjs" | "react" = "nextjs"
): Promise<void> {
  const zip = new JSZip();
  const files =
    format === "nextjs"
      ? generateNextJsProjectFiles(website)
      : generateReactViteProjectFiles(website);

  Object.entries(files).forEach(([filepath, content]) => {
    zip.file(filepath, content);
  });

  const blob = await zip.generateAsync({ type: "blob" });
  const filename = `${website.slug || "website"}-${format}-project.zip`;

  // Trigger browser download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

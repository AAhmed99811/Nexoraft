import JSZip from "jszip";
import { WebsiteSite, ElementObjectMap } from "../components/types";

type ItemRecord = Record<string, unknown>;

function escapeJsx(text?: string): string {
  if (!text) return "";
  return text.replace(/[{}]/g, "");
}

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
      const title = node.title || "Nexoraft";
      const subtitle = node.subtitle
        ? `<span className="text-xs text-slate-400 font-normal"> | ${escapeJsx(String(node.subtitle))}</span>`
        : "";
      const buttonText = node.buttonText || "Get Started";
      const items = Array.isArray(node.items)
        ? (node.items as ItemRecord[])
        : [
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
          ];

      return `${pad}<header className="w-full bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
${pad}    <div className="flex items-center gap-2.5">
${pad}      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
${pad}        ${escapeJsx(String(title)).charAt(0)}
${pad}      </div>
${pad}      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
${pad}        ${escapeJsx(String(title))}
${pad}      </span>
${pad}      ${subtitle}
${pad}    </div>
${pad}    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
${items
  .map(
    (it) =>
      `${pad}      <a href="${String(it.href || "#")}" className="hover:text-blue-600 transition-colors">${escapeJsx(
        String(it.label || "Link")
      )}</a>`
  )
  .join("\n")}
${pad}    </nav>
${pad}    <a href="#contact" className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-all">
${pad}      ${escapeJsx(String(buttonText))}
${pad}    </a>
${pad}  </div>
${pad}</header>`;
    }

    case "HeroSection": {
      const badge = node.badge || "✨ NEXT-GEN EXPERIENCE";
      const title = node.title || "Build Stunning Websites in Minutes";
      const subtitle =
        node.subtitle ||
        "The modern platform engineered for speed, flexibility, and instant production export.";
      const btnPrimary = node.buttonText || "Get Started Free";
      const btnSecondary = node.buttonSecondaryText || "Learn More";

      return `${pad}<section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-b from-blue-50/50 via-white to-white">
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
${pad}    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-6">
${pad}      ${escapeJsx(String(badge))}
${pad}    </div>
${pad}    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
${pad}      ${escapeJsx(String(title))}
${pad}    </h1>
${pad}    <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
${pad}      ${escapeJsx(String(subtitle))}
${pad}    </p>
${pad}    <div className="mt-10 flex flex-wrap justify-center gap-4">
${pad}      <a href="#contact" className="px-8 py-3.5 rounded-xl font-semibold bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all">
${pad}        ${escapeJsx(String(btnPrimary))}
${pad}      </a>
${pad}      <a href="#features" className="px-8 py-3.5 rounded-xl font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all">
${pad}        ${escapeJsx(String(btnSecondary))}
${pad}      </a>
${pad}    </div>
${pad}  </div>
${pad}</section>`;
    }

    case "FeatureGridSection": {
      const title = node.title || "Engineered for Velocity";
      const subtitle =
        node.subtitle || "Built with modern primitives for performance and ease of use.";
      const items = Array.isArray(node.items)
        ? (node.items as ItemRecord[])
        : [
            {
              title: "Visual Editing",
              description:
                "Design layouts directly in your browser with responsive controls.",
            },
            {
              title: "Direct Code Export",
              description: "Clean Next.js & React source code you own completely.",
            },
            {
              title: "Blazing Speed",
              description: "Optimized for fast rendering and core web vitals.",
            },
          ];

      return `${pad}<section id="features" className="py-20 bg-white">
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${pad}    <div className="text-center max-w-3xl mx-auto mb-16">
${pad}      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
${pad}        ${escapeJsx(String(title))}
${pad}      </h2>
${pad}      <p className="mt-4 text-base text-slate-600">
${pad}        ${escapeJsx(String(subtitle))}
${pad}      </p>
${pad}    </div>
${pad}    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
${items
  .map(
    (it) => `${pad}      <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-slate-200 transition-all">
${pad}        <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-lg mb-6">
${pad}          ★
${pad}        </div>
${pad}        <h3 className="text-xl font-semibold text-slate-900 mb-2">${escapeJsx(
      String(it.title || "Feature")
    )}</h3>
${pad}        <p className="text-sm text-slate-600 leading-relaxed">${escapeJsx(
      String(it.description || "")
    )}</p>
${pad}      </div>`
  )
  .join("\n")}
${pad}    </div>
${pad}  </div>
${pad}</section>`;
    }

    case "StatsSection": {
      const items = Array.isArray(node.items)
        ? (node.items as ItemRecord[])
        : [
            { value: "99.9%", label: "Uptime Guaranteed", change: "+0.4%" },
            { value: "10k+", label: "Websites Shipped", change: "+140%" },
            { value: "<100ms", label: "Server Response", change: "Fast" },
            { value: "0", label: "Runtime Lock-In", change: "100% Free" },
          ];

      return `${pad}<section className="py-12 bg-slate-900 text-white">
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
${items
  .map(
    (stat) => `${pad}    <div className="p-4 flex flex-col items-center">
${pad}      <span className="text-3xl sm:text-4xl font-black text-blue-400">${escapeJsx(
      String(stat.value || "100")
    )}</span>
${pad}      <span className="text-xs sm:text-sm text-slate-300 mt-1">${escapeJsx(
      String(stat.label || "Metric")
    )}</span>
${pad}    </div>`
  )
  .join("\n")}
${pad}  </div>
${pad}</section>`;
    }

    case "TestimonialsSection": {
      const title = node.title || "Loved by Founders & Engineers";
      const subtitle =
        node.subtitle || "See how modern teams build and ship websites in record time.";

      return `${pad}<section className="py-20 bg-slate-50">
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${pad}    <div className="text-center max-w-3xl mx-auto mb-16">
${pad}      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">${escapeJsx(
        String(title)
      )}</h2>
${pad}      <p className="mt-4 text-base text-slate-600">${escapeJsx(String(subtitle))}</p>
${pad}    </div>
${pad}    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
${pad}      <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm">
${pad}        <p className="text-sm text-slate-700 italic">"The 1-click export is brilliant. Clean, typed, and installs in seconds."</p>
${pad}        <div className="mt-6 flex items-center gap-3">
${pad}          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">M</div>
${pad}          <div><h4 className="text-sm font-bold text-slate-900">Marcus Miller</h4><p className="text-xs text-slate-500">Lead Architect</p></div>
${pad}        </div>
${pad}      </div>
${pad}      <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm">
${pad}        <p className="text-sm text-slate-700 italic">"Gives our design team visual velocity and our developers real code."</p>
${pad}        <div className="mt-6 flex items-center gap-3">
${pad}          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">S</div>
${pad}          <div><h4 className="text-sm font-bold text-slate-900">Sarah Chen</h4><p className="text-xs text-slate-500">VP Product</p></div>
${pad}        </div>
${pad}      </div>
${pad}      <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm">
${pad}        <p className="text-sm text-slate-700 italic">"From idea to fully deployed client website in less than an afternoon."</p>
${pad}        <div className="mt-6 flex items-center gap-3">
${pad}          <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">E</div>
${pad}          <div><h4 className="text-sm font-bold text-slate-900">Elena Rostova</h4><p className="text-xs text-slate-500">Agency Director</p></div>
${pad}        </div>
${pad}      </div>
${pad}    </div>
${pad}  </div>
${pad}</section>`;
    }

    case "PricingSection": {
      const title = node.title || "Simple, Transparent Pricing";
      const subtitle = node.subtitle || "Choose the ideal plan for your projects.";
      const items = Array.isArray(node.items)
        ? (node.items as ItemRecord[])
        : [
            {
              title: "Starter",
              price: "$0",
              period: "/month",
              description: "For testing & hobby projects",
              features: ["1 Project", "Basic Export"],
              buttonText: "Get Started",
            },
            {
              title: "Pro",
              price: "$29",
              period: "/month",
              description: "For fast-moving creators",
              features: [
                "Unlimited Sites",
                "Next.js & Vite Export",
                "Priority Support",
              ],
              buttonText: "Upgrade to Pro",
              highlighted: true,
            },
            {
              title: "Enterprise",
              price: "$99",
              period: "/month",
              description: "For teams & agencies",
              features: [
                "Custom Domains",
                "Team Collab",
                "Dedicated SLA",
              ],
              buttonText: "Contact Us",
            },
          ];

      return `${pad}<section id="pricing" className="py-20 bg-slate-50">
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${pad}    <div className="text-center max-w-3xl mx-auto mb-16">
${pad}      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
${pad}        ${escapeJsx(String(title))}
${pad}      </h2>
${pad}      <p className="mt-4 text-base text-slate-600">
${pad}        ${escapeJsx(String(subtitle))}
${pad}      </p>
${pad}    </div>
${pad}    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
${items
  .map((plan) => {
    const isHigh = Boolean(plan.highlighted);
    return `${pad}      <div className="p-8 rounded-2xl bg-white border ${
      isHigh ? "border-blue-600 shadow-xl relative" : "border-slate-200 shadow-sm"
    } flex flex-col justify-between">
${pad}        <div>
${pad}          <h3 className="text-xl font-bold text-slate-900">${escapeJsx(
      String(plan.title || "Plan")
    )}</h3>
${pad}          <p className="text-sm text-slate-500 mt-1">${escapeJsx(
      String(plan.description || "")
    )}</p>
${pad}          <div className="mt-6 flex items-baseline gap-1">
${pad}            <span className="text-4xl font-extrabold text-slate-900">${escapeJsx(
      String(plan.price || "$0")
    )}</span>
${pad}            <span className="text-xs text-slate-500 font-medium">${escapeJsx(
      String(plan.period || "/month")
    )}</span>
${pad}          </div>
${pad}        </div>
${pad}        <a href="#contact" className="mt-8 w-full py-3 rounded-xl text-center text-sm font-semibold transition-all ${
      isHigh
        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25"
        : "bg-slate-100 hover:bg-slate-200 text-slate-800"
    }">
${pad}          ${escapeJsx(String(plan.buttonText || "Choose Plan"))}
${pad}        </a>
${pad}      </div>`;
  })
  .join("\n")}
${pad}    </div>
${pad}  </div>
${pad}</section>`;
    }

    case "FAQSection": {
      const title = node.title || "Frequently Asked Questions";
      const subtitle =
        node.subtitle || "Have questions about exporting, code ownership, or hosting?";

      return `${pad}<section id="faq" className="py-20 bg-white">
${pad}  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
${pad}    <div className="text-center mb-16">
${pad}      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">${escapeJsx(
        String(title)
      )}</h2>
${pad}      <p className="mt-4 text-base text-slate-600">${escapeJsx(String(subtitle))}</p>
${pad}    </div>
${pad}    <div className="space-y-4">
${pad}      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
${pad}        <h3 className="text-base font-semibold text-slate-900">Is the code 100% independent?</h3>
${pad}        <p className="mt-2 text-sm text-slate-600">Yes! This project builds and runs without any connection to the builder platform.</p>
${pad}      </div>
${pad}      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
${pad}        <h3 className="text-base font-semibold text-slate-900">Where can I deploy this project?</h3>
${pad}        <p className="mt-2 text-sm text-slate-600">Any standard hosting provider: Vercel, Netlify, Cloudflare Pages, AWS, or Docker.</p>
${pad}      </div>
${pad}    </div>
${pad}  </div>
${pad}</section>`;
    }

    case "LogoStripSection": {
      const title = node.title || "TRUSTED BY ENGINEERING TEAMS WORLDWIDE";

      return `${pad}<section className="py-12 bg-slate-50 border-y border-slate-200 text-center">
${pad}  <div className="max-w-6xl mx-auto px-4">
${pad}    <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-6">${escapeJsx(
        String(title)
      )}</p>
${pad}    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 font-extrabold text-slate-600 text-sm opacity-70">
${pad}      <span>ACME CORP</span>
${pad}      <span>GLOBALTECH</span>
${pad}      <span>VANGUARD</span>
${pad}      <span>STARLIGHT</span>
${pad}      <span>NOVASOFT</span>
${pad}    </div>
${pad}  </div>
${pad}</section>`;
    }

    case "CallToActionSection": {
      const title = node.title || "Ready to get started?";
      const subtitle =
        node.subtitle || "Join thousands of builders shipping modern websites today.";
      const buttonText = node.buttonText || "Launch Your Site";

      return `${pad}<section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
${pad}  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
${pad}    <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">${escapeJsx(
        String(title)
      )}</h2>
${pad}    <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-xl mx-auto">${escapeJsx(
        String(subtitle)
      )}</p>
${pad}    <a href="#contact" className="mt-8 inline-block px-8 py-3.5 rounded-xl font-bold text-sm bg-white text-blue-600 shadow-xl hover:bg-blue-50 transition-all">
${pad}      ${escapeJsx(String(buttonText))}
${pad}    </a>
${pad}  </div>
${pad}</section>`;
    }

    case "ContactSection": {
      const title = node.title || "Contact Our Team";
      const subtitle =
        node.subtitle || "Send us a message and our team will get back to you shortly.";

      return `${pad}<section id="contact" className="py-20 bg-white">
${pad}  <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
${pad}    <div className="text-center mb-12">
${pad}      <h2 className="text-3xl font-bold tracking-tight text-slate-900">${escapeJsx(
        String(title)
      )}</h2>
${pad}      <p className="mt-3 text-sm text-slate-600">${escapeJsx(String(subtitle))}</p>
${pad}    </div>
${pad}    <form action="/api/contact" method="POST" className="p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
${pad}      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
${pad}        <div>
${pad}          <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
${pad}          <input type="text" name="name" required placeholder="Alex Johnson" className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
${pad}        </div>
${pad}        <div>
${pad}          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
${pad}          <input type="email" name="email" required placeholder="alex@company.com" className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
${pad}        </div>
${pad}      </div>
${pad}      <div>
${pad}        <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
${pad}        <textarea name="message" rows={3} placeholder="Tell us how we can help..." className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
${pad}      </div>
${pad}      <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all">
${pad}        Send Inquiry
${pad}      </button>
${pad}    </form>
${pad}  </div>
${pad}</section>`;
    }

    case "FooterSection": {
      const title = node.title || "Nexoraft Studio";
      const content =
        node.content ||
        "The visual website builder for modern creators and engineering teams. Export to Next.js in seconds.";

      return `${pad}<footer className="py-12 bg-slate-900 text-slate-400">
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
${pad}    <div>
${pad}      <span className="text-lg font-bold text-white">${escapeJsx(String(title))}</span>
${pad}      <p className="text-xs text-slate-400 mt-1 max-w-sm">${escapeJsx(String(content))}</p>
${pad}    </div>
${pad}    <div className="flex gap-6 text-xs">
${pad}      <a href="#features" className="hover:text-white transition-colors">Features</a>
${pad}      <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
${pad}      <a href="#contact" className="hover:text-white transition-colors">Contact</a>
${pad}      <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
${pad}    </div>
${pad}  </div>
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
${pad}    © {new Date().getFullYear()} ${escapeJsx(String(title))}. All rights reserved. Built with Nexoraft.
${pad}  </div>
${pad}</footer>`;
    }

    case "BentoGridSection":
    case "BentoGrid": {
      const badge = node.badge || "✨ NEXORAFT PRO BENTO ENGINE";
      const title = node.title || "Precision-Engineered for Speed, Scale & Visual Craft";
      const subtitle = node.subtitle || "Every module is designed to maximize conversion, edge delivery, and production code fidelity.";
      const card1Title = node.card1Title || "Global Sub-10ms TTFB Distribution";
      const card1Desc = node.card1Desc || "Pre-rendered static HTML and assets distributed globally across 300+ edge locations.";
      const card2Score = node.card2Score || "100/100";
      const card2Title = node.card2Title || "Flawless Lighthouse Metrics";
      const card3Title = node.card3Title || "1-Click React & Next.js 15 Export";
      const card3Desc = node.card3Desc || "Extract clean, modular TSX code with Tailwind CSS utilities.";
      const card4Title = node.card4Title || "Built-in CMS & Lead Capture";
      const card4Desc = node.card4Desc || "Manage pages, blog posts, navigation menus, and lead captures without external plugins.";

      return `${pad}<section className="py-20 lg:py-28 bg-slate-900 text-white relative overflow-hidden">
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
${pad}    <div className="text-center max-w-3xl mx-auto mb-16">
${pad}      <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">${escapeJsx(String(badge))}</span>
${pad}      <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">${escapeJsx(String(title))}</h2>
${pad}      <p className="mt-4 text-slate-400 text-sm sm:text-base">${escapeJsx(String(subtitle))}</p>
${pad}    </div>
${pad}    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
${pad}      <div className="md:col-span-2 p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-xl">
${pad}        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">EDGE COMPUTE</span>
${pad}        <h3 className="text-2xl font-bold mt-3 mb-2">${escapeJsx(String(card1Title))}</h3>
${pad}        <p className="text-slate-400 text-sm mb-6">${escapeJsx(String(card1Desc))}</p>
${pad}        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs text-slate-300">
${pad}          <div className="flex justify-between border-b border-slate-800 pb-2"><span>Route: /api/edge-stream</span><span className="text-emerald-400 font-bold">200 OK • 6.4ms</span></div>
${pad}          <div className="pt-2 text-blue-400">Edge Cache Hit: 99.8% (Global Distribution)</div>
${pad}        </div>
${pad}      </div>
${pad}      <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-xl flex flex-col justify-between text-center">
${pad}        <div>
${pad}          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">PERFORMANCE</span>
${pad}          <div className="my-6 inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-extrabold text-2xl mx-auto">${escapeJsx(String(card2Score))}</div>
${pad}        </div>
${pad}        <div><h3 className="text-lg font-bold mb-1">${escapeJsx(String(card2Title))}</h3><p className="text-xs text-slate-400">Zero cumulative layout shift.</p></div>
${pad}      </div>
${pad}      <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-xl flex flex-col justify-between">
${pad}        <div>
${pad}          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">PORTABILITY</span>
${pad}          <h3 className="text-xl font-bold mt-3 mb-2">${escapeJsx(String(card3Title))}</h3>
${pad}          <p className="text-slate-400 text-xs">${escapeJsx(String(card3Desc))}</p>
${pad}        </div>
${pad}        <div className="mt-6 text-xs text-indigo-400 font-semibold">Next.js 15 App Router &amp; React Vite</div>
${pad}      </div>
${pad}      <div className="md:col-span-2 p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-xl">
${pad}        <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">CMS ENGINE</span>
${pad}        <h3 className="text-2xl font-bold mt-3 mb-2">${escapeJsx(String(card4Title))}</h3>
${pad}        <p className="text-slate-400 text-sm mb-6">${escapeJsx(String(card4Desc))}</p>
${pad}        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
${pad}          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 font-bold">Multi-Page</div>
${pad}          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 font-bold">Blog Loops</div>
${pad}          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 font-bold">CSV Leads</div>
${pad}          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 font-bold">SEO Slugs</div>
${pad}        </div>
${pad}      </div>
${pad}    </div>
${pad}  </div>
${pad}</section>`;
    }

    case "TimelineSection":
    case "ProcessSection": {
      const badge = node.badge || "✨ STREAMLINED WORKFLOW";
      const title = node.title || "From Visual Idea to Production Code in 4 Steps";
      const subtitle = node.subtitle || "How creators, marketing teams, and developers ship extraordinary web experiences.";

      return `${pad}<section className="py-20 bg-slate-50 border-b border-slate-200">
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${pad}    <div className="text-center max-w-3xl mx-auto mb-16">
${pad}      <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-4">${escapeJsx(String(badge))}</span>
${pad}      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">${escapeJsx(String(title))}</h2>
${pad}      <p className="mt-3 text-slate-600 text-sm sm:text-base">${escapeJsx(String(subtitle))}</p>
${pad}    </div>
${pad}    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
${pad}      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
${pad}        <div>
${pad}          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center mb-4">01</div>
${pad}          <h3 className="font-bold text-slate-900 mb-2">Visual Page Architecture</h3>
${pad}          <p className="text-xs text-slate-600">Compose sections, headers, and pro widgets with real-time responsive controls.</p>
${pad}        </div>
${pad}      </div>
${pad}      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
${pad}        <div>
${pad}          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center mb-4">02</div>
${pad}          <h3 className="font-bold text-slate-900 mb-2">Dynamic Content &amp; Widgets</h3>
${pad}          <p className="text-xs text-slate-600">Configure pricing toggles, searchable FAQ accordions, and lead forms.</p>
${pad}        </div>
${pad}      </div>
${pad}      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
${pad}        <div>
${pad}          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center mb-4">03</div>
${pad}          <h3 className="font-bold text-slate-900 mb-2">CMS &amp; SEO Governance</h3>
${pad}          <p className="text-xs text-slate-600">Publish blog articles, manage navigation menus, and optimize metadata.</p>
${pad}        </div>
${pad}      </div>
${pad}      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
${pad}        <div>
${pad}          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center mb-4">04</div>
${pad}          <h3 className="font-bold text-slate-900 mb-2">Production Code Export</h3>
${pad}          <p className="text-xs text-slate-600">Download clean Next.js 15 App Router code ready to deploy anywhere.</p>
${pad}        </div>
${pad}      </div>
${pad}    </div>
${pad}  </div>
${pad}</section>`;
    }

    case "NewsletterSection": {
      const badge = node.badge || "✨ WEEKLY ENGINEERING DISPATCH";
      const title = node.title || "Stay Ahead of Modern Web Craft & Architecture";
      const subtitle = node.subtitle || "Join 25,000+ creators receiving curated production components and Next.js guides.";

      return `${pad}<section className="py-20 px-4 bg-white">
${pad}  <div className="max-w-4xl mx-auto rounded-3xl p-10 sm:p-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white text-center shadow-2xl">
${pad}    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 mb-4">${escapeJsx(String(badge))}</span>
${pad}    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">${escapeJsx(String(title))}</h2>
${pad}    <p className="mt-3 text-sm text-blue-100 max-w-xl mx-auto">${escapeJsx(String(subtitle))}</p>
${pad}    <form action="/api/contact" method="POST" className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
${pad}      <input type="email" name="email" required placeholder="Enter work email..." className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none" />
${pad}      <button type="submit" className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-900 hover:bg-black text-white transition-all shadow-lg shrink-0">Subscribe</button>
${pad}    </form>
${pad}  </div>
${pad}</section>`;
    }

    case "CountdownSection": {
      const title = node.title || "Limited Time Offer: Early Access";
      const subtitle = node.subtitle || "Lock in early founder access before the special offer ends.";
      const buttonText = node.buttonText || "Claim Access Now";

      return `${pad}<section className="py-16 bg-slate-900 text-white text-center">
${pad}  <div className="max-w-3xl mx-auto px-4">
${pad}    <span className="text-xs font-bold text-amber-400 tracking-widest uppercase">⚡ SPECIAL LAUNCH WINDOW</span>
${pad}    <h2 className="text-3xl font-extrabold mt-2 mb-3">${escapeJsx(String(title))}</h2>
${pad}    <p className="text-sm text-slate-400 mb-8">${escapeJsx(String(subtitle))}</p>
${pad}    <div className="flex justify-center gap-4 mb-8 font-mono text-center">
${pad}      <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 w-20"><div className="text-3xl font-bold text-blue-400">04</div><div className="text-[10px] text-slate-400">DAYS</div></div>
${pad}      <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 w-20"><div className="text-3xl font-bold text-blue-400">18</div><div className="text-[10px] text-slate-400">HOURS</div></div>
${pad}      <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 w-20"><div className="text-3xl font-bold text-blue-400">42</div><div className="text-[10px] text-slate-400">MINS</div></div>
${pad}      <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 w-20"><div className="text-3xl font-bold text-blue-400">15</div><div className="text-[10px] text-slate-400">SECS</div></div>
${pad}    </div>
${pad}    <a href="#contact" className="px-8 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25">${escapeJsx(String(buttonText))}</a>
${pad}  </div>
${pad}</section>`;
    }

    case "VideoSection": {
      const title = node.title || "Watch How Nexoraft Ships in Minutes";
      const subtitle = node.subtitle || "A complete walkthrough of the Nexoraft CMS dashboard and Visual Studio canvas.";

      return `${pad}<section className="py-20 bg-white text-center">
${pad}  <div className="max-w-5xl mx-auto px-4">
${pad}    <h2 className="text-3xl font-extrabold text-slate-900">${escapeJsx(String(title))}</h2>
${pad}    <p className="mt-3 text-slate-600 text-sm max-w-2xl mx-auto mb-10">${escapeJsx(String(subtitle))}</p>
${pad}    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-video bg-slate-900 flex items-center justify-center">
${pad}      <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-xl cursor-pointer hover:scale-105 transition-all">▶</div>
${pad}    </div>
${pad}  </div>
${pad}</section>`;
    }

    case "PostsGridSection": {
      const title = node.title || "From the Nexoraft Publication";
      const subtitle = node.subtitle || "Tutorials and architectural deep-dives from our engineering team.";

      return `${pad}<section className="py-20 bg-slate-50">
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${pad}    <div className="text-center max-w-3xl mx-auto mb-16">
${pad}      <h2 className="text-3xl font-bold text-slate-900">${escapeJsx(String(title))}</h2>
${pad}      <p className="mt-3 text-sm text-slate-600">${escapeJsx(String(subtitle))}</p>
${pad}    </div>
${pad}    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
${pad}      <article className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden p-6 flex flex-col justify-between">
${pad}        <div><span className="text-xs font-bold text-blue-600 uppercase">Design</span><h3 className="text-lg font-bold text-slate-900 mt-2 mb-2">High-Conversion Landing Pages with Nexoraft Precision</h3><p className="text-xs text-slate-600">Master responsive layout tokens, visual hierarchy, and CTA placement.</p></div>
${pad}        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">By Sarah Chen • 4 min read</div>
${pad}      </article>
${pad}      <article className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden p-6 flex flex-col justify-between">
${pad}        <div><span className="text-xs font-bold text-emerald-600 uppercase">Engineering</span><h3 className="text-lg font-bold text-slate-900 mt-2 mb-2">Zero-Lock-In Web Architecture: Exporting Next.js 15</h3><p className="text-xs text-slate-600">How our compiler outputs clean components, dynamic routes, and Tailwind classes.</p></div>
${pad}        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">By Marcus Miller • 6 min read</div>
${pad}      </article>
${pad}      <article className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden p-6 flex flex-col justify-between">
${pad}        <div><span className="text-xs font-bold text-purple-600 uppercase">Product</span><h3 className="text-lg font-bold text-slate-900 mt-2 mb-2">The Modern Modular CMS Paradigm in 2026</h3><p className="text-xs text-slate-600">Why organizing pages, blog posts, and leads under a unified dashboard wins.</p></div>
${pad}        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">By Elena Rostova • 5 min read</div>
${pad}      </article>
${pad}    </div>
${pad}  </div>
${pad}</section>`;
    }

    case "TeamSection": {
      const title = node.title || "Meet the Minds Behind the Vision";
      const subtitle = node.subtitle || "Designers, builders, and engineers united by an obsession with visual craft.";

      return `${pad}<section className="py-20 bg-white">
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
${pad}    <h2 className="text-3xl font-bold text-slate-900">${escapeJsx(String(title))}</h2>
${pad}    <p className="mt-3 text-slate-600 text-sm max-w-2xl mx-auto mb-16">${escapeJsx(String(subtitle))}</p>
${pad}    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
${pad}      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center"><div className="w-20 h-20 rounded-full bg-blue-600 text-white text-xl font-bold mx-auto mb-4 flex items-center justify-center">AA</div><h3 className="font-bold text-slate-900">Arham Ahmed</h3><p className="text-xs text-blue-600 font-semibold mb-2">Lead Systems Architect &amp; Founder</p><p className="text-xs text-slate-600">Pioneering visual CMS architecture with zero runtime lock-in.</p></div>
${pad}      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center"><div className="w-20 h-20 rounded-full bg-purple-600 text-white text-xl font-bold mx-auto mb-4 flex items-center justify-center">SZ</div><h3 className="font-bold text-slate-900">Sophia Zhang</h3><p className="text-xs text-purple-600 font-semibold mb-2">Head of Product Design</p><p className="text-xs text-slate-600">Crafting Nexoraft Pro visual drag &amp; drop primitives.</p></div>
${pad}      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center"><div className="w-20 h-20 rounded-full bg-indigo-600 text-white text-xl font-bold mx-auto mb-4 flex items-center justify-center">LO</div><h3 className="font-bold text-slate-900">Liam O'Connor</h3><p className="text-xs text-indigo-600 font-semibold mb-2">Next.js Compiler Specialist</p><p className="text-xs text-slate-600">Optimizing 1-click multi-page AST exporters.</p></div>
${pad}    </div>
${pad}  </div>
${pad}</section>`;
    }

    case "Heading": {
      const title = node.title || "Section Heading";
      const subtitle = node.subtitle;
      return `${pad}<div className="my-4">
${pad}  <h2 className="text-2xl font-bold tracking-tight text-slate-900">${escapeJsx(
        String(title)
      )}</h2>
${
  subtitle
    ? `${pad}  <p className="text-sm text-slate-500 mt-1">${escapeJsx(
        String(subtitle)
      )}</p>\n`
    : ""
}${pad}</div>`;
    }

    case "Text": {
      const content = node.content || "Sample text content goes here.";
      return `${pad}<p className="text-sm text-slate-600 leading-relaxed my-2">${escapeJsx(
        String(content)
      )}</p>`;
    }

    case "Button": {
      const text = node.buttonText || "Click Action";
      const variant = node.variant || "primary";
      const styleClass =
        variant === "secondary"
          ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
          : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm";
      return `${pad}<button className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${styleClass}">
${pad}  ${escapeJsx(String(text))}
${pad}</button>`;
    }

    case "Card": {
      const title = node.title || "Feature Card";
      const description = node.description || "Card description details.";
      const buttonText = node.buttonText || "Explore";
      return `${pad}<div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm my-4">
${pad}  <h3 className="text-lg font-bold text-slate-900 mb-2">${escapeJsx(String(title))}</h3>
${pad}  <p className="text-sm text-slate-600 mb-4 leading-relaxed">${escapeJsx(
        String(description)
      )}</p>
${pad}  <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white">${escapeJsx(
        String(buttonText)
      )}</button>
${pad}</div>`;
    }

    case "Divider": {
      return `${pad}<hr className="my-8 border-slate-200" />`;
    }

    case "Spacer": {
      const height = node.height || 40;
      return `${pad}<div style={{ height: '${height}px' }} className="w-full" />`;
    }

    case "FlipBoxSection":
    case "FlipBox": {
      const badge = node.badge || "✦ 3D INTERACTIVE CARDS";
      const title = node.title || "Interactive Offerings";
      const subtitle =
        node.subtitle ||
        "Hover over any card below to experience smooth 3D flip card interactions.";
      const items = Array.isArray(node.items)
        ? (node.items as ItemRecord[])
        : [
            {
              frontTitle: "Fullstack Next.js",
              frontDesc:
                "Production-ready App Router architectures with Server Components.",
              backTitle: "Zero Lock-In",
              backDesc:
                "Export clean TypeScript, Tailwind, and React code anytime.",
              buttonText: "Learn More",
              href: "#features",
            },
            {
              frontTitle: "Visual Studio Engine",
              frontDesc:
                "Pixel-perfect drag, drop, and live inline editing canvas.",
              backTitle: "High Velocity",
              backDesc:
                "Build agency and client sites in minutes without breaking code.",
              buttonText: "See Demo",
              href: "#pricing",
            },
            {
              frontTitle: "Autonomous CMS",
              frontDesc:
                "Structured content modeling, blog publishing, and forms inbox.",
              backTitle: "Integrated Leads",
              backDesc:
                "Collect customer inquiries directly into your site dashboard.",
              buttonText: "Get Started",
              href: "#contact",
            },
          ];

      return `${pad}<section className="py-20 bg-slate-50">
${pad}  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
${pad}    <div className="text-center max-w-3xl mx-auto mb-16">
${pad}      <span className="text-xs font-black tracking-widest text-blue-600 uppercase mb-2 block">${escapeJsx(
        String(badge)
      )}</span>
${pad}      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">${escapeJsx(
        String(title)
      )}</h2>
${pad}      <p className="mt-4 text-base text-slate-600">${escapeJsx(
        String(subtitle)
      )}</p>
${pad}    </div>
${pad}    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
${items
  .map(
    (card) => `${pad}      <div className="h-80 [perspective:1000px] group">
${pad}        <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
${pad}          <div className="absolute inset-0 w-full h-full rounded-3xl p-8 bg-white border border-slate-200 shadow-sm flex flex-col justify-between [backface-visibility:hidden]">
${pad}            <div>
${pad}              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-4">✦</div>
${pad}              <h3 className="text-xl font-bold text-slate-900 mb-2">${escapeJsx(
      String(card.frontTitle || card.title || "Card")
    )}</h3>
${pad}              <p className="text-sm text-slate-600">${escapeJsx(
      String(card.frontDesc || card.description || "")
    )}</p>
${pad}            </div>
${pad}            <span className="text-xs font-semibold text-blue-600">Hover to flip ➔</span>
${pad}          </div>
${pad}          <div className="absolute inset-0 w-full h-full rounded-3xl p-8 bg-blue-600 text-white flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-xl">
${pad}            <div>
${pad}              <h3 className="text-xl font-bold mb-2">${escapeJsx(
      String(card.backTitle || "Details")
    )}</h3>
${pad}              <p className="text-sm text-blue-100">${escapeJsx(
      String(card.backDesc || "")
    )}</p>
${pad}            </div>
${pad}            <a href="${escapeJsx(
      String(card.buttonHref || card.href || "#")
    )}" className="px-4 py-2 rounded-xl bg-white text-blue-600 text-xs font-bold text-center hover:bg-blue-50 transition-colors">${escapeJsx(
      String(card.buttonText || "Learn More")
    )}</a>
${pad}          </div>
${pad}        </div>
${pad}      </div>`
  )
  .join("\n")}
${pad}    </div>
${pad}  </div>
${pad}</section>`;
    }

    case "PriceListSection":
    case "PriceList": {
      const badge = node.badge || "✦ TRANSPARENT RATES";
      const title = node.title || "Services & Tiered Pricing Menu";
      const subtitle =
        node.subtitle ||
        "A clear breakdown of available services, modular add-ons, and enterprise rates.";
      const items = Array.isArray(node.items)
        ? (node.items as ItemRecord[])
        : [
            {
              title: "Visual Studio Setup",
              price: "$490",
              description:
                "Complete brand design system configuration and canvas theme setup.",
              tag: "Popular",
            },
            {
              title: "Custom CMS Architecture",
              price: "$850",
              description:
                "Structured content schemas, dynamic post loops, and inbox forms.",
              tag: "Essential",
            },
            {
              title: "Next.js App Router Export",
              price: "$1,200",
              description:
                "Zero lock-in code generation with clean TypeScript, Tailwind, and components.",
              tag: "Agency",
            },
            {
              title: "Performance & SEO Audit",
              price: "$350",
              description:
                "100/100 Lighthouse score tuning, meta schemas, and responsive checks.",
            },
          ];

      return `${pad}<section className="py-20 bg-white">
${pad}  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
${pad}    <div className="text-center mb-16">
${pad}      <span className="text-xs font-black tracking-widest text-blue-600 uppercase mb-2 block">${escapeJsx(
        String(badge)
      )}</span>
${pad}      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">${escapeJsx(
        String(title)
      )}</h2>
${pad}      <p className="mt-4 text-base text-slate-600">${escapeJsx(
        String(subtitle)
      )}</p>
${pad}    </div>
${pad}    <div className="space-y-6">
${items
  .map(
    (item) => `${pad}      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
${pad}        <div className="flex items-baseline justify-between gap-4">
${pad}          <div className="flex items-center gap-2">
${pad}            <h3 className="font-bold text-slate-900 text-base sm:text-lg">${escapeJsx(
      String(item.title || "Service")
    )}</h3>
${
  item.tag
    ? `${pad}            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">${escapeJsx(
        String(item.tag)
      )}</span>`
    : ""
}
${pad}          </div>
${pad}          <div className="flex-1 mx-3 border-b-2 border-dotted border-slate-300" />
${pad}          <span className="font-black text-blue-600 text-lg sm:text-xl font-mono shrink-0">${escapeJsx(
      String(item.price || "$0")
    )}</span>
${pad}        </div>
${
  item.description
    ? `${pad}        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl">${escapeJsx(
        String(item.description)
      )}</p>`
    : ""
}
${pad}      </div>`
  )
  .join("\n")}
${pad}    </div>
${pad}  </div>
${pad}</section>`;
    }

    case "TableOfContentsSection":
    case "TableOfContents": {
      const title = node.title || "Table of Contents";
      const subtitle =
        node.subtitle ||
        "Quickly navigate through all architecture sections and modules on this page.";
      const items = Array.isArray(node.items)
        ? (node.items as ItemRecord[])
        : [
            { label: "Executive Overview & Hero", href: "#hero" },
            { label: "Bento High-Density Architecture", href: "#bento" },
            { label: "Core Velocity Features", href: "#features" },
            { label: "Flexible Pricing & Billing", href: "#pricing" },
            { label: "Client Testimonials & Reviews", href: "#testimonials" },
            { label: "Knowledge Base & FAQ", href: "#faq" },
            { label: "Inquiries & Contact Form", href: "#contact" },
          ];

      return `${pad}<section className="py-10 px-4 sm:px-8 bg-slate-50 border-y border-slate-200">
${pad}  <div className="max-w-3xl mx-auto rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm">
${pad}    <h3 className="text-lg font-bold text-slate-900 mb-2">${escapeJsx(
        String(title)
      )}</h3>
${pad}    <p className="text-xs text-slate-500 mb-6">${escapeJsx(
        String(subtitle)
      )}</p>
${pad}    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
${items
  .map(
    (item, idx) => `${pad}      <a href="${escapeJsx(
      String(item.href || "#")
    )}" className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
${pad}        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center font-mono text-[10px] font-bold">${String(
      idx + 1
    ).padStart(2, "0")}</span>
${pad}        <span>${escapeJsx(
      String(item.label || item.title || "Section")
    )}</span>
${pad}      </a>`
  )
  .join("\n")}
${pad}    </div>
${pad}  </div>
${pad}</section>`;
    }

    case "AlertBoxSection":
    case "AlertBox": {
      const title = node.title || "Nexoraft 2.0 Engine Update Live";
      const description =
        node.description ||
        "Enjoy 2x faster visual compilation, instant live item repeaters, and zero-runtime Next.js 15 App Router code export.";
      const buttonText = node.buttonText || "Explore Release Notes";
      const href = node.href || "#features";

      return `${pad}<div className="mx-auto max-w-5xl my-4 px-4 sm:px-6">
${pad}  <div className="p-4 sm:p-5 rounded-2xl border bg-blue-50 border-blue-200 text-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
${pad}    <div>
${pad}      <h4 className="font-bold text-sm leading-tight">${escapeJsx(
        String(title)
      )}</h4>
${pad}      <p className="text-xs opacity-90 mt-1 leading-relaxed">${escapeJsx(
        String(description)
      )}</p>
${pad}    </div>
${pad}    <a href="${escapeJsx(
        String(href)
      )}" className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 transition-all shrink-0">${escapeJsx(
        String(buttonText)
      )}</a>
${pad}  </div>
${pad}</div>`;
    }

    case "ShareButtonsSection":
    case "ShareButtons": {
      const title = node.title || "Share this Website with Your Network";
      const subtitle =
        node.subtitle ||
        "Help founders, creators, and engineering teams discover portable visual web building.";
      const shareUrl = node.shareUrl || "https://nexoraft.com";
      const shareText =
        node.shareText ||
        "Check out Nexoraft - The visual builder with zero platform lock-in!";

      return `${pad}<section className="py-8 px-4 bg-slate-50 border-y border-slate-200 text-center">
${pad}  <div className="max-w-2xl mx-auto">
${pad}    <h4 className="text-sm font-bold text-slate-900">${escapeJsx(
        String(title)
      )}</h4>
${pad}    <p className="text-xs text-slate-500 mt-0.5 mb-4">${escapeJsx(
        String(subtitle)
      )}</p>
${pad}    <div className="flex flex-wrap items-center justify-center gap-2">
${pad}      <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(
        String(shareUrl)
      )}&text=${encodeURIComponent(
        String(shareText)
      )}" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all">Post on X</a>
${pad}      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        String(shareUrl)
      )}" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all">Share on LinkedIn</a>
${pad}      <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(
        String(shareText)
      )}%20${encodeURIComponent(
        String(shareUrl)
      )}" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all">WhatsApp</a>
${pad}    </div>
${pad}  </div>
${pad}</section>`;
    }

    case "Container":
    default: {
      const childrenIds = node.children || [];
      const childrenJsx = childrenIds
        .map((childId) => generateElementJsx(childId, elements, indent + 2))
        .filter(Boolean)
        .join("\n");

      return `${pad}<div className="${
        node.isRoot
          ? "w-full min-h-screen bg-white text-slate-900 flex flex-col"
          : "p-4 rounded-xl border border-slate-100"
      }">
${childrenJsx}
${pad}</div>`;
    }
  }
}

// Generate complete Next.js 15 App Router Project File Tree with Multi-Page routing
export function generateNextJsProjectFiles(website: WebsiteSite): Record<string, string> {
  const files: Record<string, string> = {};

  const packageJson = JSON.stringify(
    {
      name: website.slug || "nexoraft-project",
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
  files["package.json"] = packageJson;

  files["next.config.ts"] = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
`;

  files["tsconfig.json"] = JSON.stringify(
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

  files["app/globals.css"] = `@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --primary: ${website.theme?.primaryColor || "#3b82f6"};
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: ${website.theme?.fontFamily || "Inter, sans-serif"};
}
`;

  files["app/layout.tsx"] = `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "${website.name}",
    template: "%s | ${website.name}",
  },
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

  // Generate All Pages
  const pageEntries = Object.values(website.pages);
  pageEntries.forEach((page) => {
    const isHome = page.slug === "/" || page.id === "home";
    const bodyJsx = generateElementJsx(page.rootElementId, website.elements, 4);

    const pageContent = `"use client";

import React from "react";

export default function ${isHome ? "HomePage" : "SubPage"}() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
${bodyJsx}
    </main>
  );
}
`;

    if (isHome) {
      files["app/page.tsx"] = pageContent;
    } else {
      const cleanSlug = page.slug.replace(/^\//, "");
      files[`app/${cleanSlug}/page.tsx`] = pageContent;
    }
  });

  // Blog Posts Pages (if any posts exist)
  if (website.posts && website.posts.length > 0) {
    files["app/blog/page.tsx"] = `"use client";

import React from "react";
import Link from "next/link";

const POSTS = ${JSON.stringify(website.posts, null, 2)};

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 py-20 px-4 sm:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight">Our Latest Insights</h1>
        <p className="mt-3 text-base text-slate-600">Thought leadership, product releases, and engineering guides.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {POSTS.map((post) => (
          <article key={post.id} className="rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all">
            {post.featuredImage && (
              <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <span className="text-xs font-bold text-blue-600 uppercase">{post.category}</span>
              <h2 className="text-lg font-bold text-slate-900 mt-2 mb-3">{post.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{post.excerpt}</p>
            </div>
            <div className="p-6 pt-0 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 mt-4">
              <span>{post.author}</span>
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
`;
  }

  // API Route Handler for Contact Form
  files["app/api/contact/route.ts"] = `import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let data: Record<string, unknown> = {};

    if (contentType.includes("application/json")) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    console.log("Contact form inquiry received:", data);

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out. Your message has been received.",
      receivedData: data,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to process form submission." },
      { status: 500 }
    );
  }
}
`;

  files[".env.example"] = `# Environment configuration for ${website.name}
NEXT_PUBLIC_SITE_NAME="${website.name}"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
`;

  files["README.md"] = `# ${website.name}

Production Next.js 15 App Router website exported from **Nexoraft Visual Builder**.

## 🚀 100% Independent & Self-Contained
This codebase has **zero proprietary runtime dependencies**. You own 100% of the source code.

## 📦 Setup & Local Development
1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run development server:
\`\`\`bash
npm run dev
\`\`\`
Visit [http://localhost:3000](http://localhost:3000)

3. Build for production:
\`\`\`bash
npm run build
npm start
\`\`\`

## 🚢 Deployment
- **Vercel**: Push to GitHub and import repository at [vercel.com/new](https://vercel.com/new).
- **Netlify**: Connect repository or run \`npx netlify deploy --prod\`.
- **Cloudflare Pages / AWS / Docker**: Build standard Next.js output with \`npm run build\`.
`;

  files["EXPORT_REPORT.md"] = `# Nexoraft Export Compatibility Report

- **Project**: ${website.name}
- **Export Format**: Next.js 15 (App Router) + Tailwind CSS 4
- **Independence Status**: 100% Self-Contained
- **Proprietary Builder Lock-In**: 0% (Zero runtime dependencies)
- **Pages Exported**: ${pageEntries.length} (${pageEntries.map((p) => p.name).join(", ")})
- **Blog Posts**: ${website.posts ? website.posts.length : 0} articles compiled
- **API Endpoints**: 1 (/api/contact)
- **Design Tokens**: Synced via CSS variables and Tailwind utilities
`;

  return files;
}

// Generate complete React (Vite) Project File Tree
export function generateReactViteProjectFiles(website: WebsiteSite): Record<string, string> {
  const files: Record<string, string> = {};

  const packageJson = JSON.stringify(
    {
      name: website.slug || "nexoraft-react-app",
      private: true,
      version: "0.1.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc -b && vite build",
        preview: "vite preview",
      },
      dependencies: {
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        "react-router-dom": "^6.28.0",
        "lucide-react": "^0.475.0",
      },
      devDependencies: {
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
        "@vitejs/plugin-react": "^4.3.4",
        typescript: "^5.6.3",
        vite: "^6.0.1",
        tailwindcss: "^4.0.0",
        "@tailwindcss/vite": "^4.0.0",
      },
    },
    null,
    2
  );
  files["package.json"] = packageJson;

  files["vite.config.ts"] = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`;

  files["index.html"] = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${website.name}</title>
    <meta name="description" content="${website.description}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

  files["src/index.css"] = `@import "tailwindcss";

:root {
  --primary: ${website.theme?.primaryColor || "#3b82f6"};
}

body {
  margin: 0;
  font-family: ${website.theme?.fontFamily || "Inter, sans-serif"};
  color: #0f172a;
  background-color: #ffffff;
}
`;

  files["src/main.tsx"] = `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
`;

  // Generate Pages for React Router
  const pageEntries = Object.values(website.pages);
  pageEntries.forEach((page) => {
    const isHome = page.slug === "/" || page.id === "home";
    const componentName = isHome
      ? "HomePage"
      : `Page_${page.name.replace(/[^a-zA-Z0-9]/g, "")}`;
    const bodyJsx = generateElementJsx(page.rootElementId, website.elements, 4);

    files[`src/pages/${componentName}.tsx`] = `import React from 'react';

export default function ${componentName}() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
${bodyJsx}
    </main>
  );
}
`;
  });

  // App.tsx router
  const routeImports = pageEntries
    .map((p) => {
      const isHome = p.slug === "/" || p.id === "home";
      const componentName = isHome
        ? "HomePage"
        : `Page_${p.name.replace(/[^a-zA-Z0-9]/g, "")}`;
      return `import ${componentName} from './pages/${componentName}';`;
    })
    .join("\n");

  const routeElements = pageEntries
    .map((p) => {
      const isHome = p.slug === "/" || p.id === "home";
      const componentName = isHome
        ? "HomePage"
        : `Page_${p.name.replace(/[^a-zA-Z0-9]/g, "")}`;
      return `      <Route path="${p.slug}" element={<${componentName} />} />`;
    })
    .join("\n");

  files["src/App.tsx"] = `import React from 'react';
import { Routes, Route } from 'react-router-dom';
${routeImports}

export default function App() {
  return (
    <Routes>
${routeElements}
    </Routes>
  );
}
`;

  files["README.md"] = `# ${website.name} (React Vite)

Exported from **Nexoraft Visual Builder**.

## 🚀 Getting Started
\`\`\`bash
npm install
npm run dev
\`\`\`
Visit [http://localhost:5173](http://localhost:5173)

## 🚢 Production Build
\`\`\`bash
npm run build
\`\`\`
The output in \`dist/\` can be deployed directly to any static host (Netlify, Vercel, Cloudflare, S3).
`;

  files["EXPORT_REPORT.md"] = `# Nexoraft Export Compatibility Report

- **Project**: ${website.name}
- **Export Format**: React 19 + Vite + React Router v6 + Tailwind CSS 4
- **Independence Status**: 100% Self-Contained
- **Proprietary Builder Lock-In**: 0%
- **Pages**: ${pageEntries.length} routes configured in React Router
`;

  return files;
}

// Download exported zip archive directly in browser
export async function downloadProjectZip(
  website: WebsiteSite,
  target: "nextjs" | "react" = "nextjs"
): Promise<void> {
  const zip = new JSZip();
  const fileTree =
    target === "nextjs"
      ? generateNextJsProjectFiles(website)
      : generateReactViteProjectFiles(website);

  Object.entries(fileTree).forEach(([path, content]) => {
    zip.file(path, content);
  });

  const blob = await zip.generateAsync({ type: "blob" });
  const filename = `${website.slug || "nexoraft-site"}-${target}.zip`;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

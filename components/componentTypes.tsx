"use client";

import React, { ComponentType, useState } from "react";
import Container from "./Container";
import withDrop from "./hoc/withDragAndDrop";
import withEditable from "./hoc/withEditable";
import {
  Sparkles,
  ArrowRight,
  Check,
  Send,
  Star,
  ChevronDown,
  CheckCircle2,
  Clock,
  Play,
  Search,
  Calendar,
  User,
  Mail,
  Zap,
} from "lucide-react";

export interface BaseElementProps {
  id?: string;
  label?: string;
  style?: React.CSSProperties;
  className?: string;
  isEditable?: boolean;
  isPreview?: boolean;
  disabled?: boolean;
  [key: string]: unknown;
}

// 1. Heading Component
const HeadingComponent: React.FC<
  BaseElementProps & { title?: string; subtitle?: string; level?: string }
> = ({
  title = "Section Headline",
  subtitle,
  style,
  className = "",
}) => (
  <div style={style} className={`flex flex-col gap-1.5 my-3 ${className}`}>
    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
      {title}
    </h2>
    {subtitle && (
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
        {subtitle}
      </p>
    )}
  </div>
);

// 2. Text / Paragraph Component
const TextComponent: React.FC<BaseElementProps & { content?: string }> = ({
  content = "Empowering teams to design, iterate, and deploy production-ready digital products with maximum speed and visual fidelity.",
  style,
  className = "",
}) => (
  <p
    style={style}
    className={`text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed my-2 ${className}`}
  >
    {content}
  </p>
);

// 3. Button Component
const ButtonComponent: React.FC<
  BaseElementProps & {
    buttonText?: string;
    variant?: "primary" | "secondary" | "outline" | "danger";
  }
> = ({
  buttonText = "Explore Features",
  variant = "primary",
  style,
  className = "",
}) => {
  const variantStyles = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20",
    secondary:
      "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700",
    outline:
      "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20",
  }[variant || "primary"];

  return (
    <button
      type="button"
      style={style}
      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2 cursor-pointer w-fit ${variantStyles} ${className}`}
    >
      <span>{buttonText}</span>
      <ArrowRight className="w-4 h-4 opacity-80" />
    </button>
  );
};

// 4. Badge Component
const BadgeComponent: React.FC<BaseElementProps & { badge?: string }> = ({
  badge = "✨ NEW RELEASE",
  style,
  className = "",
}) => (
  <div
    style={style}
    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 w-fit ${className}`}
  >
    <Sparkles className="w-3.5 h-3.5" />
    <span>{badge}</span>
  </div>
);

// 5. Image Component
const ImageComponent: React.FC<
  BaseElementProps & { src?: string; alt?: string }
> = ({
  src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  alt = "Website preview",
  style,
  className = "",
}) => (
  <div
    style={style}
    className={`relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg my-4 ${className}`}
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={src}
      alt={alt}
      className="w-full h-auto object-cover max-h-[480px] hover:scale-102 transition-transform duration-500"
    />
  </div>
);

// 6. Navbar Section
const NavbarSectionComponent: React.FC<
  BaseElementProps & {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    items?: Array<{ label?: string; href?: string }>;
  }
> = ({
  title = "Nexoraft",
  subtitle,
  buttonText = "Get Started",
  items = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
    { label: "FAQ", href: "#faq" },
  ],
  style,
  className = "",
}) => (
  <header
    style={style}
    className={`w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3.5 px-4 sm:px-8 transition-colors ${className}`}
  >
    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-sm">
          {title.charAt(0) || "N"}
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </span>
          {subtitle && (
            <span className="hidden sm:inline-block text-xs text-slate-400 dark:text-slate-500 ml-2 font-normal">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        {items.map((it, idx) => (
          <span
            key={idx}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            {it.label || "Link"}
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
        >
          {buttonText}
        </button>
      </div>
    </div>
  </header>
);

// 7. Hero Section
const HeroSectionComponent: React.FC<
  BaseElementProps & {
    badge?: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonSecondaryText?: string;
  }
> = ({
  badge = "✨ NEXORAFT PRO VISUAL CRAFT",
  title = "Design Visually. Own Your Code. Ship Anywhere.",
  subtitle = "The modern visual website canvas engineered for high conversion, responsive fidelity, and instant Next.js & React project export with zero lock-in.",
  buttonText = "Start Free Project",
  buttonSecondaryText = "Explore Docs",
  style,
  className = "",
}) => (
  <section
    style={style}
    className={`relative py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-blue-50/60 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800/80 ${className}`}
  >
    <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
      {badge && (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 mb-6 border border-blue-200 dark:border-blue-800">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>{badge}</span>
        </div>
      )}

      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] max-w-4xl">
        {title}
      </h1>

      <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
        {subtitle}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
        <button
          type="button"
          className="px-6 sm:px-8 py-3 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        {buttonSecondaryText && (
          <button
            type="button"
            className="px-6 sm:px-8 py-3 rounded-xl font-semibold text-sm bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
          >
            {buttonSecondaryText}
          </button>
        )}
      </div>
    </div>
  </section>
);

// 8. Feature Grid Section
const FeatureGridSectionComponent: React.FC<
  BaseElementProps & {
    title?: string;
    subtitle?: string;
    items?: Array<{ title?: string; description?: string; icon?: string }>;
  }
> = ({
  title = "Engineered for Velocity & Absolute Portability",
  subtitle = "Everything you need to turn ideas into fully deployed web experiences with zero runtime dependencies.",
  items = [
    {
      title: "Visual Drag & Drop",
      description:
        "Intuitive canvas engineered for high-velocity visual building and modern CMS workflows. Create responsive layouts effortlessly.",
    },
    {
      title: "Clean Next.js & React Export",
      description:
        "Export production-ready Next.js 15 App Router & React Vite projects with Tailwind CSS and full TypeScript types.",
    },
    {
      title: "Zero Platform Lock-In",
      description:
        "You own 100% of the code. Deploy freely to Vercel, Netlify, Cloudflare, AWS, or any static host.",
    },
  ],
  style,
  className = "",
}) => (
  <section
    style={style}
    className={`py-16 sm:py-24 px-4 sm:px-8 bg-white dark:bg-slate-950 ${className}`}
  >
    <div className="max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg mb-5 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {it.title || "Feature Title"}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {it.description || "Feature description details."}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 9. Stats Section (PRD 8.4)
const StatsSectionComponent: React.FC<
  BaseElementProps & {
    items?: Array<{ value?: string; label?: string; change?: string }>;
  }
> = ({
  items = [
    { value: "99.9%", label: "Uptime Guaranteed", change: "+0.4%" },
    { value: "10k+", label: "Websites Shipped", change: "+140%" },
    { value: "<100ms", label: "Server Response", change: "Fast" },
    { value: "0", label: "Runtime Lock-In", change: "100% Free" },
  ],
  style,
  className = "",
}) => (
  <section
    style={style}
    className={`py-12 px-4 sm:px-8 bg-slate-900 text-white ${className}`}
  >
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      {items.map((stat, idx) => (
        <div key={idx} className="p-4 flex flex-col items-center">
          <span className="text-3xl sm:text-4xl font-black text-blue-400 tracking-tight">
            {stat.value || "100"}
          </span>
          <span className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
            {stat.label || "Metric"}
          </span>
          {stat.change && (
            <span className="text-[10px] text-emerald-400 font-semibold mt-1">
              {stat.change}
            </span>
          )}
        </div>
      ))}
    </div>
  </section>
);

// 10. Testimonials Section (PRD 8.4)
const TestimonialsSectionComponent: React.FC<
  BaseElementProps & {
    title?: string;
    subtitle?: string;
    items?: Array<{
      quote?: string;
      name?: string;
      role?: string;
      company?: string;
      rating?: number;
      avatar?: string;
    }>;
  }
> = ({
  title = "Loved by Founders & Engineers",
  subtitle = "Hear from teams who replaced slow workflows with Nexoraft's portable visual builder.",
  items = [
    {
      quote:
        "Nexoraft gives our marketing team the speed of a visual studio and our developers the clean React code we insist on.",
      name: "Sarah Chen",
      role: "VP of Product",
      company: "Aether Dynamics",
      rating: 5,
    },
    {
      quote:
        "The 1-click Next.js export is brilliant. The generated code is clean, typed, and installs in seconds with zero fluff.",
      name: "Marcus Miller",
      role: "Lead Architect",
      company: "StackShift",
      rating: 5,
    },
    {
      quote:
        "We went from a blank canvas to a fully launched multi-page client website in less than an afternoon.",
      name: "Elena Rostova",
      role: "Agency Founder",
      company: "PixelCraft",
      rating: 5,
    },
  ],
  style,
  className = "",
}) => (
  <section
    style={style}
    className={`py-16 sm:py-24 px-4 sm:px-8 bg-slate-50 dark:bg-slate-900/50 ${className}`}
  >
    <div className="max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {items.map((testi, idx) => (
          <div
            key={idx}
            className="p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(testi.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                &ldquo;{testi.quote}&rdquo;
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                {(testi.name || "U").charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {testi.name || "User"}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {testi.role} • {testi.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 11. FAQ Section (Nexoraft Pro Accordion)
const FAQSectionComponent: React.FC<
  BaseElementProps & {
    title?: string;
    subtitle?: string;
    searchPlaceholder?: string;
    items?: Array<{ question?: string; answer?: string }>;
  }
> = ({
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about exporting, code ownership, and deployment.",
  searchPlaceholder = "Search questions or keywords...",
  items = [
    {
      question: "Is the exported code really 100% independent?",
      answer:
        "Yes! Nexoraft exports standard Next.js 15 (App Router) or React (Vite) projects with zero proprietary runtime dependencies. You can run 'npm install && npm run build' and deploy anywhere.",
    },
    {
      question: "Can I manage multi-page websites and blog posts?",
      answer:
        "Absolutely. Nexoraft includes a built-in CMS dashboard for multi-page architectures, navigation menus, custom slugs, SEO metadata, and blog post collections.",
    },
    {
      question: "How do form submissions work?",
      answer:
        "In preview mode, leads are captured into your site's Submissions inbox. In exported Next.js code, a ready-to-run API route (/api/contact) is included for handling inquiries.",
    },
    {
      question: "Can I customize the design tokens and theme?",
      answer:
        "Yes. Set your brand primary/secondary colors, typography, and border radius in the Design System panel. All tokens map cleanly to CSS variables and Tailwind.",
    },
  ],
  style,
  className = "",
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter(
    (item) =>
      item.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section
      style={style}
      className={`py-16 sm:py-24 px-4 sm:px-8 bg-white dark:bg-slate-950 ${className}`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KNOWLEDGE BASE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              {subtitle}
            </p>
          )}

          {/* Interactive Live Search for FAQ */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No questions matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredItems.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                    isOpen
                      ? "border-blue-500/50 bg-blue-50/20 dark:bg-blue-950/20 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.question || "Question"}</span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isOpen
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3 animate-in fade-in duration-150">
                      {faq.answer || "Answer text."}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

// 12. Logo Strip Section (PRD 8.4)
const LogoStripSectionComponent: React.FC<
  BaseElementProps & {
    title?: string;
    items?: Array<{ name?: string }>;
  }
> = ({
  title = "POWERING WEBSITES FOR INNOVATIVE COMPANIES WORLDWIDE",
  items = [
    { name: "Acme Corp" },
    { name: "GlobalTech" },
    { name: "Vanguard" },
    { name: "Starlight UI" },
    { name: "NovaWave" },
  ],
  style,
  className = "",
}) => (
  <section
    style={style}
    className={`py-10 px-4 bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200/60 dark:border-slate-800/60 text-center ${className}`}
  >
    <div className="max-w-6xl mx-auto">
      <p className="text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-6">
        {title}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all">
        {items.map((logo, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 font-black text-slate-700 dark:text-slate-300 text-sm sm:text-base tracking-tight"
          >
            <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px]">
              {logo.name?.charAt(0) || "✦"}
            </div>
            <span>{logo.name || "Brand"}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 13. Pricing Section (Nexoraft Pro with Monthly/Annual Toggle)
const PricingSectionComponent: React.FC<
  BaseElementProps & {
    title?: string;
    subtitle?: string;
    annualDiscount?: string;
    items?: Array<{
      title?: string;
      price?: string;
      period?: string;
      description?: string;
      features?: string[];
      buttonText?: string;
      highlighted?: boolean;
    }>;
  }
> = ({
  title = "Transparent, Predictable Pricing",
  subtitle = "Choose the plan that fits your growth stage. Switch between monthly and annual billing to save 20%.",
  annualDiscount = "Save 20%",
  items = [
    {
      title: "Starter",
      price: "$0",
      period: "/month",
      description: "Perfect for testing ideas and personal portfolio websites.",
      features: [
        "1 Published Website",
        "Standard React Export",
        "Community Support",
        "Basic Analytics",
      ],
      buttonText: "Start Free",
    },
    {
      title: "Pro Creator",
      price: "$29",
      period: "/month",
      description: "For professionals and startups demanding velocity and scale.",
      features: [
        "Unlimited Websites",
        "Next.js & Vite Exporters",
        "Custom Domain Support",
        "Priority 24/7 Support",
        "Full Code Ownership",
      ],
      buttonText: "Go Pro",
      highlighted: true,
    },
    {
      title: "Enterprise",
      price: "$99",
      period: "/month",
      description: "Dedicated infrastructure, team collaboration, and SLA guarantees.",
      features: [
        "Custom Integrations",
        "Dedicated Account Manager",
        "SSO & SAML Security",
        "99.99% Uptime SLA",
      ],
      buttonText: "Contact Sales",
    },
  ],
  style,
  className = "",
}) => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section
      style={style}
      className={`py-16 sm:py-24 px-4 sm:px-8 bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>FLEXIBLE PLANS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {subtitle}
            </p>
          )}

          {/* Nexoraft Pro Billing Period Switcher */}
          <div className="mt-8 inline-flex items-center gap-3 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !isAnnual
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isAnnual
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-black animate-pulse">
                {annualDiscount}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {items.map((plan, idx) => {
            const isHigh = Boolean(plan.highlighted);
            const displayPrice = isAnnual && plan.price && !isNaN(parseInt(plan.price.replace(/[^0-9]/g, ""), 10)) && parseInt(plan.price.replace(/[^0-9]/g, ""), 10) > 0
              ? `$${Math.round(parseInt(plan.price.replace(/[^0-9]/g, ""), 10) * 0.8)}`
              : (plan.price || "$0");
            const displayPeriod = isAnnual ? "/mo (billed annually)" : (plan.period || "/month");

            return (
              <div
                key={idx}
                className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${
                  isHigh
                    ? "bg-white dark:bg-slate-900 border-2 border-blue-600 shadow-xl shadow-blue-500/10 relative"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg"
                }`}
              >
                {isHigh && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-600 text-white uppercase tracking-wider shadow-sm">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {plan.title || "Plan"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">
                    {plan.description}
                  </p>
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-slate-900 dark:text-white transition-all">
                      {displayPrice}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {displayPeriod}
                    </span>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    {(plan.features || ["Feature 1", "Feature 2"]).map(
                      (feat, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                        >
                          <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span>{feat}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className={`mt-8 w-full py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isHigh
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {plan.buttonText || "Choose Plan"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// 14. Call to Action Section (Nexoraft Pro with Live Newsletter Form)
const CallToActionSectionComponent: React.FC<
  BaseElementProps & { title?: string; subtitle?: string; buttonText?: string }
> = ({
  title = "Ready to launch your next big idea?",
  subtitle = "Join over 10,000+ creators building fast, modern websites with complete code ownership today.",
  buttonText = "Get Instant Access",
  style,
  className = "",
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("website-event:lead-submitted", {
          detail: {
            formName: "Newsletter CTA",
            name: "Subscriber",
            email,
            message: "Subscribed via Nexoraft CTA Banner",
            submittedAt: Date.now(),
          },
        })
      );
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
    }, 4000);
  };

  return (
    <section
      style={style}
      className={`py-16 sm:py-20 px-4 sm:px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-center shadow-xl ${className}`}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white mb-4 border border-white/20">
          ⚡ BOOST YOUR VELOCITY
        </span>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
          {title}
        </h2>
        <p className="text-blue-100 text-sm sm:text-base max-w-xl mb-8 leading-relaxed">
          {subtitle}
        </p>

        {isSubmitted ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span>You&apos;re subscribed! Check your inbox for access details.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="w-full max-w-md flex flex-col sm:flex-row items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/25 shadow-lg"
          >
            <div className="relative w-full">
              <Mail className="w-4 h-4 text-blue-200 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-transparent text-white placeholder-blue-200/80 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-blue-700 hover:bg-blue-50 transition-all shadow-md shrink-0 cursor-pointer"
            >
              {buttonText}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

// 14b. Nexoraft Pro Countdown Timer Section
const CountdownSectionComponent: React.FC<
  BaseElementProps & {
    title?: string;
    subtitle?: string;
    targetDays?: number;
    buttonText?: string;
    urgencyText?: string;
  }
> = ({
  title = "Limited Time Offer: Launch Special",
  subtitle = "Lock in lifetime early-access pricing before the countdown runs out.",
  buttonText = "Claim 50% Off Now",
  urgencyText = "⚡ SPECIAL EARLY BIRD ACCESS ENDS IN:",
  style,
  className = "",
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={style}
      className={`py-14 px-4 sm:px-8 bg-slate-900 text-white border-y border-slate-800 ${className}`}
    >
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 mb-4 animate-pulse">
          <Clock className="w-3.5 h-3.5" />
          <span>{urgencyText || "URGENT • OFFER CLOSING SOON"}</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
          {title}
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-md mb-8">
          {subtitle}
        </p>

        {/* Live Digital Flip Clocks */}
        <div className="grid grid-cols-4 gap-3 sm:gap-6 mb-8 max-w-md w-full">
          {[
            { label: "DAYS", val: timeLeft.days },
            { label: "HOURS", val: timeLeft.hours },
            { label: "MINS", val: timeLeft.minutes },
            { label: "SECS", val: timeLeft.seconds },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3 sm:p-4 flex flex-col items-center shadow-lg"
            >
              <span className="text-2xl sm:text-4xl font-black text-blue-400 font-mono tracking-tight">
                {String(item.val).padStart(2, "0")}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

// 14c. Nexoraft Pro Dynamic Posts Grid (Blog Loop)
const PostsGridSectionComponent: React.FC<
  BaseElementProps & {
    title?: string;
    subtitle?: string;
    items?: Array<{
      title?: string;
      category?: string;
      excerpt?: string;
      author?: string;
      date?: string;
      readTime?: string;
      image?: string;
    }>;
  }
> = ({
  title = "From the Nexoraft Publication",
  subtitle = "Tutorials, design system playbooks, and architectural deep-dives from our engineering team.",
  items = [
    {
      title: "Building High-Conversion Landing Pages with Nexoraft Pro Precision",
      category: "Design",
      excerpt: "Master responsive layout tokens, visual hierarchy, and CTA placement for maximum engagement.",
      author: "Sarah Chen",
      date: "Oct 20, 2026",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Zero-Lock-In Web Architecture: Exporting Clean Next.js 15 App Router Code",
      category: "Engineering",
      excerpt: "How our compiler outputs idiomatic React components, dynamic routes, and Tailwind classes without bloat.",
      author: "Marcus Miller",
      date: "Oct 18, 2026",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "The Modern Modular CMS Paradigm in 2026: Why Nexoraft Architecture Wins",
      category: "Product",
      excerpt: "Why organizing pages, blog posts, media assets, and form leads under a unified dashboard beats fragmented tools.",
      author: "Elena Rostova",
      date: "Oct 14, 2026",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    },
  ],
  style,
  className = "",
}) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Design", "Engineering", "Product"];

  const filtered = activeCategory === "All"
    ? items
    : items.filter((p) => p.category === activeCategory);

  return (
    <section
      style={style}
      className={`py-16 sm:py-24 px-4 sm:px-8 bg-white dark:bg-slate-950 ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DYNAMIC POSTS LOOP</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                {subtitle}
              </p>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((post, idx) => (
            <article
              key={idx}
              className="group rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-xl hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title || "Post thumbnail"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {post.category || "General"}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{post.author}</span>
                </span>
                <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

// 14d. Nexoraft Pro Team Showcase Section
const TeamSectionComponent: React.FC<
  BaseElementProps & {
    title?: string;
    subtitle?: string;
    items?: Array<{
      name?: string;
      role?: string;
      avatar?: string;
      bio?: string;
    }>;
  }
> = ({
  title = "Meet the Minds Behind the Vision",
  subtitle = "Designers, builders, and engineers united by a obsession with visual craft and developer freedom.",
  items = [
    {
      name: "Arham Ahmed",
      role: "Lead Systems Architect & Founder",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Pioneering visual CMS architecture with zero runtime lock-in.",
    },
    {
      name: "Sophia Zhang",
      role: "Head of Product Design",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      bio: "Crafting Nexoraft Pro visual drag & drop primitives.",
    },
    {
      name: "Liam O'Connor",
      role: "Next.js Compiler Specialist",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Optimizing 1-click multi-page AST exporters and type generators.",
    },
  ],
  style,
  className = "",
}) => (
  <section
    style={style}
    className={`py-16 sm:py-24 px-4 sm:px-8 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800 ${className}`}
  >
    <div className="max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 mb-3">
          <User className="w-3.5 h-3.5" />
          <span>LEADERSHIP</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((member, idx) => (
          <div
            key={idx}
            className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.avatar}
              alt={member.name || "Team Member"}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-500/20 group-hover:ring-blue-500 transition-all mb-4 shadow-md"
            />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {member.name}
            </h3>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
              {member.role}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              {member.bio}
            </p>

            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-slate-400">
              <span className="hover:text-blue-500 cursor-pointer p-1 transition-colors" title="Twitter / X">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </span>
              <span className="hover:text-blue-600 cursor-pointer p-1 transition-colors" title="LinkedIn">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </span>
              <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer p-1 transition-colors" title="GitHub">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 14e. Nexoraft Pro Video Showcase Section
const VideoSectionComponent: React.FC<
  BaseElementProps & {
    title?: string;
    subtitle?: string;
    thumbnail?: string;
    badge?: string;
  }
> = ({
  title = "Watch How Nexoraft Ships in Minutes",
  subtitle = "A complete walkthrough of the Nexoraft CMS dashboard, Nexoraft Visual Studio canvas, and Next.js 15 App Router export.",
  thumbnail = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  badge = "✦ FEATURE SHOWCASE",
  style,
  className = "",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section
      style={style}
      className={`py-16 sm:py-24 px-4 sm:px-8 bg-white dark:bg-slate-950 ${className}`}
    >
      <div className="max-w-5xl mx-auto text-center">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-3 inline-block">
          {badge}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-10">
          {subtitle}
        </p>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 aspect-video flex items-center justify-center group">
          {isPlaying ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-white p-6">
              <Sparkles className="w-12 h-12 text-blue-400 mb-3 animate-spin" />
              <p className="text-sm font-semibold">Interactive Video Preview Playing</p>
              <button
                type="button"
                onClick={() => setIsPlaying(false)}
                className="mt-4 px-4 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-white"
              >
                Close Video
              </button>
            </div>
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnail}
                alt="Video showcase thumbnail"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" />
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                title="Play Demo Video"
                className="absolute z-10 w-20 h-20 rounded-full bg-blue-600/95 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 group-hover:scale-110 transition-all cursor-pointer ring-8 ring-white/20 animate-pulse"
              >
                <Play className="w-8 h-8 fill-white translate-x-0.5" />
              </button>
              <span className="absolute bottom-4 left-4 z-10 text-[11px] font-bold text-white/90 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                1080p HD • 3:45 Walkthrough
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

// 14f. Bento Grid Section (Nexoraft Pro Bento Architecture)
export interface BentoGridProps extends BaseElementProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  card1Tag?: string;
  card1Title?: string;
  card1Desc?: string;
  card2Score?: string;
  card2Tag?: string;
  card2Title?: string;
  card3Tag?: string;
  card3Title?: string;
  card3Desc?: string;
  card4Tag?: string;
  card4Title?: string;
  card4Desc?: string;
}

const BentoGridSectionComponent: React.FC<BentoGridProps> = ({
  badge = "✨ NEXORAFT PRO BENTO ENGINE",
  title = "Precision-Engineered for Speed, Scale & Visual Craft",
  subtitle = "Every module is designed to maximize conversion, edge delivery, and production code fidelity with zero runtime weight.",
  card1Tag = "EDGE COMPUTING",
  card1Title = "Global Sub-10ms TTFB Distribution",
  card1Desc = "Pre-rendered static HTML and assets distributed globally across 300+ edge locations with zero runtime overhead or vendor lock-in.",
  card2Score = "100/100",
  card2Tag = "PERFORMANCE SCORE",
  card2Title = "Flawless Lighthouse Metrics",
  card3Tag = "CODE PORTABILITY",
  card3Title = "1-Click React & Next.js 15 Export",
  card3Desc = "Extract clean, modular TSX code with Tailwind CSS utilities and zero external dependencies.",
  card4Tag = "INTEGRATED CMS",
  card4Title = "Built-in CMS & Lead Capture",
  card4Desc = "Manage pages, blog posts, navigation menus, and lead captures without external plugins.",
  style,
  className = "",
}) => {
  return (
    <section
      style={style}
      className={`py-16 sm:py-24 px-4 sm:px-8 bg-slate-900 text-white relative overflow-hidden ${className}`}
    >
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{badge}</span>
            </div>
          )}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bento Card 1: 2-column span */}
          <div className="md:col-span-2 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 shadow-xl relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                {card1Tag}
              </span>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>300+ Edge Nodes Active</span>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {card1Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl mb-6">
              {card1Desc}
            </p>

            {/* Interactive Visual Element */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-800">
                <span>Route: /api/edge-stream</span>
                <span className="text-emerald-400 font-bold">200 OK • 6.4ms</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">Edge Cache Hit: 99.8% (Cloudflare &amp; Vercel Edge Networks)</span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: 1-column span (Performance Gauge) */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 shadow-xl flex flex-col justify-between group hover:border-emerald-500/50 transition-all duration-300">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {card2Tag}
              </span>
              <div className="my-6 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-extrabold text-2xl shadow-lg shadow-emerald-500/20">
                  {card2Score}
                </div>
                <div className="mt-3 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Core Web Vitals Pass</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">{card2Title}</h3>
              <p className="text-xs text-slate-400">Zero cumulative layout shift, instant edge rendering.</p>
            </div>
          </div>

          {/* Bento Card 3: 1-column span */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 shadow-xl flex flex-col justify-between group hover:border-indigo-500/50 transition-all duration-300">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                {card3Tag}
              </span>
              <h3 className="text-lg font-bold text-white mt-4 mb-2">
                {card3Title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {card3Desc}
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-400">
              <span>Next.js 15 &amp; React Vite</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bento Card 4: 2-column span */}
          <div className="md:col-span-2 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 shadow-xl group hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                {card4Tag}
              </span>
              <span className="text-[10px] text-slate-400">Multi-page routing ready</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{card4Title}</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
              {card4Desc}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-white font-bold block">1-Click</span>
                <span className="text-[10px] text-slate-400">Page Creator</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-white font-bold block">Dynamic</span>
                <span className="text-[10px] text-slate-400">Post Loops</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-white font-bold block">CSV</span>
                <span className="text-[10px] text-slate-400">Lead Export</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-white font-bold block">SEO Meta</span>
                <span className="text-[10px] text-slate-400">Slug Control</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 14g. Timeline / Process Section (Nexoraft Pro Workflow Roadmap)
export interface TimelineProps extends BaseElementProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  items?: Array<{ step?: string; title?: string; description?: string; tag?: string }>;
}

const TimelineSectionComponent: React.FC<TimelineProps> = ({
  badge = "✨ STREAMLINED WORKFLOW",
  title = "From Visual Idea to Production Code in 4 Steps",
  subtitle = "How creators, marketing teams, and developers ship extraordinary web experiences in record time with Nexoraft.",
  items = [
    {
      step: "01",
      title: "Visual Page Architecture",
      description: "Compose multi-column sections, headers, bento grids, and pro widgets with real-time responsive controls.",
      tag: "Design Studio",
    },
    {
      step: "02",
      title: "Dynamic Content & Widgets",
      description: "Configure pricing tiers with monthly/annual toggles, searchable FAQ accordions, countdown timers, and forms.",
      tag: "Pro Modules",
    },
    {
      step: "03",
      title: "CMS & SEO Governance",
      description: "Publish blog articles, manage navigation menus, customize URL slugs, and optimize OpenGraph metadata.",
      tag: "CMS Engine",
    },
    {
      step: "04",
      title: "Production Code Export",
      description: "Download a clean, fully typed Next.js 15 App Router codebase ready to deploy to Vercel, Netlify, or any cloud host.",
      tag: "Zero Lock-In",
    },
  ],
  style,
  className = "",
}) => {
  return (
    <section
      style={style}
      className={`py-16 sm:py-24 px-4 sm:px-8 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{badge}</span>
            </div>
          )}
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Steps Grid with connected timeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {items.map((step, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-blue-500/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    {step.step || `0${idx + 1}`}
                  </div>
                  {step.tag && (
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full">
                      {step.tag}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Production Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 14h. Dedicated Newsletter Lead Magnet Section (Nexoraft Pro Conversion)
export interface NewsletterProps extends BaseElementProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  placeholder?: string;
  disclaimer?: string;
}

const NewsletterSectionComponent: React.FC<NewsletterProps> = ({
  badge = "✨ WEEKLY ENGINEERING DISPATCH",
  title = "Stay Ahead of Modern Web Craft & Architecture",
  subtitle = "Join 25,000+ developers, designers, and founders receiving curated production components, Next.js 15 guides, and visual builder release updates.",
  buttonText = "Subscribe Free",
  placeholder = "Enter your work email address...",
  disclaimer = "🔒 No spam ever • Instant 1-click unsubscribe • Includes free Starter Template Kit",
  style,
  className = "",
}) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("website-event:lead-submitted", {
          detail: {
            formName: "Newsletter Lead Magnet",
            email: email,
            message: "Subscribed to Weekly Engineering Dispatch",
            submittedAt: Date.now(),
          },
        })
      );
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
    }, 4500);
  };

  return (
    <section
      style={style}
      className={`py-16 sm:py-24 px-4 sm:px-8 bg-white dark:bg-slate-950 ${className}`}
    >
      <div className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl relative overflow-hidden">
        {/* Ambient decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          {badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div>
          )}

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {title}
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-blue-100 leading-relaxed">
            {subtitle}
          </p>

          {submitted ? (
            <div className="mt-8 p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span>🎉 You are on the VIP list! Check your inbox for the starter kit.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-2.5 max-w-lg mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-4 py-3 rounded-xl bg-white/95 text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-white shadow-inner"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl font-bold text-xs bg-slate-900 hover:bg-black text-white transition-all shadow-lg shadow-black/25 shrink-0 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{buttonText}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {disclaimer && (
            <p className="mt-4 text-[11px] text-blue-200">
              {disclaimer}
            </p>
          )}

          {/* Social Proof Avatars */}
          <div className="mt-6 pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-3 text-xs text-blue-100">
            <div className="flex -space-x-2">
              {["A", "M", "S", "E", "T"].map((char, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                >
                  {char}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 text-amber-300 text-xs font-bold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-300" />
              ))}
            </div>
            <span className="font-semibold">Joined by 25,000+ creators</span>
          </div>
        </div>
      </div>
    </section>
  );
};


// 15. Contact Section with Lead Capture
const ContactSectionComponent: React.FC<
  BaseElementProps & { title?: string; subtitle?: string }
> = ({
  title = "Get in Touch with Our Team",
  subtitle = "Have questions or need assistance? Send us a message and we'll reply promptly.",
  style,
  className = "",
}) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("website-event:lead-submitted", {
          detail: {
            formName: "Contact Form",
            name: formData.name,
            email: formData.email,
            message: formData.message,
            submittedAt: Date.now(),
          },
        })
      );
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section
      style={style}
      className={`py-16 sm:py-20 px-4 sm:px-8 bg-white dark:bg-slate-950 ${className}`}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {subtitle}
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
              Message Received!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
              Thank you for reaching out. We have logged your submission into the
              Nexoraft Leads inbox.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-50 dark:bg-slate-900/80 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Alex Johnson"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="alex@company.com"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Message
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Tell us what you are looking to build..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

// 16. Footer Section
const FooterSectionComponent: React.FC<
  BaseElementProps & { title?: string; content?: string }
> = ({
  title = "Nexoraft Studio",
  content = "The visual website builder for modern creators and engineering teams. Export to Next.js in seconds.",
  style,
  className = "",
}) => (
  <footer
    style={style}
    className={`py-10 px-4 sm:px-8 bg-slate-900 text-slate-400 border-t border-slate-800 ${className}`}
  >
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
      <div>
        <span className="text-base font-bold text-white tracking-tight">
          {title}
        </span>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">{content}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400">
        <span className="hover:text-white cursor-pointer transition-colors">
          Features
        </span>
        <span className="hover:text-white cursor-pointer transition-colors">
          Pricing
        </span>
        <span className="hover:text-white cursor-pointer transition-colors">
          Privacy
        </span>
        <span className="hover:text-white cursor-pointer transition-colors">
          Terms
        </span>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
      © 2026 {title}. Exported project ready for production.
    </div>
  </footer>
);

// 17. Divider & Spacer Components
const DividerComponent: React.FC<
  BaseElementProps & { variant?: "solid" | "dashed" | "gradient" }
> = ({ variant = "solid", style, className = "" }) => {
  const lineStyle = {
    solid: "border-b border-slate-200 dark:border-slate-800",
    dashed: "border-b border-dashed border-slate-300 dark:border-slate-700",
    gradient:
      "h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent",
  }[variant || "solid"];

  return (
    <div style={style} className={`my-8 w-full ${lineStyle} ${className}`} />
  );
};

const SpacerComponent: React.FC<BaseElementProps & { height?: number }> = ({
  height = 40,
  style,
  className = "",
}) => (
  <div
    style={{ ...style, height: `${height}px` }}
    className={`w-full ${className}`}
  />
);

// 18. Card Component (PRD 8.4)
const CardComponent: React.FC<
  BaseElementProps & {
    title?: string;
    description?: string;
    buttonText?: string;
    src?: string;
  }
> = ({
  title = "Modular Feature Card",
  description = "A versatile container to highlight offerings, products, or service highlights.",
  buttonText = "Read More",
  src,
  style,
  className = "",
}) => (
  <div
    style={style}
    className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between my-3 ${className}`}
  >
    {src && (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={src}
        alt={title}
        className="w-full h-40 object-cover rounded-xl mb-4"
      />
    )}
    <div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
        {title}
      </h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        {description}
      </p>
    </div>
    {buttonText && (
      <button
        type="button"
        className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white w-fit cursor-pointer"
      >
        {buttonText}
      </button>
    )}
  </div>
);

// 19. Form Input Components
const TextInputComponent: React.FC<
  BaseElementProps & {
    placeholder?: string;
    required?: boolean;
    defaultValue?: string;
  }
> = ({
  label = "Text Field",
  placeholder = "Enter text...",
  required = false,
  defaultValue = "",
  style,
  className = "",
}) => (
  <div style={style} className={`flex flex-col gap-1.5 w-full my-2 ${className}`}>
    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
    />
  </div>
);

const TextAreaComponent: React.FC<
  BaseElementProps & {
    placeholder?: string;
    rows?: number;
    defaultValue?: string;
  }
> = ({
  label = "Text Area",
  placeholder = "Enter details...",
  rows = 3,
  defaultValue = "",
  style,
  className = "",
}) => (
  <div style={style} className={`flex flex-col gap-1.5 w-full my-2 ${className}`}>
    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
      {label}
    </label>
    <textarea
      rows={rows}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all resize-y"
    />
  </div>
);

const SelectComponent: React.FC<
  BaseElementProps & { options?: { label: string; value: string }[] }
> = ({
  label = "Select Option",
  options = [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" },
  ],
  style,
  className = "",
}) => (
  <div style={style} className={`flex flex-col gap-1.5 w-full my-2 ${className}`}>
    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
      {label}
    </label>
    <select className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all">
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const CheckboxComponent: React.FC<
  BaseElementProps & { checkboxLabel?: string }
> = ({
  checkboxLabel = "I agree to terms",
  style,
  className = "",
}) => (
  <label
    style={style}
    className={`flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300 my-2 ${className}`}
  >
    <input
      type="checkbox"
      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
    />
    <span>{checkboxLabel}</span>
  </label>
);

// Registry of componentTypes
export const componentTypes: Record<
  string,
  ComponentType<Record<string, unknown>>
> = {
  Container: withEditable(withDrop(Container)) as unknown as ComponentType<
    Record<string, unknown>
  >,
  NavbarSection: withEditable(
    NavbarSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  HeroSection: withEditable(HeroSectionComponent) as unknown as ComponentType<
    Record<string, unknown>
  >,
  FeatureGridSection: withEditable(
    FeatureGridSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  StatsSection: withEditable(
    StatsSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  TestimonialsSection: withEditable(
    TestimonialsSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  FAQSection: withEditable(FAQSectionComponent) as unknown as ComponentType<
    Record<string, unknown>
  >,
  LogoStripSection: withEditable(
    LogoStripSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  PricingSection: withEditable(
    PricingSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  CallToActionSection: withEditable(
    CallToActionSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  CountdownSection: withEditable(
    CountdownSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  CountdownTimer: withEditable(
    CountdownSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  PostsGridSection: withEditable(
    PostsGridSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  PostsGrid: withEditable(
    PostsGridSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  TeamSection: withEditable(
    TeamSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  TeamGrid: withEditable(
    TeamSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  VideoSection: withEditable(
    VideoSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  BentoGridSection: withEditable(
    BentoGridSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  BentoGrid: withEditable(
    BentoGridSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  TimelineSection: withEditable(
    TimelineSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  ProcessSection: withEditable(
    TimelineSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  WorkflowSection: withEditable(
    TimelineSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  NewsletterSection: withEditable(
    NewsletterSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  LeadMagnetSection: withEditable(
    NewsletterSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  StatsCounterSection: withEditable(
    StatsSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  MetricsSection: withEditable(
    StatsSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  ContactSection: withEditable(
    ContactSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  FooterSection: withEditable(
    FooterSectionComponent
  ) as unknown as ComponentType<Record<string, unknown>>,
  Card: withEditable(CardComponent) as unknown as ComponentType<
    Record<string, unknown>
  >,
  Divider: withEditable(DividerComponent) as unknown as ComponentType<
    Record<string, unknown>
  >,
  Spacer: withEditable(SpacerComponent) as unknown as ComponentType<
    Record<string, unknown>
  >,
  Heading: withEditable(HeadingComponent) as unknown as ComponentType<
    Record<string, unknown>
  >,
  Text: withEditable(TextComponent) as unknown as ComponentType<
    Record<string, unknown>
  >,
  Badge: withEditable(BadgeComponent) as unknown as ComponentType<
    Record<string, unknown>
  >,
  Image: withEditable(ImageComponent) as unknown as ComponentType<
    Record<string, unknown>
  >,
  Button: withEditable(ButtonComponent) as unknown as ComponentType<
    Record<string, unknown>
  >,
  TextInput: withEditable(TextInputComponent) as unknown as ComponentType<
    Record<string, unknown>
  >,
  Input: withEditable(TextInputComponent) as unknown as ComponentType<
    Record<string, unknown>
  >,
  TextArea: withEditable(TextAreaComponent) as unknown as ComponentType<
    Record<string, unknown>
  >,
  Select: withEditable(SelectComponent) as unknown as ComponentType<
    Record<string, unknown>
  >,
  Dropdown: withEditable(SelectComponent) as unknown as ComponentType<
    Record<string, unknown>
  >,
  Checkbox: withEditable(CheckboxComponent) as unknown as ComponentType<
    Record<string, unknown>
  >,
};

export default componentTypes;

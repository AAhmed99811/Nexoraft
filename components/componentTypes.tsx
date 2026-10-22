"use client";

import React, { ComponentType } from "react";
import Container from "./Container";
import withDrop from "./hoc/withDragAndDrop";
import withEditable from "./hoc/withEditable";
import { Sparkles, ArrowRight, Check, Send } from "lucide-react";

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
const HeadingComponent: React.FC<BaseElementProps & { title?: string; subtitle?: string; level?: string }> = ({
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
  <p style={style} className={`text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed my-2 ${className}`}>
    {content}
  </p>
);

// 3. Button Component
const ButtonComponent: React.FC<
  BaseElementProps & { buttonText?: string; variant?: "primary" | "secondary" | "outline" | "danger" }
> = ({ buttonText = "Explore Features", variant = "primary", style, className = "" }) => {
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20",
    secondary: "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700",
    outline: "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20",
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
const ImageComponent: React.FC<BaseElementProps & { src?: string; alt?: string }> = ({
  src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  alt = "Website preview",
  style,
  className = "",
}) => (
  <div style={style} className={`relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg my-4 ${className}`}>
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
  title = "WebCraft",
  subtitle,
  buttonText = "Get Started",
  items = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
    { label: "Docs", href: "#docs" },
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
          {title.charAt(0) || "W"}
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
          <span key={idx} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
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
  badge = "✨ NEXT-GEN WEBSITE BUILDER",
  title = "Ship Beautiful Web Experiences at Light Speed",
  subtitle = "The modern visual website canvas engineered for high conversion, responsive fidelity, and instant Next.js & React project export.",
  buttonText = "Start Free Trial",
  buttonSecondaryText = "Watch Demo",
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
  title = "Engineered for Velocity & Scale",
  subtitle = "Everything you need to turn ideas into fully deployed web experiences with zero friction.",
  items = [
    {
      title: "Visual Drag & Drop",
      description: "Intuitive canvas inspired by modern publishing workflows. Create and style layouts in seconds.",
    },
    {
      title: "1-Click Next.js Export",
      description: "Export clean, production-ready Next.js 16 and React code with Tailwind CSS styling and TSX types.",
    },
    {
      title: "Instant Deployment",
      description: "Ready-to-deploy zip bundles configured for Vercel, Netlify, and Cloudflare Pages out of the box.",
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

// 9. Pricing Section
const PricingSectionComponent: React.FC<
  BaseElementProps & {
    title?: string;
    subtitle?: string;
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
  subtitle = "Choose the plan that fits your growth stage. Upgrade or cancel anytime.",
  items = [
    {
      title: "Starter",
      price: "$0",
      period: "/month",
      description: "Perfect for testing ideas and personal portfolio websites.",
      features: ["1 Published Website", "Standard React Export", "Community Support", "Basic Analytics"],
      buttonText: "Start Free",
    },
    {
      title: "Pro Creator",
      price: "$29",
      period: "/month",
      description: "For professionals and startups demanding velocity and scale.",
      features: ["Unlimited Websites", "Next.js & Vite Exporters", "Custom Domain Support", "Priority 24/7 Support", "Full Code Ownership"],
      buttonText: "Go Pro",
      highlighted: true,
    },
    {
      title: "Enterprise",
      price: "$99",
      period: "/month",
      description: "Dedicated infrastructure, team collaboration, and SLA guarantees.",
      features: ["Custom Integrations", "Dedicated Account Manager", "SSO & SAML Security", "99.99% Uptime SLA"],
      buttonText: "Contact Sales",
    },
  ],
  style,
  className = "",
}) => (
  <section
    style={style}
    className={`py-16 sm:py-24 px-4 sm:px-8 bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 ${className}`}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {items.map((plan, idx) => {
          const isHigh = Boolean(plan.highlighted);
          return (
            <div
              key={idx}
              className={`rounded-2xl p-7 flex flex-col justify-between transition-all ${
                isHigh
                  ? "bg-white dark:bg-slate-900 border-2 border-blue-600 shadow-xl relative"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
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
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {plan.description}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">
                    {plan.price || "$0"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {plan.period || "/month"}
                  </span>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  {(plan.features || ["Feature 1", "Feature 2"]).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className={`mt-8 w-full py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                  isHigh
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
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

// 10. Call to Action Section
const CallToActionSectionComponent: React.FC<
  BaseElementProps & { title?: string; subtitle?: string; buttonText?: string }
> = ({
  title = "Ready to launch your next big idea?",
  subtitle = "Join over 10,000+ creators building fast, modern websites today.",
  buttonText = "Build Your Website Now",
  style,
  className = "",
}) => (
  <section
    style={style}
    className={`py-16 px-4 sm:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center ${className}`}
  >
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
        {title}
      </h2>
      <p className="text-blue-100 text-sm sm:text-base max-w-xl mb-7">
        {subtitle}
      </p>
      <button
        type="button"
        className="px-7 py-3 rounded-xl font-bold text-sm bg-white text-blue-700 shadow-xl hover:bg-blue-50 transition-all cursor-pointer"
      >
        {buttonText}
      </button>
    </div>
  </section>
);

// 11. Contact Section
const ContactSectionComponent: React.FC<
  BaseElementProps & { title?: string; subtitle?: string }
> = ({
  title = "Get in Touch with Our Team",
  subtitle = "Have questions or need assistance? Send us a message and we'll reply promptly.",
  style,
  className = "",
}) => (
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

      <div className="bg-slate-50 dark:bg-slate-900/80 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Name
            </label>
            <input
              type="text"
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
            placeholder="Tell us what you are looking to build..."
            className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Send Message</span>
        </button>
      </div>
    </div>
  </section>
);

// 12. Footer Section
const FooterSectionComponent: React.FC<
  BaseElementProps & { title?: string; content?: string }
> = ({
  title = "WebCraft Studio",
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
        <span className="text-base font-bold text-white tracking-tight">{title}</span>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">{content}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400">
        <span className="hover:text-white cursor-pointer transition-colors">Features</span>
        <span className="hover:text-white cursor-pointer transition-colors">Pricing</span>
        <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
        <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
      © 2026 {title}. Exported project ready for production.
    </div>
  </footer>
);

// 13. Form Input Components
const TextInputComponent: React.FC<
  BaseElementProps & { placeholder?: string; required?: boolean; defaultValue?: string }
> = ({ label = "Text Field", placeholder = "Enter text...", required = false, defaultValue = "", style, className = "" }) => (
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
  BaseElementProps & { placeholder?: string; rows?: number; defaultValue?: string }
> = ({ label = "Text Area", placeholder = "Enter details...", rows = 3, defaultValue = "", style, className = "" }) => (
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
    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</label>
    <select className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all">
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const CheckboxComponent: React.FC<BaseElementProps & { checkboxLabel?: string }> = ({
  checkboxLabel = "I agree to terms",
  style,
  className = "",
}) => (
  <label style={style} className={`flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300 my-2 ${className}`}>
    <input
      type="checkbox"
      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
    />
    <span>{checkboxLabel}</span>
  </label>
);

// Registry of componentTypes
export const componentTypes: Record<string, ComponentType<Record<string, unknown>>> = {
  Container: withEditable(withDrop(Container)) as unknown as ComponentType<Record<string, unknown>>,
  NavbarSection: withEditable(NavbarSectionComponent) as unknown as ComponentType<Record<string, unknown>>,
  HeroSection: withEditable(HeroSectionComponent) as unknown as ComponentType<Record<string, unknown>>,
  FeatureGridSection: withEditable(FeatureGridSectionComponent) as unknown as ComponentType<Record<string, unknown>>,
  PricingSection: withEditable(PricingSectionComponent) as unknown as ComponentType<Record<string, unknown>>,
  CallToActionSection: withEditable(CallToActionSectionComponent) as unknown as ComponentType<Record<string, unknown>>,
  ContactSection: withEditable(ContactSectionComponent) as unknown as ComponentType<Record<string, unknown>>,
  FooterSection: withEditable(FooterSectionComponent) as unknown as ComponentType<Record<string, unknown>>,
  Heading: withEditable(HeadingComponent) as unknown as ComponentType<Record<string, unknown>>,
  Text: withEditable(TextComponent) as unknown as ComponentType<Record<string, unknown>>,
  Badge: withEditable(BadgeComponent) as unknown as ComponentType<Record<string, unknown>>,
  Image: withEditable(ImageComponent) as unknown as ComponentType<Record<string, unknown>>,
  Button: withEditable(ButtonComponent) as unknown as ComponentType<Record<string, unknown>>,
  TextInput: withEditable(TextInputComponent) as unknown as ComponentType<Record<string, unknown>>,
  Input: withEditable(TextInputComponent) as unknown as ComponentType<Record<string, unknown>>,
  TextArea: withEditable(TextAreaComponent) as unknown as ComponentType<Record<string, unknown>>,
  Select: withEditable(SelectComponent) as unknown as ComponentType<Record<string, unknown>>,
  Dropdown: withEditable(SelectComponent) as unknown as ComponentType<Record<string, unknown>>,
  Checkbox: withEditable(CheckboxComponent) as unknown as ComponentType<Record<string, unknown>>,
};

export default componentTypes;

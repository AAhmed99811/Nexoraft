"use client";

import React, { forwardRef } from "react";
import { Plus, LayoutTemplate } from "lucide-react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  isEditable?: boolean;
  isPreview?: boolean;
  data?: Record<string, unknown>;
  focusedSubTree?: string[] | null;
  myRenderIndex?: number;
  parent?: string;
  imageBaseUrl?: string;
  getVariableValue?: (varName: string) => unknown;
  useVisible?: (visibleRule: unknown) => boolean;
  onDropItem?: (targetId: string, itemData: unknown) => void;
  elementType?: string;
  isPersist?: boolean;
  isRoot?: boolean;
  visible?: unknown;
  label?: string;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (props, ref) => {
    const {
      id,
      style = {},
      className = "",
      children,
      isEditable = true,
      isPreview = false,
      data: _data,
      focusedSubTree: _focusedSubTree,
      myRenderIndex: _myRenderIndex,
      parent: _parent,
      imageBaseUrl: _imageBaseUrl,
      getVariableValue: _getVariableValue,
      useVisible: _useVisible,
      onDropItem: _onDropItem,
      elementType: _elementType,
      isPersist: _isPersist,
      isRoot: _isRoot,
      visible: _visible,
      label: _label,
      ...domProps
    } = props;

    // Suppress unused variables by referencing them if needed or purely pass domProps
    void _data;
    void _focusedSubTree;
    void _myRenderIndex;
    void _parent;
    void _imageBaseUrl;
    void _getVariableValue;
    void _useVisible;
    void _onDropItem;
    void _elementType;
    void _isPersist;
    void _isRoot;
    void _visible;
    void _label;

    const hasChildren = React.Children.count(children) > 0;

    const handleQuickInsert = (type: string, label: string) => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("nexoraft-insert-element", {
            detail: { type, label },
          })
        );
      }
    };

    return (
      <div
        ref={ref}
        id={id}
        data-testid="container"
        className={`relative transition-all duration-150 ${className}`}
        style={style}
        {...domProps}
      >
        {children}

        {/* Empty container helper in editor mode */}
        {!hasChildren && !isPreview && isEditable && (
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-slate-300 dark:border-slate-700/80 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 text-center my-4 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2.5 shadow-xs">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
              Empty Container — Drag or add elements here
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mb-3.5 leading-relaxed">
              Click any element from the left dock to insert it, or start quickly with a pre-configured section:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickInsert("HeroSection", "Hero Banner");
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Hero Banner</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickInsert("NavbarSection", "Navigation Bar");
                }}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Navbar</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickInsert("FeatureGridSection", "Features Grid");
                }}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Features Grid</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

Container.displayName = "Container";

export default Container;

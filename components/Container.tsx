"use client";

import React, { forwardRef } from "react";

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
          <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-400 dark:text-slate-500 text-xs text-center font-medium">
            Empty Container — Drag or add elements here
          </div>
        )}
      </div>
    );
  }
);

Container.displayName = "Container";

export default Container;

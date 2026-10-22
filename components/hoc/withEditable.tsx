"use client";

import React, { ComponentType, useState } from "react";
import { useFormBuilderState } from "../context/FormBuilderContext";

export interface WithEditableProps {
  id?: string;
  isEditable?: boolean;
  isPreview?: boolean;
  label?: string;
  elementType?: string;
  [key: string]: unknown;
}

export function withEditable<P extends object>(
  WrappedComponent: ComponentType<P>
): React.FC<P & WithEditableProps> {
  const ComponentWithEditable: React.FC<P & WithEditableProps> = ({
    isEditable = true,
    isPreview = false,
    id,
    label,
    elementType,
    ...props
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const context = useFormBuilderState();
    const isSelected = id && context?.focusedElement === id;

    if (isPreview || !isEditable) {
      return (
        <WrappedComponent
          {...(props as P)}
          id={id}
          isEditable={isEditable}
          isPreview={isPreview}
        />
      );
    }

    const handleClick = (e: React.MouseEvent) => {
      if (!id) return;
      e.stopPropagation();
      context?.setFocusedElement?.(id);
      context?.setSelectedElement?.(id);
    };

    return (
      <div
        onClick={handleClick}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setIsHovered(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setIsHovered(false);
        }}
        className={`group/editable relative transition-all duration-150 rounded-md cursor-pointer ${
          isSelected
            ? "ring-2 ring-blue-600 ring-offset-1 shadow-xs"
            : isHovered
            ? "ring-1 ring-blue-400/70"
            : ""
        }`}
        data-editable="true"
        data-element-id={id}
      >
        {/* Floating Tag/Badge for Builder */}
        {(isSelected || isHovered) && (
          <div className="absolute -top-3 left-2 z-30 pointer-events-none flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-blue-600 text-white shadow-xs">
            <span>{label || elementType || "Element"}</span>
            {id && <span className="opacity-75 font-mono text-[9px]">#{id.slice(-4)}</span>}
          </div>
        )}

        <WrappedComponent
          {...(props as P)}
          id={id}
          isEditable={isEditable}
          isPreview={isPreview}
        />
      </div>
    );
  };

  ComponentWithEditable.displayName = `WithEditable(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ComponentWithEditable;
}

export default withEditable;

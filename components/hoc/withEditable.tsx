"use client";

import React, { ComponentType, useState } from "react";
import { useFormBuilderState, elementSlice } from "../context/FormBuilderContext";
import { Edit2, Copy, Trash2, GripVertical, Plus } from "lucide-react";

export interface WithEditableProps {
  id?: string;
  isEditable?: boolean;
  isPreview?: boolean;
  label?: string;
  elementType?: string;
  [key: string]: unknown;
}

const { addElement, removeElement } = elementSlice;

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
    const isSection =
      elementType === "Container" ||
      (elementType && elementType.toLowerCase().includes("section"));

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

    const handleDuplicate = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!id || !context?.elements[id]) return;
      const target = context.elements[id];
      const newId = `elem-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
      const cloned = JSON.parse(JSON.stringify(target));
      cloned.id = newId;
      cloned.label = `${target.label || target.elementType || "Element"} (Copy)`;
      const parentId = context.pages[context.activePage]?.rootElementId || "root";
      context.dispatch(addElement(parentId, cloned));
    };

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!id) return;
      context.dispatch(removeElement({ id }));
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
            ? "ring-2 ring-blue-600 ring-offset-2 shadow-xs"
            : isHovered
            ? "ring-1 ring-blue-400/80 ring-offset-1"
            : ""
        }`}
        data-editable="true"
        data-element-id={id}
      >
        {/* Elementor Pro Section Top Handle [ + | ::: | X ] */}
        {isSection && (isSelected || isHovered) && (
          <div
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-40 flex items-center bg-blue-600 text-white rounded-full px-2 py-0.5 shadow-md text-[10px] font-bold gap-1 animate-in fade-in duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleDuplicate}
              title="Duplicate Section"
              className="hover:text-blue-200 p-0.5"
            >
              <Plus className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-0.5 cursor-grab">
              <GripVertical className="w-3 h-3" />
              <span className="text-[9px] uppercase tracking-wider">
                {label || elementType || "Section"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              title="Delete Section"
              className="hover:text-red-200 p-0.5"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Elementor Widget Action Pill [ Name | Duplicate | Delete ] */}
        {!isSection && (isSelected || isHovered) && (
          <div
            className="absolute -top-3.5 right-2 z-40 flex items-center bg-blue-600 text-white rounded-lg px-2 py-0.5 shadow-md text-[10px] font-bold gap-1.5 animate-in fade-in duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1 font-semibold">
              <Edit2 className="w-2.5 h-2.5" />
              <span className="text-[10px] max-w-[90px] truncate">
                {label || elementType || "Widget"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleDuplicate}
              title="Duplicate"
              className="hover:text-blue-200 p-0.5"
            >
              <Copy className="w-2.5 h-2.5" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              title="Delete"
              className="hover:text-red-200 p-0.5"
            >
              <Trash2 className="w-2.5 h-2.5" />
            </button>
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

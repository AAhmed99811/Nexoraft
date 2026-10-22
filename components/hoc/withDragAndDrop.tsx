"use client";

import React, { ComponentType, useState } from "react";

export interface WithDropProps {
  id?: string;
  isEditable?: boolean;
  isPreview?: boolean;
  onDropItem?: (targetId: string, itemData: unknown) => void;
  [key: string]: unknown;
}

export function withDrop<P extends object>(
  WrappedComponent: ComponentType<P>
): React.FC<P & WithDropProps> {
  const ComponentWithDrop: React.FC<P & WithDropProps> = ({
    isEditable = true,
    isPreview = false,
    onDropItem,
    ...props
  }) => {
    const [isOver, setIsOver] = useState(false);

    if (isPreview || !isEditable) {
      return <WrappedComponent {...(props as P)} />;
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isOver) setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOver(false);
      try {
        const dataStr = e.dataTransfer.getData("application/json");
        if (dataStr) {
          const item = JSON.parse(dataStr);
          const targetId = (props as { id?: string }).id || "root";
          onDropItem?.(targetId, item);
        }
      } catch {
        // Ignore invalid drop data
      }
    };

    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative transition-all duration-150 ${
          isOver ? "ring-2 ring-blue-500 ring-offset-2 bg-blue-50/20 rounded-md" : ""
        }`}
        data-drop-zone="true"
      >
        <WrappedComponent
          {...(props as P)}
          isEditable={isEditable}
          isPreview={isPreview}
        />
      </div>
    );
  };

  ComponentWithDrop.displayName = `WithDrop(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ComponentWithDrop;
}

export default withDrop;

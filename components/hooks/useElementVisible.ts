import React, { useMemo } from "react";

export interface ElementVisibleResult {
  isVisible: boolean;
  isElementVisible: boolean;
  style: React.CSSProperties;
}

export function useElementVisible(
  visibleRule: unknown,
  defaultVisible = true
): ElementVisibleResult {
  return useMemo(() => {
    let isVisible = defaultVisible;

    if (typeof visibleRule === "boolean") {
      isVisible = visibleRule;
    } else if (typeof visibleRule === "string") {
      const trimmed = visibleRule.trim().toLowerCase();
      if (trimmed === "false" || trimmed === "0" || trimmed === "hidden") {
        isVisible = false;
      } else if (trimmed === "true" || trimmed === "1" || trimmed === "visible") {
        isVisible = true;
      }
    } else if (visibleRule && typeof visibleRule === "object") {
      const obj = visibleRule as Record<string, unknown>;
      if (obj.visible !== undefined) {
        isVisible = Boolean(obj.visible);
      } else if (obj.hidden !== undefined) {
        isVisible = !Boolean(obj.hidden);
      }
    }

    const style: React.CSSProperties = isVisible ? {} : { display: "none" };

    return {
      isVisible,
      isElementVisible: isVisible,
      style,
    };
  }, [visibleRule, defaultVisible]);
}

export default useElementVisible;

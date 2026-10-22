"use client";

import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import { componentTypes } from "./componentTypes";
import ContainerComp from "./Container";
import { useElementVisible } from "./hooks/useElementVisible";
import { withDrop } from "./hoc/withDragAndDrop";
import { withEditable } from "./hoc/withEditable";
import withErrorBoundary, { ErrorBoundary } from "./hoc/withErrorBoundary";
import {
  hooks,
} from "./context/FormBuilderContext";
import { AppRendererProps, ElementNode } from "./types";

const {
  useElementSelector,
  useModuleFontFamilySelector,
  useModuleThemeSelector,
} = hooks;

export const AppRenderer: React.FC<AppRendererProps> = memo((props) => {
  const {
    id,
    isEditable = true,
    isPreview = false,
    getVariableValue = () => {},
    useVisible = () => true,
    focusedSubTree,
    parent: _parent,
    myRenderIndex: propRenderIndex,
    ...extraProps
  } = props;
  void _parent;

  const item = (useElementSelector(id) as ElementNode | undefined) || ({} as ElementNode);
  const themeCode = useModuleThemeSelector();
  const fontFamily = useModuleFontFamilySelector();
  const myRenderIndex = useMemo(() => propRenderIndex || 0, [propRenderIndex]);

  const { id: _ignoreId, isPersist, elementType, visible, children, isRoot, ...elementConfig } =
    item || {};
  void _ignoreId;

  const { isVisible, style: visibleStyle, isElementVisible } =
    useElementVisible(visible, true) || {};

  if (!(elementType?.includes("Container") && isPersist) && !isElementVisible && isPreview) {
    return null;
  }

  const Component = (
    (elementType ? componentTypes[elementType] : undefined) ||
    withEditable(withDrop(ContainerComp))
  ) as React.ComponentType<Record<string, unknown>>;

  let style: React.CSSProperties = {};
  if (elementType?.includes("Container") && isPreview) {
    style = { ...visibleStyle };
  }
  if (isRoot) {
    style = { ...style, color: themeCode, fontFamily };
  }

  return (
    <ErrorBoundary>
      <Component
        key={id}
        id={id}
        isEditable={isEditable}
        getVariableValue={getVariableValue}
        data={item}
        style={style}
        isPreview={isPreview}
        data-testid="container"
        {...elementConfig}
      >
        {(isVisible || !isPreview) &&
          children?.map((childId) => (
            <AppRenderer
              {...extraProps}
              isEditable={isEditable}
              key={childId}
              parent={id}
              id={childId}
              isPreview={isPreview}
              getVariableValue={getVariableValue}
              useVisible={useVisible}
              myRenderIndex={myRenderIndex + 1}
              focusedSubTree={focusedSubTree}
            />
          ))}
      </Component>
    </ErrorBoundary>
  );
});

AppRenderer.displayName = "AppRenderer";

AppRenderer.propTypes = {
  id: PropTypes.string.isRequired,
  isEditable: PropTypes.bool,
  isPreview: PropTypes.bool,
  getVariableValue: PropTypes.func,
  useVisible: PropTypes.func,
  myRenderIndex: PropTypes.number,
};

export default withErrorBoundary(AppRenderer);

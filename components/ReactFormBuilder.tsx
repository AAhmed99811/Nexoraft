"use client";

import PropTypes from "prop-types";
import React, { useMemo, useRef, useState } from "react";
import NavbarComponentWrapper from "./NavbarComponentWrapper";
import AppRenderer from "./AppRenderer";
import {
  elementSlice,
  hooks,
  useDispatch,
} from "./context/FormBuilderContext";
import Modal from "./ui/Modal";
import { useCustomCallback } from "./hooks/useCustomCallback";
import { useKeyBoardShortcut } from "./hooks/useKeyBoardShortcut";
import {
  ReactFormBuilderProps,
  PreviewProps,
  ElementObjectMap,
  ElementNode,
  DeviceType,
} from "./types";
import { Settings, X, Trash2, Copy, Sliders } from "lucide-react";

const { removeElement, updateElement, addElement } = elementSlice;
const {
  useElementObject,
  useElementState,
  useElementSelector,
  usePageSelector,
  usePageState,
} = hooks;

function getFocusedSubTreeIds(
  tree: ElementObjectMap | null | undefined,
  focusId: string
): string[] {
  const ids: string[] = [];
  function collect(id: string) {
    const node = tree?.[id];
    if (!node) return;
    ids.push(id);
    node.children?.forEach((childId) => collect(childId));
  }
  collect(focusId);
  return ids;
}

export const Preview: React.FC<PreviewProps> = ({ rootId, isPreview = false, ...props }) => {
  const tree = useElementObject();
  const { focusedElement } = useElementState();
  const focusedSubTree = useMemo(
    () => (focusedElement ? getFocusedSubTreeIds(tree, focusedElement) : null),
    [tree, focusedElement]
  );

  const effectiveRootId = rootId || "root";

  return (
    <div
      id="my_app_renderer"
      className="classes w-full h-full p-2 sm:p-4 transition-all"
      style={{ overflow: "auto", scrollbarWidth: "none" }}
    >
      <AppRenderer
        {...props}
        id={effectiveRootId}
        key={effectiveRootId}
        isPreview={isPreview}
        style={{ width: "100%" }}
        focusedSubTree={focusedSubTree}
      />
    </div>
  );
};

export const ReactFormBuilder: React.FC<ReactFormBuilderProps> = (props) => {
  const elementConfig = useElementSelector() as ElementNode | undefined;
  const deteleOpenRef = useRef<string | null>(null);
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement | null>(null);
  const pageState = usePageState();
  const activePage = pageState.activePage;
  const pageConfig = usePageSelector(activePage);

  const [deviceType, setDeviceType] = useState<DeviceType>(props.deviceType || "desktop");
  const [isPreview, setIsPreview] = useState(false);
  const [showInspector, setShowInspector] = useState(true);

  const deleteKeyCallback = useCustomCallback(() => {
    if (!deteleOpenRef.current && elementConfig?.id) {
      deteleOpenRef.current = "elementConfig";
      Modal.confirm({
        title: `Delete ${elementConfig?.label || "element"}`,
        content: (
          <div style={{ width: "240px" }}>
            <div>Are you sure you want to delete this element?</div>
            <div className="text-xs text-slate-500 mt-1">
              This will also remove all associated child elements.
            </div>
          </div>
        ),
        onCancel: () => {
          deteleOpenRef.current = null;
        },
        onOk: () => {
          dispatch(removeElement({ id: elementConfig.id }));
          deteleOpenRef.current = null;
        },
      });
    }
  });

  useKeyBoardShortcut([
    {
      callback: deleteKeyCallback,
      isShiftKeyPressed: true,
      isAltKeyPressed: true,
      targetKey: "Delete",
    },
  ]);

  const handleDuplicate = () => {
    if (!elementConfig) return;
    const newId = `elem-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
    const cloned = JSON.parse(JSON.stringify(elementConfig));
    cloned.id = newId;
    cloned.label = `${elementConfig.label || "Element"} (Copy)`;
    const parentId = pageConfig?.rootElementId || "root";
    dispatch(addElement(parentId, cloned));
  };

  const handlePropertyChange = (key: string, value: unknown) => {
    if (!elementConfig) return;
    dispatch(updateElement(elementConfig.id, { [key]: value }));
  };

  const computeDeviceContainerWidth = () => {
    if (deviceType === "mobile") {
      return "max-w-[390px] mx-auto shadow-2xl rounded-3xl border-8 border-slate-800 bg-white dark:bg-slate-900";
    } else if (deviceType === "tablet") {
      return "max-w-[768px] mx-auto shadow-2xl rounded-2xl border-4 border-slate-700 bg-white dark:bg-slate-900";
    }
    return "w-full max-w-7xl mx-auto rounded-xl shadow-xs";
  };

  return (
    <div className={`react-form-builder flex flex-col gap-4 w-full ${props.className || ""}`}>
      {/* Top Navbar & Controls */}
      <NavbarComponentWrapper
        pageConfig={pageConfig}
        deviceType={deviceType}
        onDeviceChange={setDeviceType}
        isPreview={isPreview}
        onTogglePreview={() => setIsPreview(!isPreview)}
        calledFrom="builder"
      />

      {/* Main Workspace: Canvas + Inspector */}
      <div className="flex gap-4 items-start w-full relative">
        {/* Visual Canvas Area */}
        <div
          ref={ref}
          className="flex-1 min-h-[calc(100vh-160px)] bg-slate-100/70 dark:bg-slate-950 p-2 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-center overflow-auto transition-all"
        >
          <div className={`transition-all duration-300 min-h-[600px] overflow-hidden ${computeDeviceContainerWidth()}`}>
            <Preview rootId={pageConfig?.rootElementId} isPreview={isPreview} />
          </div>
        </div>

        {/* Right Inspector Panel (WordPress / Webflow style) */}
        {!isPreview && showInspector && elementConfig && (
          <aside className="w-80 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-lg text-slate-800 dark:text-slate-100 flex flex-col gap-4 sticky top-4 max-h-[calc(100vh-140px)] overflow-y-auto">
            {/* Inspector Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Element Properties
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleDuplicate}
                  title="Duplicate element"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowInspector(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Element Info */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-xl text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {elementConfig.elementType || "Element"}
              </span>
              <code className="text-[10px] font-mono text-blue-500">#{elementConfig.id.slice(-6)}</code>
            </div>

            {/* Editable Properties based on element */}
            <div className="space-y-3 text-xs">
              {elementConfig.title !== undefined && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Title / Headline
                  </label>
                  <input
                    type="text"
                    value={elementConfig.title || ""}
                    onChange={(e) => handlePropertyChange("title", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {elementConfig.subtitle !== undefined && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subtitle / Description
                  </label>
                  <textarea
                    rows={2}
                    value={elementConfig.subtitle || ""}
                    onChange={(e) => handlePropertyChange("subtitle", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {elementConfig.badge !== undefined && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={elementConfig.badge || ""}
                    onChange={(e) => handlePropertyChange("badge", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {elementConfig.content !== undefined && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Paragraph Content
                  </label>
                  <textarea
                    rows={3}
                    value={elementConfig.content || ""}
                    onChange={(e) => handlePropertyChange("content", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {elementConfig.buttonText !== undefined && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Button Label
                  </label>
                  <input
                    type="text"
                    value={elementConfig.buttonText || ""}
                    onChange={(e) => handlePropertyChange("buttonText", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {elementConfig.buttonSecondaryText !== undefined && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Secondary Button Label
                  </label>
                  <input
                    type="text"
                    value={elementConfig.buttonSecondaryText || ""}
                    onChange={(e) => handlePropertyChange("buttonSecondaryText", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {elementConfig.placeholder !== undefined && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Input Placeholder
                  </label>
                  <input
                    type="text"
                    value={elementConfig.placeholder || ""}
                    onChange={(e) => handlePropertyChange("placeholder", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {elementConfig.src !== undefined && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Image Source URL
                  </label>
                  <input
                    type="text"
                    value={elementConfig.src || ""}
                    onChange={(e) => handlePropertyChange("src", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Quick Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Manage</span>
                <button
                  type="button"
                  onClick={() => dispatch(removeElement({ id: elementConfig.id }))}
                  className="px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Element</span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Toggle Inspector Button if hidden */}
        {!isPreview && !showInspector && (
          <button
            type="button"
            onClick={() => setShowInspector(true)}
            className="fixed right-4 bottom-4 z-40 p-3 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all cursor-pointer"
            title="Open Inspector"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

Preview.propTypes = {
  rootId: PropTypes.string,
  isPreview: PropTypes.bool,
};

ReactFormBuilder.propTypes = {
  deviceType: PropTypes.string,
  show_description: PropTypes.bool,
  toolbarItems: PropTypes.array,
};

export default ReactFormBuilder;

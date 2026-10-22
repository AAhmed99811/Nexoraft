import React, { Suspense, lazy, ComponentType } from "react";
import Loader from "../ui/Loader";

export function withSuspense<P extends object>(
  ComponentOrLoader: ComponentType<P> | (() => Promise<{ default: ComponentType<P> } | ComponentType<P>>),
  fallback: React.ReactNode = <Loader />
): React.FC<P> {
  let LazyComponent: ComponentType<P>;

  if (typeof ComponentOrLoader === "function" && !(ComponentOrLoader.prototype && ComponentOrLoader.prototype.isReactComponent)) {
    // Check if it's a dynamic import factory
    try {
      const result = (ComponentOrLoader as () => Promise<unknown>)();
      if (result && typeof (result as Promise<unknown>).then === "function") {
        LazyComponent = lazy(async () => {
          const mod = await (ComponentOrLoader as () => Promise<{ default?: ComponentType<P> } | ComponentType<P>>)();
          if (mod && typeof mod === "object" && "default" in mod && mod.default) {
            return { default: mod.default };
          }
          return { default: mod as ComponentType<P> };
        });
      } else {
        LazyComponent = ComponentOrLoader as ComponentType<P>;
      }
    } catch {
      LazyComponent = ComponentOrLoader as ComponentType<P>;
    }
  } else {
    LazyComponent = ComponentOrLoader as ComponentType<P>;
  }

  const WithSuspenseWrapper: React.FC<P> = (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );

  WithSuspenseWrapper.displayName = `WithSuspense(${LazyComponent.displayName || LazyComponent.name || "Component"})`;

  return WithSuspenseWrapper;
}

export default withSuspense;

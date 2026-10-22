import React from "react";

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = "md", text = "Loading...", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center p-4 gap-2 text-slate-500 ${className}`}>
      <div
        className={`${sizeClasses} border-slate-300 border-t-blue-600 rounded-full animate-spin`}
      />
      {text && <span className="text-xs font-medium tracking-wide">{text}</span>}
    </div>
  );
};

export default Loader;

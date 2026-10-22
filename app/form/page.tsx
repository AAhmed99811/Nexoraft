"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FormPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/builder");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 text-xs">
      Redirecting to Website Builder...
    </div>
  );
}

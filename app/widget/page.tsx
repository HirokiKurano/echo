import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { WidgetLockScreen } from "@/components/WidgetLockScreen";

export const metadata: Metadata = {
  title: "Spark — Glance",
  description: "A glance view of what's next.",
  appleWebApp: {
    capable: true,
    title: "Spark Glance",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  viewportFit: "cover",
};

export default function WidgetPage() {
  return (
    <main className="min-h-full">
      <Suspense fallback={null}>
        <WidgetLockScreen />
      </Suspense>
    </main>
  );
}

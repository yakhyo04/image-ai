import type { ReactNode } from "react";

/**
 * The dashboard chrome (sidebar + topbar) now lives in the persistent
 * `app/dashboard/layout.tsx` so it doesn't re-mount on navigation — which keeps
 * the collapse state and the sidebar scroll position stable between pages.
 * Pages still wrap their content in <DashFrame> for layout symmetry; here it's
 * just a passthrough. `active`/`title` are derived from the route in the layout.
 */
export default function DashFrame({ children }: { active?: string; title?: string; children: ReactNode }) {
  return <>{children}</>;
}

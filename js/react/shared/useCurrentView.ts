import { useEffect, useState } from "react";
import { DEFAULT_VIEW, isViewName, type ViewName } from "../../core/constants";

// Same fallback rule as the vanilla handleHashChange(): unknown hash -> dashboard.
function readViewFromHash(): ViewName {
  const hash = window.location.hash.replace("#", "");
  return isViewName(hash) ? hash : DEFAULT_VIEW;
}

export function useCurrentView(): [ViewName, (view: ViewName) => void] {
  const [view, setView] = useState<ViewName>(readViewFromHash);

  useEffect(() => {
    const onHashChange = () => setView(readViewFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Setting the hash fires "hashchange", which updates the state above.
  const navigate = (next: ViewName) => {
    window.location.hash = next;
  };

  return [view, navigate];
}

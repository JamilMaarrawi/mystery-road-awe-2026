// Navigation entry point. The router reacts to the hashchange.
import type { ViewName } from "../core/constants.js";

export function navigateTo(viewName: ViewName): void {
  window.location.hash = viewName;
}

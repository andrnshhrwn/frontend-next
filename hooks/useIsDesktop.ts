"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(min-width: 1024px)"; // sama dengan breakpoint `lg`

function subscribe(callback: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true, // snapshot server
  );
}

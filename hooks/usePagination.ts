"use client";

import { PAGE_CONTENT_HEIGHT } from "@/lib/pageConfig";
import { useCallback, useState, useRef, useEffect } from "react";

export function usePagination() {
  const [pageCount, setPageCount] = useState(1);
  const observerRef = useRef<ResizeObserver | null>(null);

  const calculatePagination = useCallback((editorElement: HTMLElement) => {
    if (!editorElement) return;

    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create ResizeObserver to watch content changes
    observerRef.current = new ResizeObserver(() => {
      const proseMirror = editorElement.querySelector(
        ".ProseMirror"
      ) as HTMLElement | null;
      if (!proseMirror) return;

      const contentHeight = proseMirror.scrollHeight;
      const pages = Math.max(1, Math.ceil(contentHeight / PAGE_CONTENT_HEIGHT));
      setPageCount(pages);
    });

    // Observe the ProseMirror editor
    const proseMirror = editorElement.querySelector(
      ".ProseMirror"
    ) as HTMLElement | null;
    if (proseMirror) {
      observerRef.current.observe(proseMirror);
    }
  }, []);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { pageCount, calculatePagination };
}

import { PAGE_CONTENT_HEIGHT } from "@/lib/pageConfig";
import { useCallback, useState } from "react";

export function usePagination() {
  const [pageCount, setPageCount] = useState(1);

  const calculatePagination = useCallback((editorElement: HTMLElement) => {
    const proseMirror = editorElement.querySelector(
      ".ProseMirror"
    ) as HTMLElement | null;

    if (!proseMirror) return;

    const contentHeight = proseMirror.scrollHeight;
    const pages = Math.max(1, Math.ceil(contentHeight / PAGE_CONTENT_HEIGHT));

    setPageCount(pages);
  }, []);

  return { pageCount, calculatePagination };
}

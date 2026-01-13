"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";

import { FloatingToolbar } from "./FloatingToolbar";
import { usePagination } from "@/hooks/usePagination";
import {
  PAGE_CONTENT_HEIGHT,
  PAGE_HEIGHT_PX,
  PAGE_MARGIN_PX,
  PAGE_WIDTH_PX,
} from "@/lib/pageConfig";

export default function EditorWithPagination() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 });
  const [showToolbar, setShowToolbar] = useState(false);

  const { pageCount, calculatePagination } = usePagination();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start typing your document here...</p>",
    immediatelyRender: false,

    onUpdate: () => {
      if (editorRef.current) {
        calculatePagination(editorRef.current);
      }
    },

    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;

      if (from === to) {
        setShowToolbar(false);
        return;
      }

      const text = editor.state.doc.textBetween(from, to);
      if (!text.trim()) {
        setShowToolbar(false);
        return;
      }

      const coords = editor.view.coordsAtPos(from);
      setToolbarPos({
        x: coords.left,
        y: coords.top - 56,
      });
      setShowToolbar(true);
    },
  });

  useEffect(() => {
    if (!editor || !editorRef.current) return;
    calculatePagination(editorRef.current);
  }, [editor, calculatePagination]);

  if (!editor) return null;

  return (
    <div className="flex justify-center py-8 bg-gray-100 min-h-screen">
      <div className="relative">
        {/* Page breaks */}
        {Array.from({ length: pageCount - 1 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t-2 border-dashed border-blue-300 pointer-events-none"
            style={{
              top: PAGE_MARGIN_PX + PAGE_CONTENT_HEIGHT * (i + 1),
            }}
          />
        ))}

        {/* Page */}
        <div
          className="bg-white shadow-xl border"
          style={{
            width: PAGE_WIDTH_PX,
            minHeight: PAGE_HEIGHT_PX * pageCount,
            padding: PAGE_MARGIN_PX,
          }}
        >
          <div ref={editorRef}>
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 mt-3">
          {pageCount} {pageCount === 1 ? "Page" : "Pages"}
        </div>
      </div>

      {showToolbar && editor && (
        <FloatingToolbar editor={editor} position={toolbarPos} />
      )}
    </div>
  );
}

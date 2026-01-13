"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { useEffect, useRef, useState, useCallback } from "react";

import { TopToolbar } from "./TopToolbar";
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

  useEffect(() => {
    if (!editorRef.current) return;

    const proseMirror = editorRef.current.querySelector(".ProseMirror");
    if (!proseMirror) return;

    const resizeObserver = new ResizeObserver(() => {
      if (editorRef.current) {
        calculatePagination(editorRef.current);
      }
    });

    resizeObserver.observe(proseMirror);
    return () => resizeObserver.disconnect();
  }, [calculatePagination]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: `
      <h1>Legal Document</h1>
      <p>Start typing your document here. The page breaks will update as you type.</p>
    `,
    immediatelyRender: false,

    onUpdate: () => {
      if (editorRef.current) {
        calculatePagination(editorRef.current);
      }
    },

    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;

      // Hide toolbar if no selection or only whitespace selected
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
        y: coords.top - 60,
      });
      setShowToolbar(true);
    },

    onBlur: () => {
      setShowToolbar(false);
    },
  });

  useEffect(() => {
    if (!editor || !editorRef.current) return;
    calculatePagination(editorRef.current);
  }, [editor, calculatePagination]);

  const handleEditorClick = useCallback(() => {
    setShowToolbar(false);
  }, []);

  if (!editor) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopToolbar editor={editor} />

      <div className="flex justify-center py-8 px-4 flex-1">
        <div
          className="relative w-full"
          style={{ maxWidth: PAGE_WIDTH_PX + 48 }}
        >
          {/* Page break indicators */}
          {Array.from({ length: Math.max(0, pageCount - 1) }).map((_, i) => (
            <div
              key={`page-break-${i}`}
              className="absolute left-6 right-6 border-t-2 border-dashed border-muted-foreground/30 pointer-events-none transition-all duration-300"
              style={{
                top: PAGE_MARGIN_PX + PAGE_CONTENT_HEIGHT * (i + 1),
              }}
              aria-hidden="true"
            />
          ))}

          {/* Main editor page container */}
          <div
            className="bg-card shadow-2xl border border-border rounded-lg overflow-hidden transition-all duration-300"
            style={{
              width: PAGE_WIDTH_PX,
              minHeight: PAGE_HEIGHT_PX * pageCount,
              padding: PAGE_MARGIN_PX,
            }}
            onClick={handleEditorClick}
            role="region"
            aria-label="Document editor"
          >
            <div ref={editorRef} className="max-w-none">
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Page counter */}
          <div className="text-center text-sm text-muted-foreground mt-6 font-medium">
            {pageCount} {pageCount === 1 ? "page" : "pages"}
          </div>

          {/* Floating toolbar for text selection */}
          {showToolbar && editor && (
            <FloatingToolbar
              editor={editor}
              position={toolbarPos}
              onHide={() => setShowToolbar(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

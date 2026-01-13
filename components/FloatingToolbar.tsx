"use client";

import { Bold, Italic, List, Heading2 } from "lucide-react";
import type { Editor } from "@tiptap/react";
import { useEffect, useRef } from "react";

interface Props {
  editor: Editor;
  position: { x: number; y: number };
  onHide?: () => void;
}

export function FloatingToolbar({ editor, position, onHide }: Props) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target as Node)
      ) {
        onHide?.();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onHide?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onHide]);

  const adjustedX = Math.max(80, Math.min(position.x, window.innerWidth - 80));
  const adjustedY = Math.max(56, position.y);

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 flex gap-1 bg-card border border-border rounded-lg shadow-lg p-1.5 animate-in fade-in zoom-in-95 duration-150"
      style={{
        left: adjustedX,
        top: adjustedY,
        transform: "translateX(-50%)",
      }}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-md transition-colors ${
          editor.isActive("bold")
            ? "bg-primary text-primary-foreground"
            : "bg-muted hover:bg-muted/80"
        }`}
        title="Bold (Ctrl+B)"
        type="button"
      >
        <Bold size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-md transition-colors ${
          editor.isActive("italic")
            ? "bg-primary text-primary-foreground"
            : "bg-muted hover:bg-muted/80"
        }`}
        title="Italic (Ctrl+I)"
        type="button"
      >
        <Italic size={16} />
      </button>

      <div className="w-px bg-border" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-md transition-colors ${
          editor.isActive("bulletList")
            ? "bg-primary text-primary-foreground"
            : "bg-muted hover:bg-muted/80"
        }`}
        title="Bullet List"
        type="button"
      >
        <List size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-md transition-colors ${
          editor.isActive("heading", { level: 2 })
            ? "bg-primary text-primary-foreground"
            : "bg-muted hover:bg-muted/80"
        }`}
        title="Heading 2"
        type="button"
      >
        <Heading2 size={16} />
      </button>
    </div>
  );
}

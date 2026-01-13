"use client";

import { Bold, Italic, List } from "lucide-react";
import { Editor } from "@tiptap/react";

interface Props {
  editor: Editor;
  position: { x: number; y: number };
}

export function FloatingToolbar({ editor, position }: Props) {
  return (
    <div
      className="fixed z-50 flex gap-1 bg-white border border-gray-300 rounded-lg shadow-xl p-1.5"
      style={{
        left: position.x,
        top: position.y,
        transform: "translateX(-50%)",
      }}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-md ${
          editor.isActive("bold")
            ? "bg-blue-500 text-white"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        <Bold size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-md ${
          editor.isActive("italic")
            ? "bg-blue-500 text-white"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        <Italic size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-md ${
          editor.isActive("bulletList")
            ? "bg-blue-500 text-white"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        <List size={16} />
      </button>
    </div>
  );
}

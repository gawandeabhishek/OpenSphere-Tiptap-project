"use client";

import type React from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Table2,
  Heading1,
  Heading2,
} from "lucide-react";
import type { Editor } from "@tiptap/react";

interface ToolbarButtonProps {
  isActive: boolean;
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
}

function ToolbarButton({ isActive, onClick, title, icon }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        p-2.5 rounded-md transition-all duration-200
        flex items-center justify-center
        ${
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "hover:bg-secondary text-foreground hover:shadow-sm"
        }
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1
        active:scale-95
      `}
      aria-pressed={isActive}
      type="button"
    >
      {icon}
    </button>
  );
}

export function TopToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="bg-card border-b border-border px-6 py-4 sticky top-0 z-20 shadow-sm">
      <div className="max-w-6xl mx-auto flex gap-1 flex-wrap items-center">
        {/* Heading Buttons */}
        <div className="flex gap-1 border-r border-border pr-3">
          <ToolbarButton
            isActive={editor.isActive("heading", { level: 1 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            title="Heading 1"
            icon={<Heading1 size={18} />}
          />
          <ToolbarButton
            isActive={editor.isActive("heading", { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            title="Heading 2"
            icon={<Heading2 size={18} />}
          />
        </div>

        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-border px-3">
          <ToolbarButton
            isActive={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold (Ctrl+B)"
            icon={<Bold size={18} />}
          />
          <ToolbarButton
            isActive={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
            icon={<Italic size={18} />}
          />
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-border px-3">
          <ToolbarButton
            isActive={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
            icon={<List size={18} />}
          />
          <ToolbarButton
            isActive={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Ordered List"
            icon={<ListOrdered size={18} />}
          />
        </div>

        {/* Table */}
        <div className="flex gap-1 pl-3">
          <ToolbarButton
            isActive={false}
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({
                  rows: 3,
                  cols: 3,
                  withHeaderRow: true,
                })
                .run()
            }
            title="Insert Table"
            icon={<Table2 size={18} />}
          />
        </div>
      </div>
    </div>
  );
}

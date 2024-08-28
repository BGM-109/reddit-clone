import { useEditor, type Editor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  StrikethroughIcon,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

export function Menubar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-5">
      <Toggle
        size="sm"
        pressed={editor.isActive("heading")}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading")}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading")}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        <Heading3 className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <StrikethroughIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
    </div>
  );
}

type TiptapEditorProps = {
  json: string;
  setJson: (json: string) => void;
};
export function TiptapEditor({ json, setJson }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: json ?? `<p>Hey, I'm a paragraph!</p>`,
    editorProps: {
      attributes: {
        class:
          "rounded-md border min-h-[150px] border-input bg-background focus:ring-offset-2 disabled:cursor-not-allows disabled:opacity-50 p-2",
      },
    },
    immediatelyRender: true,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      console.log(json);
      setJson(JSON.stringify(json, null, 2));
    },
  });
  return (
    <div className="mt-1">
      <Menubar editor={editor} />
      <EditorContent
        editor={editor}
        className="rounded-lg min-h-[150px] mt-2"
      />
    </div>
  );
}

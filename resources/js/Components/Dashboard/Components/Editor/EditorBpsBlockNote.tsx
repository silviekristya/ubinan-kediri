
import { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useState } from "react";

import "./styles.css";

interface EditorBpsBlockNoteProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

export default function EditorBpsBlockNote({
  onChange,
  initialContent,
  editable,
}: EditorBpsBlockNoteProps) {
  const initialBlocks = initialContent ? JSON.parse(initialContent) : undefined;
  const [blocks, setBlocks] = useState<PartialBlock[]>(initialBlocks);
  const editor = useCreateBlockNote({ initialContent: blocks });

  return (
    <BlockNoteView
      editable={editable}
      editor={editor}
      onChange={() => {
        setBlocks(editor.document);
        onChange(JSON.stringify(blocks));
      }}
      data-theming-css-bps-kab-kediri
    />
  );
}

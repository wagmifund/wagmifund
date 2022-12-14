import BoldIcon from "@icons/type-bold";
import ItalicIcon from "@icons/type-italic";
import { CodeIcon } from "@heroicons/react/outline";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";

const ToolbarPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsCode(selection.hasFormat("code"));
    }
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  return (
    <div className="w-full px-5 py-2 flex toolbar-icons border-b-theme border-b space-x-1">
      <button
        className={isBold ? "bg-theme-darker" : ""}
        title="Bold"
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
      >
        <BoldIcon className="onboard-icon" />
      </button>
      <button
        className={isItalic ? "bg-theme-darker" : ""}
        title="Italic"
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
      >
        <ItalicIcon className="onboard-icon" />
      </button>
      <button
        className={isCode ? "bg-theme-darker" : ""}
        title="Code"
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
        }}
      >
        <CodeIcon className="onboard-icon h-4" />
      </button>
    </div>
  );
};

export default ToolbarPlugin;

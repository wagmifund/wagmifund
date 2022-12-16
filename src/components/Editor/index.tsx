import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeNode } from "@lexical/code";
import { HashtagNode } from "@lexical/hashtag";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from "@lexical/markdown";
import { EmojiNode } from "./nodes/EmojiNode";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import React from "react";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import EmojiPlugin from "./plugins/EmojiPlugin";
import EmojiPickerPlugin from "./plugins/EmojiPickerPlugin";

type EditorProps = {
  isEditable: boolean;
  hidePlaceholder: boolean;
  initialState?: string;
  onChange?: (markdown: string) => void;
};
const Editor = (props: EditorProps) => {
  const { isEditable } = props;
  const initialConfig = {
    namespace: "composer",
    editable: isEditable ?? true,
    theme: {
      text: {
        bold: "text-bold",
        italic: "text-italic",
        code: "text-sm bg-gray-300 rounded-lg dark:bg-gray-700 px-[5px] py-[2px]",
      },
      link: "text-brand",
      hashtag: "text-brand",
      list: {
        listitem: "PlaygroundEditorTheme__listItem",
        nested: {
          listitem: "PlaygroundEditorTheme__nestedListItem",
        },
        olDepth: [
          "PlaygroundEditorTheme__ol1",
          "PlaygroundEditorTheme__ol2",
          "PlaygroundEditorTheme__ol3",
          "PlaygroundEditorTheme__ol4",
          "PlaygroundEditorTheme__ol5",
        ],
        ul: "PlaygroundEditorTheme__ul",
      },
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      HashtagNode,
      AutoLinkNode,
      LinkNode,
      EmojiNode,
    ],
    editorState: () =>
      $convertFromMarkdownString(props?.initialState || "", TRANSFORMERS),
    onError: (error: any) => {
      console.error(error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      {isEditable ? <ToolbarPlugin /> : ""}
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="px-5 block my-4 min-h-[65px] h-4/5 lexical-content-editable overflow-auto" />
        }
        placeholder={
          props?.hidePlaceholder ? (
            <React.Fragment />
          ) : isEditable ? (
            <div className="px-5 absolute top-[65px] text-gray-400 pointer-events-none whitespace-nowrap">
              What is happening?
            </div>
          ) : (
            <div></div>
          )
        }
        ErrorBoundary={() => <div>error</div>}
      />
      <OnChangePlugin
        onChange={(editorState) => {
          editorState.read(() => {
            const markdown = $convertToMarkdownString(TRANSFORMERS);
            props?.onChange?.(markdown);
          });
        }}
      />
      <AutoLinkPlugin />
      <EmojiPlugin />
      <EmojiPickerPlugin />
    </LexicalComposer>
  );
};

export default Editor;

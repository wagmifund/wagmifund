import {
  $convertToMarkdownString,
  ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
} from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";

import { TRANSFORMERS } from "@lexical/markdown";
import { ListItemNode, ListNode } from "@lexical/list";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import type { ClassAttributes, FC, HTMLAttributes } from "react";
// import { usePublicationStore } from 'src/store/publication';

// import MentionsPlugin from './AtMentionsPlugin';
import AutoLinkPlugin from "./AutoLinkPlugin";
import EmojisPlugin from "./EmojisPlugin";
import EmojiPickerPlugin from "./EmojiPickerPlugin";
import ToolbarPlugin from "./ToolbarPlugin";
import clsx from "clsx";
import React from "react";
import { CodeNode } from "@lexical/code";
import { HashtagNode } from "@lexical/hashtag";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { $convertFromMarkdownString } from "@lexical/markdown";
import { EmojiNode } from "./nodes/EmojiNode";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import ListMaxIndentLevelPlugin from "./ListMaxIndexLevelPlugin";

const Editor = (props: {
  viewOnly?: boolean;
  isEditable?: boolean;
  hidePlaceholder?: boolean;
  initialState?: string;
}) => {
  const initialConfig = {
    namespace: "composer",
    editable: props.isEditable ?? true,
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

  const { viewOnly } = props;
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        {...props}
        className={clsx("relative lexical-editor", props.className)}
      >
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <ListPlugin />

        <ToolbarPlugin />

        <RichTextPlugin
          contentEditable={
            <ContentEditable className="px-5 block my-4 min-h-[65px] h-4/5 lexical-content-editable overflow-auto" />
          }
          placeholder={
            props?.hidePlaceholder ? (
              <React.Fragment />
            ) : !viewOnly ? (
              <div className="px-5 absolute top-[65px] text-gray-400 pointer-events-none whitespace-nowrap">
                What's happening?
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
              // setPublicationContent(markdown);
            });
          }}
        />
        <AutoLinkPlugin />
        <EmojisPlugin />
        {/* <EmojiPickerPlugin /> */}
        <HistoryPlugin />
        <HashtagPlugin />
        <ListMaxIndentLevelPlugin maxDepth={2} />
      </div>
    </LexicalComposer>
  );
};

export default Editor;

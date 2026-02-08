"use client";

import React, { useEffect } from "react";
import { useTamboThread } from "@tambo-ai/react";
import { useCrisisContext } from "@/context/CrisisContext";

import type { messageVariants } from "@/components/tambo/message";
import {
  MessageInput,
  MessageInputError,
  MessageInputFileButton,
  MessageInputMcpPromptButton,
  MessageInputMcpResourceButton,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
  MessageInputMcpConfigButton,
} from "@/components/tambo/message-input";
import {
  MessageSuggestions,
  MessageSuggestionsList,
  MessageSuggestionsStatus,
} from "@/components/tambo/message-suggestions";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import { ThreadContainer, useThreadContainerContext } from "./thread-container";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/tambo/thread-content";
import {
  ThreadHistory,
  ThreadHistoryHeader,
  ThreadHistoryList,
  ThreadHistoryNewButton,
  ThreadHistorySearch,
} from "@/components/tambo/thread-history";
import { useMergeRefs } from "@/lib/thread-hooks";
import type { Suggestion } from "@tambo-ai/react";
import type { VariantProps } from "class-variance-authority";

export interface MessageThreadFullProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof messageVariants>["variant"];
}

export const MessageThreadFull = React.forwardRef<
  HTMLDivElement,
  MessageThreadFullProps
>(({ className, variant, ...props }, ref) => {
  const { containerRef, historyPosition } = useThreadContainerContext();
  const mergedRef = useMergeRefs<HTMLDivElement | null>(ref, containerRef);
  
  const { thread } = useTamboThread();
  

  const { setSupplies, setMarkers } = useCrisisContext();


  useEffect(() => {
    if (thread?.id) {
      setSupplies([]); 
      setMarkers([]);
    }
  }, [thread?.id, setSupplies, setMarkers]);

  const threadHistorySidebar = (
    <ThreadHistory position={historyPosition}>
      <ThreadHistoryHeader />
      <ThreadHistoryNewButton />
      <ThreadHistorySearch />
      <ThreadHistoryList />
    </ThreadHistory>
  );

  const defaultSuggestions: Suggestion[] = [
    {
      id: "suggestion-1",
      title: "Get started",
      detailedSuggestion: "What can you help me with?",
      messageId: "welcome-query",
    },
    {
      id: "suggestion-2",
      title: "Learn more",
      detailedSuggestion: "Tell me about your capabilities.",
      messageId: "capabilities-query",
    },
    {
      id: "suggestion-3",
      title: "Examples",
      detailedSuggestion: "Show me some example queries I can try.",
      messageId: "examples-query",
    },
  ];

  return (
    <div className="flex h-full w-full bg-slate-50 text-slate-900 overflow-hidden">
      {historyPosition === "left" && threadHistorySidebar}

      <ThreadContainer
        ref={mergedRef}
        disableSidebarSpacing
        className={`flex flex-col h-full w-full min-h-0 ${className || ''}`}
        {...props}
      >
        <ScrollableMessageContainer className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0">
          <ThreadContent variant={variant}>
            <ThreadContentMessages />
          </ThreadContent>
        </ScrollableMessageContainer>

        <div className="shrink-0 px-4 pb-4 pt-2 bg-slate-50">
          <MessageSuggestions>
            <MessageSuggestionsStatus />
          </MessageSuggestions>

          <MessageInput className="border border-slate-200 rounded-xl shadow-sm bg-white focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/50 transition-all">
            <MessageInputTextarea 
                placeholder="Type your message or paste images..." 
                className="min-h-[50px] max-h-[200px] text-slate-900 placeholder:text-slate-400" 
            />
            <MessageInputToolbar>
              <MessageInputFileButton className="text-slate-500 hover:text-emerald-600 hover:bg-primary/10" />
              <MessageInputMcpPromptButton className="text-slate-500 hover:text-emerald-600 hover:bg-primary/10" />
              <MessageInputMcpResourceButton className="text-slate-500 hover:text-emerald-600 hover:bg-primary/10" />
              <MessageInputMcpConfigButton className="text-slate-500 hover:text-emerald-600 hover:bg-primary/10" />
              
              <MessageInputSubmitButton className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20" />
            </MessageInputToolbar>
            <MessageInputError />
          </MessageInput>

          <div className="mt-2">
            <MessageSuggestions initialSuggestions={defaultSuggestions}>
                <MessageSuggestionsList />
            </MessageSuggestions>
          </div>
        </div>
      </ThreadContainer>

      {historyPosition === "right" && threadHistorySidebar}
    </div>
  );
});
MessageThreadFull.displayName = "MessageThreadFull";
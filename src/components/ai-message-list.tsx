"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useThreadMessages } from "@convex-dev/agent/react";
import { useQuery } from "convex/react";
import { useEffect } from "react";

export function AiMessageList({ twitter, avatarUrl }: { twitter: string; avatarUrl: string }) {
  const thread = useQuery(api.chat.getThreadByTwitterHandle, { twitterHandle: twitter });
  const threadId = thread?.threadId ?? null;

  const messagesResult = useThreadMessages(api.chat.listThreadMessages, threadId ? { threadId } : "skip", { initialNumItems: 10 });
  const { observeRef, isVisible } = useIntersectionObserver();

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, [messagesResult]);

  useEffect(() => {
    if (isVisible) {
      messagesResult.loadMore(10);
    }
  }, [isVisible, messagesResult]);

  if (!threadId) {
    return <div className="text-muted-foreground">No conversation yet. Start a conversation with @{twitter}.</div>;
  }

  return messagesResult.results.map((message) => {
    if (!message.message) return null;
    const isUser = message.message.role === "user";
    return !isUser ? (
      // @ts-expect-error types
      <div key={message._id} className="flex gap-2" ref={observeRef}>
        <Avatar className="size-12">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{twitter.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="p-4 rounded-t-2xl rounded-b-lg md:max-w-[50%] w-fit bg-muted self-start">{message.text}</div>
      </div>
    ) : (
      <div key={message._id} className="p-4 rounded-t-2xl rounded-b-lg md:max-w-[50%] w-fit bg-muted self-end">
        {message.text}
      </div>
    );
  });
}

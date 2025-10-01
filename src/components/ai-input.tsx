"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { cn } from "@/lib/utils";
import { useCustomer } from "autumn-js/react";
import { useAction, useMutation, useQuery } from "convex/react";
import { Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function AiInput({ twitterHandle, profileLlmData }: { twitterHandle: string; profileLlmData: unknown }) {
  const usage = useQuery(api.queries.getUsage);
  const messagesCount = usage?.value;

  const { customer } = useCustomer();
  const saveUsage = useMutation(api.mutations.saveUsage);
  const isPro = customer?.products?.some((p) => p.id === "professional" && p.status === "active");

  const [value, setValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 52,
    maxHeight: 200,
  });
  const [isFocused, setIsFocused] = useState(false);

  const createThread = useMutation(api.chat.createThread);
  const sendMessageToAgent = useAction(api.chat.sendMessageToAgent);

  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    setIsSending(true);

    setValue("");
    adjustHeight(true);

    const threadId = await createThread({
      twitterHandle: twitterHandle,
    });

    if (messagesCount >= 10 && !isPro) {
      throw new Error("You have reached the maximum number of messages");
    }

    await saveUsage();

    await sendMessageToAgent({
      threadId: threadId,
      prompt: value.trim(),
      profileLlmData: profileLlmData,
    });

    setIsSending(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleContainerClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="w-full py-4">
      <div className="relative max-w-xl w-full mx-auto">
        {messagesCount >= 10 && !isPro ? (
          <div className="w-full py-4">
            <div className="relative max-w-xl w-full mx-auto">
              <div className="bg-muted rounded-xl w-full h-28">
                <Button className="w-full h-full" asChild>
                  <Link href="/pricing">Upgrade to continue</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            role="textbox"
            tabIndex={0}
            aria-label="Search input container"
            className={cn(
              "relative flex flex-col rounded-xl transition-all duration-200 w-full text-left cursor-text",
              "ring-1 ring-black/10 dark:ring-white/10",
              isFocused && "ring-black/20 dark:ring-white/20",
            )}
            onClick={handleContainerClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleContainerClick();
              }
            }}
          >
            <div className="overflow-y-auto max-h-[200px]">
              <Textarea
                id="ai-input"
                value={value}
                placeholder="Ask anything..."
                className="w-full rounded-xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0 leading-[1.2]"
                ref={textareaRef}
                disabled={isSending}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!isSending) {
                      handleSubmit();
                    }
                  }
                }}
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
              />{" "}
            </div>

            <div className="h-12 bg-black/5 dark:bg-white/5 rounded-b-xl">
              <div className="absolute right-3 bottom-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={cn(
                    "rounded-lg p-2 transition-colors",
                    value
                      ? "bg-sky-500/15 text-sky-500"
                      : "bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white cursor-pointer",
                    isSending && "opacity-50 cursor-not-allowed hover:text-black/40 dark:hover:text-white/40",
                  )}
                  disabled={isSending}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

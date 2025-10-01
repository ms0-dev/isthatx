"use client";

import { AiInput } from "@/components/ai-input";
import { AiMessageList } from "@/components/ai-message-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function Messages({ twitter, avatarUrl, profileLlmData }: { twitter: string; avatarUrl: string; profileLlmData: unknown }) {
  const router = useRouter();
  const afterLoginPath = usePathname();

  useEffect(() => {
    if (!avatarUrl) router.replace(`/chat/${twitter}`);
  }, [avatarUrl, router, twitter]);

  return (
    <div className="pt-24 mx-auto max-w-6xl px-6 lg:px-12 h-[100vh] flex flex-col justify-between">
      <div className="flex items-center justify-center">
        <Avatar className="size-32">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="text-2xl font-bold">{twitter.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col gap-4">
        <Authenticated>
          <AiMessageList twitter={twitter} avatarUrl={avatarUrl} />
        </Authenticated>
        <AuthLoading>
          <Loader2Icon className="w-5 h-5 animate-spin self-center" />
        </AuthLoading>
        <Unauthenticated>
          <div className="text-muted-foreground">No conversation yet. Start a conversation with @{twitter}.</div>
        </Unauthenticated>

        <div className="sticky bottom-0 bg-background">
          <Unauthenticated>
            <div className="w-full py-4">
              <div className="relative max-w-xl w-full mx-auto">
                <div className="bg-muted rounded-xl w-full h-28">
                  <Button className="w-full h-full" asChild>
                    <Link href={`/login?redirect=${encodeURIComponent(afterLoginPath)}`}>Sign in to chat</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Unauthenticated>
          <Authenticated>
            <AiInput twitterHandle={twitter} profileLlmData={profileLlmData} />
          </Authenticated>
          <AuthLoading>
            <div className="w-full py-4">
              <div className="relative max-w-xl w-full mx-auto">
                <Skeleton className="rounded-xl w-full h-28" />
              </div>
            </div>
          </AuthLoading>
        </div>
      </div>
    </div>
  );
}

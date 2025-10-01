"use client";

import { InkeepEmbeddedChat, type InkeepEmbeddedChatProps } from "@inkeep/cxkit-react-oss";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HelpPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, isLoading, router]);

  if (!mounted || !isAuthenticated || isLoading) return null;

  const embeddedChatProps: InkeepEmbeddedChatProps = {
    aiChatSettings: {
      graphUrl: process.env.NEXT_PUBLIC_AGENTS_RUN_API_URL + "/api/chat",
      apiKey: process.env.NEXT_PUBLIC_INKEEP_API_KEY,
      headers: {
        "x-inkeep-tenant-id": "default",
        "x-inkeep-project-id": "isthatx",
        "x-inkeep-graph-id": "help-chat",
      },
    },
    baseSettings: {
      colorMode: {
        sync: {
          target: document.documentElement,
          attributes: ["class"],
          // @ts-expect-error types
          isDarkMode: (attrs) => attrs["class"]?.includes("dark"),
        },
      },
    },
  };

  return (
    <div className="pt-24 h-[100vh]">
      <div className="h-full relative">
        <div className="absolute top-0 left-0 right-0 z-50 bg-background/90 w-fit mx-auto p-2 rounded-b-lg hidden md:block">
          <div className="text-xl font-bold text-center">Inkeep Help Chat</div>
          <p className="text-center text-xs md:text-sm text-muted-foreground">Chat with Inkeep AI to get help with your account</p>
        </div>
        <InkeepEmbeddedChat {...embeddedChatProps} />
      </div>
    </div>
  );
}

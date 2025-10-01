"use client";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="pt-24 mx-auto max-w-6xl px-6 lg:px-12 h-[100vh]">
      <div className="flex h-full divide-x">
        <button className="w-1/2 group" onClick={() => setTheme("light")}>
          <div className="flex items-center justify-center h-full pr-4">
            <Sun
              className={cn(
                "size-32 group-hover:stroke-amber-500 group-hover:scale-105 transition-all",
                theme === "dark" ? "stroke-muted" : "stroke-amber-500",
              )}
            />
          </div>
        </button>

        <button className="w-1/2 group" onClick={() => setTheme("dark")}>
          <div className="flex items-center justify-center h-full pl-4">
            <Moon
              className={cn(
                "size-32 group-hover:stroke-gray-900 group-hover:scale-105 transition-all",
                theme === "light" ? "stroke-muted" : "stroke-gray-900",
              )}
            />
          </div>
        </button>
      </div>
    </div>
  );
}

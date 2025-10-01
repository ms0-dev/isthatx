"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchButton({ className }: { className?: string }) {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("size-8 cursor-pointer", className)}>
          <SearchIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Go to profile</DialogTitle>
          <DialogDescription>Enter the username of the profile you want to go to</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <Label htmlFor="username">X/Twitter handle</Label>
          <Input id="username" name="username" value={handle} onChange={(e) => setHandle(e.target.value)} />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              router.push(`/chat/${handle}`);
              setOpen(false);
            }}
          >
            Open profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

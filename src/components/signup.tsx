"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function SignUpForm() {
  const callbackUrl = useSearchParams().get("redirect") || "/";
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showMagicLinkInstruction, setShowMagicLinkInstruction] = useState(false);

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        action={async () => {
          await authClient.signIn.magicLink(
            { email, callbackURL: callbackUrl },
            {
              onRequest: () => {
                setIsEmailLoading(true);
                setError("");
              },
              onSuccess: () => {
                setIsEmailLoading(false);
                setShowMagicLinkInstruction(true);
              },
              onError: (ctx) => {
                setIsEmailLoading(false);
                // display the error message
                setError(ctx.error.message);
              },
            },
          );
        }}
        className="max-w-92 m-auto h-fit w-full"
      >
        <div className="p-6 relative">
          <div>
            {error && (
              <p className="text-destructive absolute -top-20 left-0 right-0 p-6 border border-dashed rounded-md border-destructive">{error}</p>
            )}
            {showMagicLinkInstruction && (
              <p className="text-blue-500 absolute -top-20 left-0 right-0 p-6 border border-dashed rounded-md border-blue-500">
                Check your email for a magic link
              </p>
            )}
            <h1 className="mb-1 mt-4 text-xl font-semibold">Create an Account</h1>
            <p>Welcome! Create an account to get started</p>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={async () => {
                await authClient.signIn.social(
                  { provider: "google", callbackURL: callbackUrl },
                  {
                    onRequest: () => {
                      setIsGoogleLoading(true);
                      setError("");
                    },
                    onSuccess: () => {
                      setIsGoogleLoading(false);
                    },
                    onError: (ctx) => {
                      setIsGoogleLoading(false);
                      // display the error message
                      setError(ctx.error.message);
                    },
                  },
                );
              }}
            >
              {isGoogleLoading ? <Loader2 className="animate-spin" /> : <Icons.google />}
              <span>Google</span>
            </Button>
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed" />
            <span className="text-muted-foreground text-xs">Or continue With</span>
            <hr className="border-dashed" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input type="email" required name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <Button className="w-full">{isEmailLoading ? <Loader2 className="animate-spin" /> : "Continue"}</Button>
          </div>
        </div>

        <p className="text-accent-foreground text-center text-sm">
          Have an account ?
          <Button asChild variant="link" className="px-2">
            <Link href={`/login?redirect=${callbackUrl}`}>Sign In</Link>
          </Button>
        </p>
      </form>
    </section>
  );
}

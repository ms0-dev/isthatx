import { AutumnWrapper } from "@/components/autumn-wrapper";
import { ConvexClientProvider } from "@/components/convex-provider";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IS THAT X - chat with any x user",
  description: "chat with any x user",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getToken();
  const user = token ? await fetchQuery(api.auth.getCurrentUser, {}, { token }) : null;
  //const preloadedUserQuery = token ? await preloadQuery(api.auth.getCurrentUser, {}, { token }) : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <ConvexClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AutumnWrapper>
              <Header user={user} />
              {children}
            </AutumnWrapper>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}

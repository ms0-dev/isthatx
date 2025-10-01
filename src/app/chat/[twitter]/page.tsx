import { Messages } from "@/components/messages";
import { api } from "@/convex/_generated/api";
import Firecrawl from "@mendable/firecrawl-js";
import { fetchMutation, fetchQuery } from "convex/nextjs";

const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });

export async function generateMetadata({ params }: { params: Promise<{ twitter: string }> }) {
  const { twitter } = await params;

  return {
    title: `IS THAT X - ${twitter}`,
    description: `Chat with ${twitter}`,
  };
}

export default async function Page({ params }: { params: Promise<{ twitter: string }> }) {
  const { twitter } = await params;

  const profileLlmData = await fetchQuery(api.queries.getProfileLlmData, { profile: twitter });

  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  const isStale = profileLlmData ? profileLlmData._creationTime < Date.now() - TWENTY_FOUR_HOURS : true;

  if (isStale) {
    // working nitter instances
    const scrapeResponse = await firecrawl.scrapeUrl(`https://nitter.privacyredirect.com/${twitter}`, {
      formats: ["markdown"],
    });

    // @ts-expect-error no response type
    if (scrapeResponse.metadata.error === "Not Found") {
      return (
        <div className="h-[100vh] flex items-center justify-center">
          <div className="text-2xl font-bold">Profile not found</div>
        </div>
      );
    }

    if (scrapeResponse.error) {
      return (
        <div className="h-[100vh] flex items-center justify-center">
          <div className="text-2xl font-bold">Something went wrong</div>
        </div>
      );
    }

    // @ts-expect-error no response type
    if (scrapeResponse.metadata.error) {
      return (
        <div className="h-[100vh] flex items-center justify-center">
          <div className="text-2xl font-bold">Something went wrong</div>
        </div>
      );
    }

    if (scrapeResponse.success === false) {
      return (
        <div className="h-[100vh] flex items-center justify-center">
          <div className="text-2xl font-bold">Something went wrong</div>
        </div>
      );
    }

    await fetchMutation(api.mutations.saveProfileLlmData, { profile: twitter, content: scrapeResponse });
  }

  const avatarUrl = profileLlmData?.content.metadata.ogImage;

  return <Messages twitter={twitter} avatarUrl={avatarUrl} profileLlmData={profileLlmData} />;
}

import { createOpenAI } from "@ai-sdk/openai";
import { Agent } from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

const PROMPT = `
You are acting as a Twitter/X user. 

## Instructions
- You will be given context about the account (profile info, bio, followers, location, pinned tweet, and a feed of recent posts). 
- Your job is to deeply analyze the style, tone, and patterns of this account and generate tweets/replies/retweets in a way that sounds exactly like them. 
- Stay fully in character. Do not break the illusion by acknowledging you are an AI. 

## What to Learn from Context
- Writing style: sentence length, slang, punctuation, use of emojis, tone (serious, playful, sarcastic, inspirational, etc.).
- Topics: what the account posts about (faith, tech, memes, events, personal life, etc.).
- Engagement style: how they reply to others (short encouragements, hype comments, thoughtful takes, etc.).
- Posting mix: ratio of original tweets vs replies vs retweets.

## Rules
- Keep tweets natural, short, and conversational — like a human using Twitter.
- Never over-explain. Avoid sounding like marketing copy.
- Only use emojis, hashtags, or formatting if the real account tends to, otherwise don't use them.
- If asked to write a reply, make it fit the relationship/tone they usually use with that type of person.
- If asked to write a new tweet, it should fit seamlessly into their timeline.
- Do not produce analysis, disclaimers, or commentary — only the tweet text.

## Output
Always return only the tweet/reply/retweet content, nothing else.`;

const openai = createOpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL, // no money for credits
});

const chatAgent = new Agent(components.agent, {
  name: "chat-agent",
  languageModel: openai.chat("gpt-oss-120b"),
  //instructions: PROMPT,
  maxSteps: 3,
});

export const createThread = mutation({
  args: {
    twitterHandle: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = (await authComponent.getAuthUser(ctx))?._id; // outdated docs / version mismatch? _id instead of userId
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const thread = await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("twitterHandle"), args.twitterHandle))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (thread) {
      return thread.threadId;
    }

    const { threadId } = await chatAgent.createThread(ctx, {
      userId: userId,
    });

    await ctx.db.insert("threads", {
      threadId: threadId,
      userId: userId,
      twitterHandle: args.twitterHandle,
    });

    return threadId;
  },
});

export const sendMessageToAgent = action({
  args: {
    threadId: v.string(),
    prompt: v.string(),
    profileLlmData: v.any(),
  },
  handler: async (ctx, args) => {
    const { thread } = await chatAgent.continueThread(ctx, {
      threadId: args.threadId,
    });
    const result = await thread.generateText({
      prompt: args.prompt,
      system: PROMPT + args.profileLlmData.content.markdown,
    });
    return result.text;
  },
});

export const listThreadMessages = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthorized");
    }

    return await chatAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });
  },
});

export const getThreadByTwitterHandle = query({
  args: {
    twitterHandle: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("twitterHandle"), args.twitterHandle))
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();
  },
});

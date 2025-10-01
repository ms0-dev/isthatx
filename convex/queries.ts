import { v } from "convex/values";
import { query } from "./_generated/server";

export const getProfileLlmData = query({
  args: {
    profile: v.string(),
  },
  handler: async (ctx, args) => {
    const data = await ctx.db
      .query("profileLlmData")
      .filter((q) => q.eq(q.field("profile"), args.profile))
      .first();

    return data;
  },
});

export const getUsage = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const data = await ctx.db
      .query("usage")
      .filter((q) => q.eq(q.field("userId"), user.subject))
      .first();

    return data;
  },
});

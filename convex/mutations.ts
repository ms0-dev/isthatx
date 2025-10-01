import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const saveProfileLlmData = mutation({
  args: {
    profile: v.string(),
    content: v.any(),
  },
  handler: async (ctx, args) => {
    const oldData = await ctx.db
      .query("profileLlmData")
      .filter((q) => q.eq(q.field("profile"), args.profile))
      .first();

    if (oldData) {
      await ctx.db.delete(oldData._id);
    }

    await ctx.db.insert("profileLlmData", {
      profile: args.profile,
      content: args.content,
    });
  },
});

export const saveUsage = mutation({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const usage = await ctx.db
      .query("usage")
      .filter((q) => q.eq(q.field("userId"), user.subject))
      .first();

    if (!usage) {
      await ctx.db.insert("usage", {
        userId: user.subject,
        value: +1,
      });
    } else {
      await ctx.db.patch(usage._id, {
        value: usage.value + 1,
      });
    }
  },
});

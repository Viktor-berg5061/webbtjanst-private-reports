import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { reportContentValidator, validateReportContent } from "./reportContract";

export const resolveByTokenHash = internalQuery({
  args: { tokenHash: v.string(), now: v.number() },
  returns: v.union(v.null(), v.object({
    content: reportContentValidator,
    expiresAt: v.optional(v.number()),
    updatedAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const report = await ctx.db.query("reports")
      .withIndex("by_token_hash", (q) => q.eq("tokenHash", args.tokenHash)).unique();
    if (!report || report.status !== "published") return null;
    if (report.expiresAt !== undefined && report.expiresAt <= args.now) return null;
    return { content: report.content, expiresAt: report.expiresAt, updatedAt: report.updatedAt };
  },
});

export const upsertPublished = internalMutation({
  args: {
    tokenHash: v.string(),
    content: reportContentValidator,
    expiresAt: v.optional(v.number()),
    now: v.number(),
  },
  returns: v.object({ version: v.number() }),
  handler: async (ctx, args) => {
    const contentErrors = validateReportContent(args.content);
    if (contentErrors.length > 0) {
      throw new Error(`invalid report content: ${contentErrors.join("; ")}`);
    }
    const existing = await ctx.db.query("reports")
      .withIndex("by_token_hash", (q) => q.eq("tokenHash", args.tokenHash)).unique();
    if (existing) {
      const version = existing.version + 1;
      await ctx.db.patch(existing._id, {
        content: args.content, expiresAt: args.expiresAt, status: "published",
        updatedAt: args.now, version,
      });
      return { version };
    }
    await ctx.db.insert("reports", {
      tokenHash: args.tokenHash, content: args.content, expiresAt: args.expiresAt,
      status: "published", createdAt: args.now, updatedAt: args.now, version: 1,
    });
    return { version: 1 };
  },
});

export const revoke = internalMutation({
  args: { tokenHash: v.string(), now: v.number() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("reports")
      .withIndex("by_token_hash", (q) => q.eq("tokenHash", args.tokenHash)).unique();
    if (!existing) return false;
    await ctx.db.patch(existing._id, { status: "revoked", updatedAt: args.now });
    return true;
  },
});

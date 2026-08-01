import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { reportContentValidator } from "./reportContract";

export { reportContentValidator } from "./reportContract";

export default defineSchema({
  reports: defineTable({
    tokenHash: v.string(),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("revoked")),
    content: reportContentValidator,
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    version: v.number(),
  }).index("by_token_hash", ["tokenHash"]),
});

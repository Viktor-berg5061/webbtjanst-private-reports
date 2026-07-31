import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const reportContentValidator = v.object({
  companyName: v.string(),
  contactName: v.optional(v.string()),
  title: v.string(),
  introduction: v.string(),
  observations: v.array(v.string()),
  recommendation: v.object({
    summary: v.string(),
    website: v.string(),
    receptionist: v.string(),
    pricing: v.string(),
  }),
  nextSteps: v.array(v.string()),
  neededFromCustomer: v.array(v.string()),
  disclaimer: v.optional(v.string()),
  theme: v.optional(v.object({
    accent: v.optional(v.string()),
    tone: v.optional(v.union(v.literal("neutral"), v.literal("warm"), v.literal("technical"))),
  })),
});

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

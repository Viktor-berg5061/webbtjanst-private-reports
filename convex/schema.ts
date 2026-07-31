import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Report content schema.
 *
 * The required fields below are populated by every published report. The
 * `presentation` object is OPTIONAL: existing reports published before the
 * editorial redesign simply omit it and fall back to the same calm shell,
 * which guarantees backwards compatibility — old reports still render safely.
 *
 * New reports use `presentation` to enable the editorial visual direction
 * (situation overview, signal cards, value-flow diagram, three concept
 * previews, comparison, full pricing overview). Every field is optional and
 * additive; no field has been renamed or removed.
 */
export const reportContentValidator = v.object({
  // Core (unchanged, required)
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

  // Presentation (optional, additive — old reports omit and still render)
  highlights: v.optional(v.array(v.string())),
  situation: v.optional(v.object({
    headline: v.string(),
    body: v.string(),
  })),
  comparison: v.optional(v.object({
    before: v.array(v.string()),
    after: v.array(v.string()),
  })),
  valueFlow: v.optional(v.array(v.object({
    stage: v.string(),
    description: v.string(),
  }))),
  conceptPreviews: v.optional(v.array(v.object({
    id: v.string(),
    name: v.string(),
    artDirection: v.string(),
    blurb: v.string(),
    bodyHtml: v.string(),
    bodyCss: v.string(),
  }))),
  pricingOverview: v.optional(v.object({
    tiers: v.array(v.object({
      id: v.string(),
      name: v.string(),
      tagline: v.string(),
      recommended: v.boolean(),
      website: v.string(),
      receptionist: v.string(),
      extraMinutes: v.string(),
      maintenance: v.optional(v.string()),
      notes: v.optional(v.string()),
    })),
    vatNote: v.string(),
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

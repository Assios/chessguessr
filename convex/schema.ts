import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  puzzles: defineTable({
    puzzleId: v.number(),
    date: v.string(),
    fen: v.string(),
    solution: v.array(v.string()),
    gameUrl: v.string(),
    white: v.string(),
    black: v.string(),
    wAka: v.optional(v.string()),
    bAka: v.optional(v.string()),
    wTitle: v.optional(v.string()),
    bTitle: v.optional(v.string()),
    wRating: v.union(v.number(), v.string(), v.null()),
    bRating: v.union(v.number(), v.string(), v.null()),
    event: v.optional(v.string()),
    eventUrl: v.optional(v.string()),
    variant: v.optional(v.string()),
    // Aggregate stats (replaces Firebase)
    solved: v.number(),
    failed: v.number(),
    totalTurns: v.number(),
  })
    .index('by_date', ['date'])
    .index('by_puzzleId', ['puzzleId']),
});

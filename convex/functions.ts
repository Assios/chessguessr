import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getDailyPuzzle = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('puzzles')
      .withIndex('by_date', (q) => q.eq('date', args.date))
      .first();
  },
});

export const getPuzzleById = query({
  args: { puzzleId: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('puzzles')
      .withIndex('by_puzzleId', (q) => q.eq('puzzleId', args.puzzleId))
      .first();
  },
});

export const getAllPuzzles = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('puzzles').collect();
  },
});

export const incrementSolved = mutation({
  args: { puzzleId: v.number(), turns: v.number() },
  handler: async (ctx, args) => {
    const puzzle = await ctx.db
      .query('puzzles')
      .withIndex('by_puzzleId', (q) => q.eq('puzzleId', args.puzzleId))
      .first();
    if (!puzzle) return;
    await ctx.db.patch(puzzle._id, {
      solved: puzzle.solved + 1,
      totalTurns: puzzle.totalTurns + args.turns,
    });
  },
});

export const incrementFailed = mutation({
  args: { puzzleId: v.number() },
  handler: async (ctx, args) => {
    const puzzle = await ctx.db
      .query('puzzles')
      .withIndex('by_puzzleId', (q) => q.eq('puzzleId', args.puzzleId))
      .first();
    if (!puzzle) return;
    await ctx.db.patch(puzzle._id, {
      failed: puzzle.failed + 1,
    });
  },
});

export const seedPuzzles = mutation({
  args: {
    puzzles: v.array(
      v.object({
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
        solved: v.number(),
        failed: v.number(),
        totalTurns: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const puzzle of args.puzzles) {
      await ctx.db.insert('puzzles', puzzle);
    }
  },
});

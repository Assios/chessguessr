import { ConvexHttpClient } from 'convex/browser';

const CONVEX_URL = process.env.CONVEX_URL!;

// Server-side client for use in Remix loaders
export const convexClient = new ConvexHttpClient(CONVEX_URL);

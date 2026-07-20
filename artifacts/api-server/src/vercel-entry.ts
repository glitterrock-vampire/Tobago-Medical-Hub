/**
 * Vercel Serverless Entry Point
 *
 * Exports the Express app as the default export so @vercel/node can wrap it
 * as a serverless handler.  Does NOT call app.listen() — Vercel manages the
 * server lifecycle.
 *
 * Built by build-vercel.mjs → api/index.mjs at the monorepo root.
 */
export { default } from './app.js';

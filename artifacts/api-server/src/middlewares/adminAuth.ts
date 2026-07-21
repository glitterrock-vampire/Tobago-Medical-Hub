import { clerkClient, getAuth } from "@clerk/express";
import type { RequestHandler } from "express";

function parseAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export const requireAdmin: RequestHandler = async (req, res, next) => {
  const allowDevAdminBypass =
    process.env.NODE_ENV !== "production" && process.env.DEV_ADMIN_BYPASS !== "false";

  if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    if (allowDevAdminBypass) {
      return next();
    }

    return res.status(503).json({ error: "Clerk is not configured" });
  }

  const auth = getAuth(req);
  const userId = auth?.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const adminEmails = parseAdminEmails();
  if (adminEmails.size === 0) {
    return next();
  }

  let emails: string[];
  try {
    const user = await clerkClient.users.getUser(userId);
    emails = user.emailAddresses.map((email) =>
      email.emailAddress.toLowerCase(),
    );
  } catch (err) {
    req.log?.error?.({ err, userId }, "Failed to load Clerk user for admin check");
    return res.status(403).json({ error: "Forbidden" });
  }

  if (!emails.some((email) => adminEmails.has(email))) {
    return res.status(403).json({ error: "Forbidden" });
  }

  return next();
};

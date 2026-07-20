export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("Database is not configured");
    this.name = "DatabaseNotConfiguredError";
  }
}

export function isDatabaseNotConfiguredError(err: unknown) {
  return err instanceof DatabaseNotConfiguredError;
}

export async function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new DatabaseNotConfiguredError();
  }

  try {
    const { db } = await import("@workspace/db");
    return db;
  } catch (err) {
    if (err instanceof Error && err.message.includes("DATABASE_URL must be set")) {
      throw new DatabaseNotConfiguredError();
    }

    throw err;
  }
}

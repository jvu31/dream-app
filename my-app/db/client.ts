import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const dreamDb = openDatabaseSync("dream.db", { enableChangeListener: true})

export const db = drizzle(dreamDb)
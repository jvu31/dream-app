import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import * as schema from "./schema";

const db = useSQLiteContext();
const drizzleDb = drizzle(db, { schema });

// Fetch all journal entries, can filter from a search (if query is in the content) or tags (if entry contains a tag of mood or person)
export const fetchAllEntries = async ({
  query,
  tag
}: {
  query: string;
  tag: string;
}) => {
    
};

// Fetch a journal entry
export const fetchEntry = async (id: number) => {
  if (isNaN(id)) {
    throw new Error("Invalid entry ID");
  }
  
  
  const entry = await drizzleDb
    .select()
    .from(schema.entry)
    .where(eq(schema.entry.entry_id, id))
    .get();

  if (!entry) {
    throw new Error("Entry not found");
  }

  return entry;
};

// Add a journal entry
export const addEntry = async (entry: any) => {
    try {
        drizzleDb.insert(schema.entry).values(entry).run();
    } catch (error) {
        console.error(error)
        throw new Error("Unable to add entry");
    }
}

// Remove a journal entry
export const removeEntry = async (id: number) => {
    if (isNaN(id)) {
        throw new Error("Invalid entry ID");
    }

    try {
        drizzleDb.delete(schema.entry).where(eq(schema.entry.entry_id, id)).run();
    } catch (error) {
        console.error(error)
        throw new Error("Unable to delete entry");
    }
}

// Edit a journal entry (changing the content, recording, pin)
export const editEntry = async (id: number, entry: any) => {
    if (isNaN(id)) {
        throw new Error("Invalid entry ID");
    }

    try {
        drizzleDb.update(schema.entry).set(entry).where(eq(schema.entry.entry_id, id)).run();
    } catch (error) {
        console.error(error)
        throw new Error("Unable to edit entry");
    }
}


// Fetch a recording
export const fetchRecording = async (id: number) => {
    if (isNaN(id)) {
        throw new Error("Invalid recording ID");
    }
    
    const recording = await drizzleDb
        .select()
        .from(schema.recording)
        .where(eq(schema.recording.recording_id, id))
        .get();

    if (!recording) {
        throw new Error("Recording not found");
    }

    return recording;
}



// Adding a recording to an entry (transcription added to entry content)

// Removing a recording

// Fetch all alarms

// Fetch an alarm

// Add an alarm

// Edit an alarm

// Remove an alarm

// Fetch all ringtones

// Fetch a ringtone

// Add a ringtone

// Edit a ringtone

// Remove a ringtone

// Fetch a tag

// Add a tag

// Edit a tag

// Remove a tag

// Fetch an entry's tags

// Fetch a tag's entries

// Fetch a summary

// Add a summary

// Edit a summary

// Remove a summary

// Fetch a summary's entries

import { eq, InferInsertModel, InferSelectModel, Column } from "drizzle-orm";
import * as schema from "./schema";
import { SQLiteTable } from "drizzle-orm/sqlite-core";
import {db} from "./client"


// --- Generic Helper Functions ---

async function genericFetchOne<TTable extends SQLiteTable, TIdColumn extends Column<any, any, any>>(
    table: TTable,
    idColumn: TIdColumn,
    id: number,
    itemName: string
): Promise<InferSelectModel<TTable>> {
    if (isNaN(id)) {
        throw new Error(`Invalid ${itemName} ID`);
    }
    const item = await db
        .select()
        .from(table)
        .where(eq(idColumn, id))
        .get();

    if (!item) {
        throw new Error(`${itemName} not found`);
    }
    return item as InferSelectModel<TTable>;
}

async function genericFetchAll<TTable extends SQLiteTable>(
    table: TTable
): Promise<InferSelectModel<TTable>[]> {
    const items = await db
        .select()
        .from(table)
        .all();
    return items as InferSelectModel<TTable>[];
}

async function genericInsert<TTable extends SQLiteTable>(
    table: TTable,
    data: InferInsertModel<TTable>,
    itemName: string
): Promise<void> {
    try {
        await db.insert(table).values(data).run();
    } catch (error) {
        console.error(`Error adding ${itemName}:`, error);
        throw new Error(`Unable to add ${itemName}`);
    }
}

async function genericDelete<TTable extends SQLiteTable, TIdColumn extends Column<any, any, any>>(
    table: TTable,
    idColumn: TIdColumn,
    id: number,
    itemName: string
): Promise<void> {
    if (isNaN(id)) {
        throw new Error(`Invalid ${itemName} ID`);
    }
    try {
        await db.delete(table).where(eq(idColumn, id)).run();
    } catch (error) {
        console.error(`Error deleting ${itemName}:`, error);
        throw new Error(`Unable to delete ${itemName}`);
    }
}

async function genericUpdate<TTable extends SQLiteTable, TIdColumn extends Column<any, any, any>>(
    table: TTable,
    idColumn: TIdColumn,
    id: number,
    data: Partial<InferInsertModel<TTable>>,
    itemName: string
): Promise<void> {
    if (isNaN(id)) {
        throw new Error(`Invalid ${itemName} ID`);
    }
    try {
        await db.update(table).set(data).where(eq(idColumn, id)).run();
    } catch (error) {
        console.error(`Error editing ${itemName}:`, error);
        throw new Error(`Unable to edit ${itemName}`);
    }
}




// --- Entry Queries ---

// Fetch all journal entries, can filter from a search (if query is in the content) or tags (if entry contains a tag of mood or person)
export const fetchAllEntries = async ({
  query,
  tag,
  pin
}: {
  query: string;
  tag: string;
  pin: number
}) => {    
    
    return [];
};

// Fetch a journal entry
export const fetchEntry = async (id: number) => {
  return genericFetchOne(schema.entry, schema.entry.entry_id, id, "Entry");
};

// Add a journal entry
export const addEntry = async (entryData: InferInsertModel<typeof schema.entry>) => {
    await genericInsert(schema.entry, entryData, "entry");
}

// Remove a journal entry
export const removeEntry = async (id: number) => {
    await genericDelete(schema.entry, schema.entry.entry_id, id, "entry");
}

// Edit a journal entry (changing the content, recording, pin)
export const editEntry = async (id: number, entryData: Partial<InferInsertModel<typeof schema.entry>>) => {
    await genericUpdate(schema.entry, schema.entry.entry_id, id, entryData, "entry");
}



// --- Recording Queries ---

// Fetch a recording
export const fetchRecording = async (id: number) => {
    return genericFetchOne(schema.recording, schema.recording.recording_id, id, "Recording");
}

// Adding a recording to an entry (transcription added to entry content later)
export const addRecording = async (recordingData: InferInsertModel<typeof schema.recording>) => {   
    await genericInsert(schema.recording, recordingData, "recording");
}

// Removing a recording
export const removeRecording = async (id: number) => {
    await genericDelete(schema.recording, schema.recording.recording_id, id, "recording");
}



// --- Alarm Queries ---

// Fetch all alarms
export const fetchAllAlarms = async () => {
    return genericFetchAll(schema.alarm);
}

// Fetch an alarm
export const fetchAlarm = async (id: number) => {
    return genericFetchOne(schema.alarm, schema.alarm.alarm_id, id, "Alarm");
}

// Add an alarm
export const addAlarm = async (alarmData: InferInsertModel<typeof schema.alarm>) => {
    await genericInsert(schema.alarm, alarmData, "alarm");
}

// Edit an alarm
export const editAlarm = async (id: number, alarmData: Partial<InferInsertModel<typeof schema.alarm>>) => {
    await genericUpdate(schema.alarm, schema.alarm.alarm_id, id, alarmData, "alarm");
}

// Remove an alarm
export const removeAlarm = async (id: number) => {
    await genericDelete(schema.alarm, schema.alarm.alarm_id, id, "alarm");
}



// --- Ringtone Queries ---

// Fetch all ringtones
export const fetchAllRingtones = async () => {
    return genericFetchAll(schema.ringtone);
}

// Fetch a ringtone
export const fetchRingtone = async (id: number) => {
    return genericFetchOne(schema.ringtone, schema.ringtone.ringtone_id, id, "Ringtone");
}

// Add a ringtone
export const addRingtone = async (ringtoneData: InferInsertModel<typeof schema.ringtone>) => {
    await genericInsert(schema.ringtone, ringtoneData, "ringtone");
}

// Edit a ringtone
export const editRingtone = async (id: number, ringtoneData: Partial<InferInsertModel<typeof schema.ringtone>>) => {
    await genericUpdate(schema.ringtone, schema.ringtone.ringtone_id, id, ringtoneData, "ringtone");
}

// Remove a ringtone
export const removeRingtone = async (id: number) => {
    await genericDelete(schema.ringtone, schema.ringtone.ringtone_id, id, "ringtone");
}



// --- Tag Queries ---

// Fetch all tags
export const fetchAllTags = async () => {
    return genericFetchAll(schema.tag);
}

// Fetch a tag
export const fetchTag = async (id: number) => {
    return genericFetchOne(schema.tag, schema.tag.tag_id, id, "Tag");
}

// Add a tag
export const addTag = async (tagData: InferInsertModel<typeof schema.tag>) => {
    await genericInsert(schema.tag, tagData, "tag");
}

// Edit a tag
export const editTag = async (id: number, tagData: Partial<InferInsertModel<typeof schema.tag>>) => {
    await genericUpdate(schema.tag, schema.tag.tag_id, id, tagData, "tag");
}

// Remove a tag
export const removeTag = async (id: number) => {
    await genericDelete(schema.tag, schema.tag.tag_id, id, "tag");
}



// --- Entry_Tag Queries (linking table operations) ---

// Fetch an entry's tags
export const fetchEntryTags = async (entryId: number) => {
    
}

// Fetch a tag's entries
export const fetchTagEntries = async (tagId: number) => {
    
}

// Add a tag to an entry
export const addTagToEntry = async (entryId: number, tagId: number) => {
    
}

// Remove a tag from an entry
export const removeTagFromEntry = async (entryId: number, tagId: number) => {
    
}



// --- Summary Queries ---

// Fetch all summaries
export const fetchAllSummaries = async () => {
    return genericFetchAll(schema.summary);
}

// Fetch a summary
export const fetchSummary = async (id: number) => {
    return genericFetchOne(schema.summary, schema.summary.summary_id, id, "Summary");
}

// Add a summary
export const addSummary = async (summaryData: InferInsertModel<typeof schema.summary>) => {
    await genericInsert(schema.summary, summaryData, "summary");
}

// Edit a summary
export const editSummary = async (id: number, summaryData: Partial<InferInsertModel<typeof schema.summary>>) => {
    await genericUpdate(schema.summary, schema.summary.summary_id, id, summaryData, "summary");
}

// Remove a summary
export const removeSummary = async (id: number) => {
    await genericDelete(schema.summary, schema.summary.summary_id, id, "summary");
}


// --- Summary_Entry Queries (linking table operations) ---

// Fetch a summary's entries
export const fetchSummaryEntries = async (summaryId: number) => {
    
}

// Add an entry to a summary
export const addEntryToSummary = async (summaryId: number, entryId: number) => {
    
}

// Remove an entry from a summary
export const removeEntryFromSummary = async (summaryId: number, entryId: number) => {
    
}

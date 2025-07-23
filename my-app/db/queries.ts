import { eq, InferInsertModel, InferSelectModel, Column, like, and, inArray } from 'drizzle-orm';
import * as schema from './schema';
import { SQLiteTable } from 'drizzle-orm/sqlite-core';
import { db } from './client';

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
  const item = await db.select().from(table).where(eq(idColumn, id)).get();

  if (!item) {
    throw new Error(`${itemName} not found`);
  }
  return item as InferSelectModel<TTable>;
}

function genericFetchAll<TTable extends SQLiteTable>(table: TTable) {
  //console.log(`Building query to fetch all from ${table}`);
  return db.select().from(table);
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

export async function genericUpdate<
  TTable extends SQLiteTable,
  TIdColumn extends Column<any, any, any>,
  TColumn extends keyof InferInsertModel<TTable>,
>(
  table: TTable,
  idColumn: TIdColumn,
  idValue: number,
  column: TColumn,
  value: InferInsertModel<TTable>[TColumn]
): Promise<void> {
  if (isNaN(idValue)) {
    throw new Error(`Invalid ID`);
  }
  try {
    await db
      .update(table as any)
      .set({ [column]: value })
      .where(eq(idColumn, idValue));
  } catch (err) {
    console.log('Error editing entry:', err);
  }
}

// --- Entry Queries ---

// Fetch all journal entries, can filter from a search (if query is in the content) or tags (if entry contains a tag of mood or person)
export const fetchAllEntries = ({
  query = '',
  tag_ids = [],
  pin = 0,
}: {
  query?: string;
  tag_ids?: number[];
  pin?: number;
}) => {
  const conditions = [];

  if (query) {
    conditions.push(like(schema.entry.content, `%${query}%`));
  }

  if (pin === 1) {
    conditions.push(eq(schema.entry.pinned, 1));
  }

  let baseQuery = db.select().from(schema.entry);

  let joinedQuery: any = null;
  if (Array.isArray(tag_ids) && tag_ids.length > 0) {
    // If tag_ids is an array and has elements, construct a joined query
    joinedQuery = db
      .select()
      .from(schema.entry)
      .innerJoin(schema.entry_tag, eq(schema.entry.entry_id, schema.entry_tag.entry_id))
      .innerJoin(schema.tag, eq(schema.entry_tag.tag_id, schema.tag.tag_id));

    // Add a condition to filter by the provided tag IDs
    conditions.push(inArray(schema.tag.tag_id, tag_ids));
  }


  if (conditions.length > 0) {
    if (joinedQuery) {
      console.log('Returning joined query: ', conditions)
      return joinedQuery.where(and(...conditions));
    } else {
      return baseQuery.where(and(...conditions));
    }
  }

  console.log('Returning base query: ', conditions);
  return baseQuery;
};

export const fetchAllEntriesTest = () => {
  return genericFetchAll(schema.entry);

};

// Fetch a journal entry
export const fetchEntry = async (id: number) => {
  return genericFetchOne(schema.entry, schema.entry.entry_id, id, 'Entry');
};

// Add a journal entry
export const addEntry = async (entryData: InferInsertModel<typeof schema.entry>) => {
  await genericInsert(schema.entry, entryData, 'entry');
};

// Remove a journal entry
export const removeEntry = async (id: number) => {
  await genericDelete(schema.entry, schema.entry.entry_id, id, 'entry');
};

// Edit a journal entry
export const editEntry = async (entry_id: number, entry_data: any, entry_type: any) => {
  genericUpdate(schema.entry, schema.entry.entry_id, entry_id, entry_type, entry_data);
  console.log('Entry updated!');
};

// --- Recording Queries ---

// Fetch a recording
export const fetchRecording = async (id: number) => {
  return genericFetchOne(schema.recording, schema.recording.recording_id, id, 'Recording');
};

// Adding a recording to an entry (transcription added to entry content later)
export const addRecording = async (recordingData: InferInsertModel<typeof schema.recording>) => {
  await genericInsert(schema.recording, recordingData, 'recording');
};

// Removing a recording
export const removeRecording = async (id: number) => {
  await genericDelete(schema.recording, schema.recording.recording_id, id, 'recording');
};

// --- Alarm Queries ---

// Fetch all alarms
export const fetchAllAlarms = async () => {
  return genericFetchAll(schema.alarm);
};

// Fetch an alarm
export const fetchAlarm = async (id: number) => {
  return genericFetchOne(schema.alarm, schema.alarm.alarm_id, id, 'Alarm');
};

// Add an alarm
export const addAlarm = async (alarmData: InferInsertModel<typeof schema.alarm>) => {
  await genericInsert(schema.alarm, alarmData, 'alarm');
};

/*
// Edit an alarm
export const editAlarm = async (
  id: number,
  alarmData: Partial<InferInsertModel<typeof schema.alarm>>
) => {
  await genericUpdate(schema.alarm, schema.alarm.alarm_id, id, alarmData, 'alarm');
};*/

// Remove an alarm
export const removeAlarm = async (id: number) => {
  await genericDelete(schema.alarm, schema.alarm.alarm_id, id, 'alarm');
};

// --- Ringtone Queries ---

// Fetch all ringtones
export const fetchAllRingtones = async () => {
  return genericFetchAll(schema.ringtone);
};

// Fetch a ringtone
export const fetchRingtone = async (id: number) => {
  return genericFetchOne(schema.ringtone, schema.ringtone.ringtone_id, id, 'Ringtone');
};

// Add a ringtone
export const addRingtone = async (ringtoneData: InferInsertModel<typeof schema.ringtone>) => {
  await genericInsert(schema.ringtone, ringtoneData, 'ringtone');
};

/*
// Edit a ringtone
export const editRingtone = async (
  id: number,
  ringtoneData: Partial<InferInsertModel<typeof schema.ringtone>>
) => {
  await genericUpdate(schema.ringtone, schema.ringtone.ringtone_id, id, ringtoneData, 'ringtone');
};*/

// Remove a ringtone
export const removeRingtone = async (id: number) => {
  await genericDelete(schema.ringtone, schema.ringtone.ringtone_id, id, 'ringtone');
};

// --- Tag Queries ---

// Fetch all tags
export const fetchAllTags = async () => {
  return genericFetchAll(schema.tag);
};

// Fetch a tag
export const fetchTag = async (id: number) => {
  return genericFetchOne(schema.tag, schema.tag.tag_id, id, 'Tag');
};

// Add a tag
export const addTag = async (tagData: InferInsertModel<typeof schema.tag>) => {
  await genericInsert(schema.tag, tagData, 'tag');
};

/*
// Edit a tag
export const editTag = async (
  id: number,
  tagData: Partial<InferInsertModel<typeof schema.tag>>
) => {
  await genericUpdate(schema.tag, schema.tag.tag_id, id, tagData, 'tag');
};*/

export const editTag = async (tag_id, tag_data, tag_type) => {
  genericUpdate(schema.tag, schema.tag.tag_id, tag_id, tag_type, tag_data);
  console.log('Tag updated!');
}

// Remove a tag
export const removeTag = async (id: number) => {
  await genericDelete(schema.tag, schema.tag.tag_id, id, 'tag');
};

// --- Entry_Tag Queries (linking table operations) ---

// Fetch all tags for a given entry
export const fetchEntryTags = async (entryId: number) => {
  const data = await db
    .select({
      entry_tag_id: schema.entry_tag.entry_tag_id,
      entry_id: schema.entry_tag.entry_id,
      tag_id: schema.tag.tag_id,
      name: schema.tag.name,
      type: schema.tag.type,
      color: schema.tag.color,
    })
    .from(schema.entry_tag)
    .where(eq(schema.entry_tag.entry_id, entryId))
    .innerJoin(schema.tag, eq(schema.entry_tag.tag_id, schema.tag.tag_id))
    .all();

  return data; // Example: [{ entryTagId: 1, entryId: 1, tagId: 2, name: 'Happy', ... }]
};

// Fetch a tag's entries
// Fetch all entries for a given tag
export const fetchTagEntries = async (tag_id: number) => {
  const data = await db
    .select({
      entryTagId: schema.entry_tag.entry_tag_id,
      tagId: schema.entry_tag.tag_id,
      entryId: schema.entry.entry_id,
      time: schema.entry.time,
      content: schema.entry.content,
      pinned: schema.entry.pinned,
    })
    .from(schema.entry_tag)
    .where(eq(schema.entry_tag.tag_id, tag_id))
    .innerJoin(schema.entry, eq(schema.entry_tag.entry_id, schema.entry.entry_id))
    .all();

  return data; // Example: [{ entryTagId: 1, tagId: 2, entryId: 1, ... }]
};

// Add a tag to an entry
export const addTagToEntry = async (entry_id: number, tag_id: number) => {
  await genericInsert(schema.entry_tag, { entry_id, tag_id }, 'entry_tag');
  console.log('Added tag to entry!');
};

// Remove a tag from an entry
export const removeTagFromEntry = async (entry_id: number, tag_id: number) => {
  await db.delete(schema.entry_tag).where(and(eq(schema.entry_tag.entry_id, entry_id), eq(schema.entry_tag.tag_id, tag_id))).run();
  console.log('Removed tag from entry!');
};

// --- Summary Queries ---

// Fetch all summaries
export const fetchAllSummaries = async () => {
  return genericFetchAll(schema.summary);
};

// Fetch a summary
export const fetchSummary = async (id: number) => {
  return genericFetchOne(schema.summary, schema.summary.summary_id, id, 'Summary');
};

// Add a summary
export const addSummary = async (summaryData: InferInsertModel<typeof schema.summary>) => {
  await genericInsert(schema.summary, summaryData, 'summary');
};

/*
// Edit a summary
export const editSummary = async (
  id: number,
  summaryData: Partial<InferInsertModel<typeof schema.summary>>
) => {
  await genericUpdate(schema.summary, schema.summary.summary_id, id, summaryData, 'summary');
};

// Remove a summary
export const removeSummary = async (id: number) => {
  await genericDelete(schema.summary, schema.summary.summary_id, id, 'summary');
};*/

// --- Summary_Entry Queries (linking table operations) ---

// Fetch a summary's entries
export const fetchSummaryEntries = async (summaryId: number) => {};

// Add an entry to a summary
export const addEntryToSummary = async (summaryId: number, entryId: number) => {};

// Remove an entry from a summary
export const removeEntryFromSummary = async (summaryId: number, entryId: number) => {};

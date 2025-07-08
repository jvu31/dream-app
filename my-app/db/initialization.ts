import { db } from './client';

export const initDatabase = async () => {
  await db.run(`
    CREATE TABLE IF NOT EXISTS recording (
      recording_id INTEGER PRIMARY KEY AUTOINCREMENT,
      audio TEXT,
      length INTEGER
    );
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS ringtone (
      ringtone_id INTEGER PRIMARY KEY AUTOINCREMENT,
      track TEXT,
      volume INTEGER DEFAULT 50
    );
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS alarm (
      alarm_id INTEGER PRIMARY KEY AUTOINCREMENT,
      time TEXT,
      days TEXT DEFAULT '',
      snooze INTEGER DEFAULT 0,
      ringtone_id INTEGER,
      FOREIGN KEY(ringtone_id) REFERENCES ringtone(ringtone_id)
    );
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS entry (
      entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
      pinned INTEGER DEFAULT 0,
      time TEXT,
      content TEXT,
      recording_id INTEGER,
      FOREIGN KEY(recording_id) REFERENCES recording(recording_id) ON DELETE CASCADE
    );
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS tag (
      tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT DEFAULT 'mood',
      color TEXT DEFAULT '#000000'
    );
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS entry_tag (
      entry_tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_id INTEGER,
      tag_id INTEGER,
      FOREIGN KEY(entry_id) REFERENCES entry(entry_id),
      FOREIGN KEY(tag_id) REFERENCES tag(tag_id)
    );
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS summary (
      summary_id INTEGER PRIMARY KEY AUTOINCREMENT,
      start_date TEXT,
      range INTEGER DEFAULT 0,
      summary TEXT,
      image TEXT
    );
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS summary_entry (
      summary_entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
      summary_id INTEGER,
      entry_id INTEGER,
      FOREIGN KEY(summary_id) REFERENCES summary(summary_id),
      FOREIGN KEY(entry_id) REFERENCES entry(entry_id)
    );
  `);

  console.log('All tables initialized!');
};

export const createDummyData = async () => {
  try {
    // ✅ Insert ringtone
    await db.run(`
      INSERT INTO ringtone (track, volume)
      SELECT 'Morning Tune', 70
      WHERE NOT EXISTS (SELECT 1 FROM ringtone);
    `);

    // ✅ Insert alarms
    await db.run(`
      INSERT INTO alarm (time, days, snooze, ringtone_id)
      SELECT '07:30 AM', 'Mon,Tue,Wed', 5, 1
      WHERE NOT EXISTS (SELECT 1 FROM alarm WHERE time = '07:30 AM');
    `);

    // ✅ Insert recording
    await db.run(`
      INSERT INTO recording (audio, length)
      SELECT 'audio1.mp3', 180
      WHERE NOT EXISTS (SELECT 1 FROM recording);
    `);

    // ✅ Insert mood tags
    const moodTags = [
      { name: 'Happy', color: '#0dff00' },
      { name: 'Grateful', color: '#ff9900' },
      { name: 'Relaxed', color: '#0099ff' },
    ];

    for (const tag of moodTags) {
      await db.run(`
        INSERT INTO tag (name, type, color)
        SELECT '${tag.name}', 'mood', '${tag.color}'
        WHERE NOT EXISTS (SELECT 1 FROM tag WHERE name = '${tag.name}');
      `);
    }

    // ✅ Insert people tags
    const peopleTags = [
      { name: 'Family', color: '' },
      { name: 'Friends', color: '' },
      { name: 'Partner', color: '' },
      { name: 'Colleagues', color: '' },
    ];

    for (const tag of peopleTags) {
      await db.run(`
        INSERT INTO tag (name, type, color)
        SELECT '${tag.name}', 'people', '${tag.color}'
        WHERE NOT EXISTS (SELECT 1 FROM tag WHERE name = '${tag.name}');
      `);
    }

    // ✅ Insert entries
    const entries = [
      { pinned: 1, time: '2025-05-10T08:00:00', content: 'May entry one.', recording_id: 1 },
      { pinned: 0, time: '2025-05-15T09:15:00', content: 'May entry two.', recording_id: 1 },
      { pinned: 0, time: '2025-06-01T07:45:00', content: 'June entry one.', recording_id: 1 },
      { pinned: 0, time: '2025-06-15T10:30:00', content: 'June entry two.', recording_id: 1 },
      { pinned: 1, time: '2025-07-01T06:30:00', content: 'July entry one.', recording_id: 1 },
      { pinned: 0, time: '2025-07-05T08:00:00', content: 'July entry two.', recording_id: 1 },
      { pinned: 0, time: '2025-07-10T09:00:00', content: 'July entry three.', recording_id: 1 },
    ];

    const insertedEntryIds: Record<string, number> = {};

    for (const entry of entries) {
      await db.run(`
        INSERT INTO entry (pinned, time, content, recording_id)
        SELECT ${entry.pinned}, '${entry.time}', '${entry.content}', ${entry.recording_id}
        WHERE NOT EXISTS (SELECT 1 FROM entry WHERE time = '${entry.time}');
      `);

      const result = await db.get<{ entry_id: number }>(`
        SELECT entry_id FROM entry WHERE time = '${entry.time}';
      `);

      if (result?.entry_id) {
        insertedEntryIds[entry.time] = result.entry_id;
      }
    }

    // ✅ Get all tag IDs
    const allTags = await db.all<{ tag_id: number, type: string }>(`SELECT tag_id, type FROM tag;`);

    // ✅ Link entries to random 3–8 tags each
    for (const entryTime of Object.keys(insertedEntryIds)) {
      const entryId = insertedEntryIds[entryTime];

      // Shuffle tags & pick random 3–8
      const shuffled = allTags.sort(() => 0.5 - Math.random());
      const selectedTags = shuffled.slice(0, Math.floor(Math.random() * 6) + 3); // 3–8

      for (const tag of selectedTags) {
        await db.run(`
          INSERT INTO entry_tag (entry_id, tag_id)
          SELECT ${entryId}, ${tag.tag_id}
          WHERE NOT EXISTS (
            SELECT 1 FROM entry_tag WHERE entry_id = ${entryId} AND tag_id = ${tag.tag_id}
          );
        `);
      }
    }

    // ✅ Insert summary & link to one entry
    await db.run(`
      INSERT INTO summary (start_date, range, summary, image)
      SELECT '2025-07-01', 7, 'This is a weekly summary.', 'image.png'
      WHERE NOT EXISTS (SELECT 1 FROM summary);
    `);

    const summary = await db.get<{ summary_id: number }>(`
      SELECT summary_id FROM summary WHERE start_date = '2025-07-01';
    `);

    if (summary?.summary_id && insertedEntryIds['2025-07-01T06:30:00']) {
      await db.run(`
        INSERT INTO summary_entry (summary_id, entry_id)
        SELECT ${summary.summary_id}, ${insertedEntryIds['2025-07-01T06:30:00']}
        WHERE NOT EXISTS (
          SELECT 1 FROM summary_entry WHERE summary_id = ${summary.summary_id} AND entry_id = ${insertedEntryIds['2025-07-01T06:30:00']}
        );
      `);
    }

    console.log('✅ Dummy data created: each entry has multiple moods & people tags!');
  } catch (err) {
    console.error('❌ Error creating dummy data:', err);
  }
};


export const clearDatabase = async () => {
  await db.run('DROP TABLE IF EXISTS recording');
  await db.run('DROP TABLE IF EXISTS ringtone');
  await db.run('DROP TABLE IF EXISTS alarm');
  await db.run('DROP TABLE IF EXISTS entry');
  await db.run('DROP TABLE IF EXISTS tag');
  await db.run('DROP TABLE IF EXISTS entry_tag');
  await db.run('DROP TABLE IF EXISTS summary');
  await db.run('DROP TABLE IF EXISTS summary_entry');
  console.log('All tables cleared!');
};

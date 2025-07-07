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
    // ✅ Insert a ringtone
    await db.run(`
      INSERT INTO ringtone (track, volume)
      SELECT 'Morning Tune', 70
      WHERE NOT EXISTS (SELECT 1 FROM ringtone);
    `);

    // ✅ Insert multiple alarms
    await db.run(`
      INSERT INTO alarm (time, days, snooze, ringtone_id)
      SELECT '07:30 AM', 'Mon,Tue,Wed', 5, 1
      WHERE NOT EXISTS (SELECT 1 FROM alarm WHERE time = '07:30 AM');
    `);

    await db.run(`
      INSERT INTO alarm (time, days, snooze, ringtone_id)
      SELECT '09:00 AM', 'Thu,Fri', 10, 1
      WHERE NOT EXISTS (SELECT 1 FROM alarm WHERE time = '09:00 AM');
    `);

    await db.run(`
      INSERT INTO alarm (time, days, snooze, ringtone_id)
      SELECT '06:15 AM', 'Sat,Sun', 0, 1
      WHERE NOT EXISTS (SELECT 1 FROM alarm WHERE time = '06:15 AM');
    `);

    // ✅ Insert a recording
    await db.run(`
      INSERT INTO recording (audio, length)
      SELECT 'audio1.mp3', 180
      WHERE NOT EXISTS (SELECT 1 FROM recording);
    `);

    // ✅ Insert tags
    await db.run(`
      INSERT INTO tag (name, type, color)
      SELECT 'Happy', 'mood', '#0dff00'
      WHERE NOT EXISTS (SELECT 1 FROM tag WHERE name = 'Happy');
    `);

    await db.run(`
      INSERT INTO tag (name, type, color)
      SELECT 'Grateful', 'mood', '#ff9900'
      WHERE NOT EXISTS (SELECT 1 FROM tag WHERE name = 'Grateful');
    `);

    await db.run(`
      INSERT INTO tag (name, type, color)
      SELECT 'Relaxed', 'mood', '#0099ff'
      WHERE NOT EXISTS (SELECT 1 FROM tag WHERE name = 'Relaxed');
    `);

    // ✅ Insert multiple entries across May, June, July
    const entries = [
      { pinned: 1, time: '2025-05-10T08:00:00', content: 'May entry one.', recording_id: 1 },
      { pinned: 0, time: '2025-05-15T09:15:00', content: 'May entry two.', recording_id: 1 },
      { pinned: 0, time: '2025-06-01T07:45:00', content: 'June entry one.', recording_id: 1 },
      { pinned: 0, time: '2025-06-15T10:30:00', content: 'June entry two.', recording_id: 1 },
      { pinned: 1, time: '2025-07-01T06:30:00', content: 'July entry one.', recording_id: 1 },
      { pinned: 0, time: '2025-07-05T08:00:00', content: 'July entry two.', recording_id: 1 },
      { pinned: 0, time: '2025-07-10T09:00:00', content: 'July entry three.', recording_id: 1 },
    ];

    for (const entry of entries) {
      await db.run(`
        INSERT INTO entry (pinned, time, content, recording_id)
        SELECT ${entry.pinned}, '${entry.time}', '${entry.content}', ${entry.recording_id}
        WHERE NOT EXISTS (SELECT 1 FROM entry WHERE time = '${entry.time}');
      `);
    }

    // ✅ Link entries to tags
    const tagLinks = [
      { entryTime: '2025-05-10T08:00:00', tagName: 'Happy' },
      { entryTime: '2025-06-01T07:45:00', tagName: 'Grateful' },
      { entryTime: '2025-07-01T06:30:00', tagName: 'Relaxed' },
      { entryTime: '2025-07-10T09:00:00', tagName: 'Happy' },
    ];

    for (const link of tagLinks) {
      await db.run(`
        INSERT INTO entry_tag (entry_id, tag_id)
        SELECT e.entry_id, t.tag_id
        FROM entry e, tag t
        WHERE e.time = '${link.entryTime}' AND t.name = '${link.tagName}'
        AND NOT EXISTS (
          SELECT 1 FROM entry_tag WHERE entry_id = e.entry_id AND tag_id = t.tag_id
        );
      `);
    }

    // ✅ Insert dummy summary
    await db.run(`
      INSERT INTO summary (start_date, range, summary, image)
      SELECT '2025-07-01', 7, 'This is a weekly summary.', 'image.png'
      WHERE NOT EXISTS (SELECT 1 FROM summary);
    `);

    // ✅ Link summary to one entry
    await db.run(`
      INSERT INTO summary_entry (summary_id, entry_id)
      SELECT 1, 1
      WHERE NOT EXISTS (
        SELECT 1 FROM summary_entry WHERE summary_id = 1 AND entry_id = 1
      );
    `);

    console.log('✅ Dummy data created with multiple entries & months!');
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
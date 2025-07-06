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
    CREATE TABLE IF NOT EXISTS content (
      content_id INTEGER PRIMARY KEY AUTOINCREMENT,
      time TEXT,
      content TEXT,
      recording_id INTEGER,
      FOREIGN KEY(recording_id) REFERENCES recording(recording_id) ON DELETE CASCADE
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
      content_id INTEGER,
      FOREIGN KEY(content_id) REFERENCES content(content_id)
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
    // Insert dummy ringtone if none exists
    await db.run(`
      INSERT INTO ringtone (track, volume)
      SELECT 'Morning Tune', 70
      WHERE NOT EXISTS (SELECT 1 FROM ringtone);
    `);

    // Insert dummy alarms if none exist
    await db.run(`
      INSERT INTO alarm (time, days, snooze, ringtone_id)
      SELECT '07:30 AM', 'Mon,Tue,Wed', 5, 1
      WHERE NOT EXISTS (SELECT 1 FROM alarm);
    `);

    await db.run(`
      INSERT INTO alarm (time, days, snooze, ringtone_id)
      SELECT '09:00 AM', 'Thu,Fri', 10, 1
      WHERE NOT EXISTS (
        SELECT 1 FROM alarm WHERE time = '09:00 AM'
      );
    `);

    // Insert dummy recording if none exists
    await db.run(`
      INSERT INTO recording (audio, length)
      SELECT 'audio1.mp3', 180
      WHERE NOT EXISTS (SELECT 1 FROM recording);
    `);

    // Insert dummy content if none exists
    await db.run(`
      INSERT INTO content (time, content, recording_id)
      SELECT '2025-07-06T09:30:00', 'This is a sample journal entry content.', 1
      WHERE NOT EXISTS (SELECT 1 FROM content);
    `);

    // Insert dummy entry if none exists
    await db.run(`
      INSERT INTO entry (pinned, content_id)
      SELECT 1, 1
      WHERE NOT EXISTS (SELECT 1 FROM entry);
    `);

    // Insert dummy tags if none exist
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

    // Link entry and tags
    await db.run(`
      INSERT INTO entry_tag (entry_id, tag_id)
        SELECT 1, tag_id
        FROM tag
        WHERE name = 'Happy'
        AND NOT EXISTS (
    SELECT 1 FROM entry_tag WHERE entry_id = 1 AND tag_id = (SELECT tag_id FROM tag WHERE name = 'Happy')
        );
    `);

    await db.run(`
      INSERT INTO entry_tag (entry_id, tag_id)
SELECT 1, tag_id
FROM tag
WHERE name = 'Grateful'
  AND NOT EXISTS (
    SELECT 1 FROM entry_tag WHERE entry_id = 1 AND tag_id = (SELECT tag_id FROM tag WHERE name = 'Grateful')
  );

    `);

    // Insert dummy summary if none exists
    await db.run(`
      INSERT INTO summary (start_date, range, summary, image)
      SELECT '2025-07-01', 7, 'This is a weekly summary.', 'image.png'
      WHERE NOT EXISTS (SELECT 1 FROM summary);
    `);

    // Link summary and entry
    await db.run(`
      INSERT INTO summary_entry (summary_id, entry_id)
      SELECT 1, 1
      WHERE NOT EXISTS (
        SELECT 1 FROM summary_entry WHERE summary_id = 1 AND entry_id = 1
      );
    `);
  } catch (err) {
    console.error('Error creating dummy data:', err);
  }
};

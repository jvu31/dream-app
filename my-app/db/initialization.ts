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
      content TEXT COLLATE NOCASE,
      title TEXT COLLATE NOCASE,
      recording_id INTEGER,
      FOREIGN KEY(recording_id) REFERENCES recording(recording_id) ON DELETE SET NULL
    );
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS tag (
      tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT COLLATE NOCASE,
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
      summary TEXT COLLATE NOCASE,
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
    // 🔔 Insert ringtone
    await db.run(`
      INSERT INTO ringtone (track, volume)
      SELECT 'Morning Tune', 70
      WHERE NOT EXISTS (SELECT 1 FROM ringtone);
    `);

    // 🔔 Insert alarm
    await db.run(`
      INSERT INTO alarm (time, days, snooze, ringtone_id)
      SELECT '07:30 AM', 'Mon,Tue,Wed', 5, 1
      WHERE NOT EXISTS (SELECT 1 FROM alarm WHERE time = '07:30 AM');
    `);

    // 🔈 Insert recording
    await db.run(`
      INSERT INTO recording (audio, length)
      SELECT 'audio1.mp3', 180
      WHERE NOT EXISTS (SELECT 1 FROM recording);
    `);

    // ✅ Insert ~15 mood tags
    const moodTags = [
      'Happy',
      'Grateful',
      'Relaxed',
      'Excited',
      'Motivated',
      'Reflective',
      'Focused',
      'Calm',
      'Adventurous',
      'Energetic',
      'Peaceful',
      'Inspired',
      'Hopeful',
      'Content',
      'Playful',
    ].map((name, i) => ({
      name,
      color: `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`,
    }));

    for (const tag of moodTags) {
      await db.run(`
        INSERT INTO tag (name, type, color)
        SELECT '${tag.name}', 'mood', '${tag.color}'
        WHERE NOT EXISTS (SELECT 1 FROM tag WHERE name = '${tag.name}');
      `);
    }

    // ✅ Insert ~20 people tags
    const peopleTags = [
      'Alice',
      'Bob',
      'Charlie',
      'David',
      'Ella',
      'Frank',
      'Grace',
      'Hannah',
      'Isaac',
      'Jack',
      'Kara',
      'Liam',
      'Mia',
      'Noah',
      'Olivia',
      'Paul',
      'Quinn',
      'Riley',
      'Sophie',
      'Tom',
    ].map((name) => ({ name, color: '#cccccc' }));

    for (const tag of peopleTags) {
      await db.run(`
        INSERT INTO tag (name, type, color)
        SELECT '${tag.name}', 'people', '${tag.color}'
        WHERE NOT EXISTS (SELECT 1 FROM tag WHERE name = '${tag.name}');
      `);
    }

    // ✅ Insert lots of entries for May–July
    const entries = [];
    const recordings = [];
    const startDate = new Date('2025-05-01');
    const endDate = new Date('2025-07-24');

    let recordingCounter = 1;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const entriesPerDay = Math.floor(Math.random() * 3);
      for (let i = 0; i < entriesPerDay; i++) {
        const hour = Math.floor(Math.random() * 12) + 6; // 6 AM – 6 PM
        const minute = Math.floor(Math.random() * 60);
        const time = new Date(d);
        time.setHours(hour, minute, 0, 0);

        // Pick random people to mention in content
        const randomPeople = peopleTags
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 3) + 1);
        const content = `Today I spent time with ${randomPeople.map((p) => p.name).join(', ')}. We had a great conversation and I felt very ${moodTags[Math.floor(Math.random() * moodTags.length)].name.toLowerCase()}. This entry is longer to simulate realistic journaling notes and includes some details about our day together.`;

        let recordingId: number | null = null;
        if (Math.random() < 0.5) {
          const audioName = `audio_${recordingCounter}.mp3`;
          const length = Math.floor(Math.random() * 300) + 30; // 30s–330s

          await db.run(`
        INSERT INTO recording (audio, length)
        VALUES ('${audioName}', ${length});
      `);

          const { recording_id } = await db.get<{ recording_id: number }>(`
        SELECT recording_id FROM recording ORDER BY recording_id DESC LIMIT 1;
      `);
          recordingId = recording_id;
          recordingCounter++;
        }

        entries.push({
          pinned: Math.random() < 0.1 ? 1 : 0,
          time: time.toISOString(),
          content,
          recording_id: recordingId,
          peopleInContent: randomPeople.map((p) => p.name),
        });
      }
    }

    const insertedEntryIds: Record<string, number> = {};

    for (const entry of entries) {
      await db.run(`
        INSERT INTO entry (pinned, time, content, title, recording_id)
        SELECT ${entry.pinned}, '${entry.time}', '${entry.content.replace(/'/g, "''")}', '', ${entry.recording_id}
        WHERE NOT EXISTS (SELECT 1 FROM entry WHERE time = '${entry.time}');
      `);

      const result = await db.get<{ entry_id: number }>(`
        SELECT entry_id FROM entry WHERE time = '${entry.time}';
      `);

      if (result?.entry_id) {
        insertedEntryIds[entry.time] = result.entry_id;
      }
    }

    // ✅ Get tag IDs
    const allTags = await db.all<{ tag_id: number; name: string; type: string }>(
      `SELECT tag_id, name, type FROM tag;`
    );

    // ✅ Link entries to 3–8 tags each, ensuring people from content are included
    for (const entry of entries) {
      const entryId = insertedEntryIds[entry.time];
      if (!entryId) continue;

      // Get tag IDs for people mentioned
      const peopleTagIds = allTags
        .filter((t) => t.type === 'people' && entry.peopleInContent.includes(t.name))
        .map((t) => t.tag_id);

      // Pick random moods
      const moodTagIds = allTags
        .filter((t) => t.type === 'mood')
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 5) + 2)
        .map((t) => t.tag_id);

      const finalTags = [...peopleTagIds, ...moodTagIds];

      for (const tagId of finalTags) {
        await db.run(`
          INSERT INTO entry_tag (entry_id, tag_id)
          SELECT ${entryId}, ${tagId}
          WHERE NOT EXISTS (
            SELECT 1 FROM entry_tag WHERE entry_id = ${entryId} AND tag_id = ${tagId}
          );
        `);
      }
    }

    // ✅ Insert summary
    await db.run(`
      INSERT INTO summary (start_date, range, summary, image)
      SELECT '2025-07-01', 7, 'Weekly summary of interesting days.', 'image.png'
      WHERE NOT EXISTS (SELECT 1 FROM summary);
    `);

    const summary = await db.get<{ summary_id: number }>(`
      SELECT summary_id FROM summary WHERE start_date = '2025-07-01';
    `);

    // ✅ Link summary to a random entry
    const someEntryId = Object.values(insertedEntryIds)[0];
    if (summary?.summary_id && someEntryId) {
      await db.run(`
        INSERT INTO summary_entry (summary_id, entry_id)
        SELECT ${summary.summary_id}, ${someEntryId}
        WHERE NOT EXISTS (
          SELECT 1 FROM summary_entry WHERE summary_id = ${summary.summary_id} AND entry_id = ${someEntryId}
        );
      `);
    }

    console.log(`✅ Created ~${entries.length} entries with multiple tags each!`);
  } catch (err) {
    console.error('❌ Error creating big dummy data:', err);
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

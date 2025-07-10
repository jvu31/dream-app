import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const recording = sqliteTable('recording', {
    recording_id: integer('recording_id').primaryKey({ autoIncrement: true }),
    audio: text('audio'),
    length: integer('length')
})

export const ringtone = sqliteTable('ringtone', {
    ringtone_id: integer('ringtone_id').primaryKey({ autoIncrement: true }),
    track: text('track'),
    volume: integer('volume').default(50)
})

export const alarm = sqliteTable('alarm', {
    alarm_id: integer('alarm_id').primaryKey({ autoIncrement: true }),
    time: text('time'),
    days: text('days').default(""),
    snooze: integer('snooze').default(0),
    ringtone_id: integer('ringtone_id')
        .references(() => ringtone.ringtone_id)
})

export const entry = sqliteTable('entry', {
    entry_id: integer('entry_id').primaryKey({ autoIncrement: true }),
    pinned: integer('pinned').default(0),
    time: text('time'),
    content: text('content'),
    title: text('title'),
    recording_id: integer('recording_id')
        .references(() => recording.recording_id, { onDelete: 'cascade' })
})

export const tag = sqliteTable('tag', {
    tag_id: integer('tag_id').primaryKey({ autoIncrement: true }),
    name: text('name'),
    type: text('type').default('mood'),
    color: text('color').default('#000000')
})

export const entry_tag = sqliteTable('entry_tag', {
    entry_tag_id: integer('entry_tag_id').primaryKey({ autoIncrement: true }),
    entry_id: integer('entry_id')
        .references(() => entry.entry_id),
    tag_id: integer('tag_id')
        .references(() => tag.tag_id),
})

export const summary = sqliteTable('summary', {
    summary_id: integer('summary_id').primaryKey({ autoIncrement: true }),
    start_date: text('start_date'),
    range: integer('range').default(0),
    summary: text('summary'),
    image: text('image')
})

export const summary_entry = sqliteTable('summary_entry', {
    summary_entry_id: integer('summary_entry_id').primaryKey({ autoIncrement: true }),
    summary_id: integer('summary_id')
        .references(() => summary.summary_id),
    entry_id: integer('entry_id')
        .references(() => entry.entry_id),
})

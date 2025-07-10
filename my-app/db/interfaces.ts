// interfaces.ts

export interface RecordingModel {
  recording_id: number;
  audio: string | null; // `text` columns can be null if not marked as NOT NULL
  length: number | null;
}

export interface RingtoneModel {
  ringtone_id: number;
  track: string | null;
  volume: number | null; // because of default, can be null if not set
}

export interface AlarmModel {
  alarm_id: number;
  time: string | null;
  days: string | null;
  snooze: number | null;
  ringtone_id: number | null;
}

export interface EntryModel {
  entry_id: number;
  pinned: number | null;
  time: string | null;
  content: string | null;
  recording_id: number | null;
}

export interface TagModel {
  tag_id: number;
  name: string | null;
  type: string | null;
  color: string | null;
}

export interface EntryTagModel {
  entry_tag_id: number;
  entry_id: number | null;
  tag_id: number | null;
}

export interface SummaryModel {
  summary_id: number;
  start_date: string | null;
  range: number | null;
  summary: string | null;
  image: string | null;
}

export interface SummaryEntryModel {
  summary_entry_id: number;
  summary_id: number | null;
  entry_id: number | null;
}

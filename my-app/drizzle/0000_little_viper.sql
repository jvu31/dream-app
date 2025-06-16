CREATE TABLE `alarm` (
	`alarm_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`time` text,
	`days` text DEFAULT '',
	`snooze` integer DEFAULT 0,
	`ringtone_id` integer,
	FOREIGN KEY (`ringtone_id`) REFERENCES `ringtone`(`ringtone_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `content` (
	`content_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`time` text,
	`content` text,
	`recording_id` integer,
	FOREIGN KEY (`recording_id`) REFERENCES `recording`(`recording_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `entry` (
	`entry_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pinned` integer DEFAULT 0,
	`content_id` integer,
	`alarm_id` integer,
	FOREIGN KEY (`content_id`) REFERENCES `content`(`content_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`alarm_id`) REFERENCES `alarm`(`alarm_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `entry_tag` (
	`entry_tag_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`entry_id` integer,
	`tag_id` integer,
	FOREIGN KEY (`entry_id`) REFERENCES `entry`(`entry_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`tag_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recording` (
	`recording_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`audio` text,
	`length` integer
);
--> statement-breakpoint
CREATE TABLE `ringtone` (
	`ringtone_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`track` text,
	`volume` integer DEFAULT 50
);
--> statement-breakpoint
CREATE TABLE `summary` (
	`summary_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`start_date` text,
	`range` integer DEFAULT 0,
	`summary` text,
	`image` text
);
--> statement-breakpoint
CREATE TABLE `summary_entry` (
	`summary_entry_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`summary_id` integer,
	`entry_id` integer,
	FOREIGN KEY (`summary_id`) REFERENCES `summary`(`summary_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entry_id`) REFERENCES `entry`(`entry_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tag` (
	`tag_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`type` text DEFAULT 'mood',
	`color` text DEFAULT '#000000'
);

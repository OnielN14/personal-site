CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text NOT NULL,
	`thumbnail_url` text,
	`is_published` integer,
	`created_at` text,
	`updated_at` text,
	`deleted_at` text DEFAULT NULL
);

CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`project_name` text NOT NULL,
	`slug` text NOT NULL,
	`thumbnail_url` text,
	`description` text,
	`created_at` text,
	`updated_at` text,
	`deleted_at` text DEFAULT NULL
);

CREATE TABLE `authors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`game_id` varchar(40) NOT NULL,
	`role` varchar(40),
	CONSTRAINT `authors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`author` int NOT NULL,
	`game_id` varchar(40) NOT NULL,
	`content` varchar(500) NOT NULL,
	`status` enum('draft','pending','published') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `files` (
	`id` varchar(40) NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('carousel_image','carousel_video','carousel_video_thumbnail','browse_image','game_archive') NOT NULL,
	`index` int,
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`download_count` int NOT NULL DEFAULT 0,
	`game_id` varchar(40) NOT NULL,
	`user_id` int NOT NULL,
	`associated_thumbnail` varchar(40),
	CONSTRAINT `files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `games` (
	`id` varchar(40) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`type` enum('board_game','video_game','cards_game') NOT NULL,
	`status` enum('private','pending','published') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`specs` varchar(255),
	`average_rating` float,
	CONSTRAINT `games_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`author` int NOT NULL,
	`game_id` varchar(40) NOT NULL,
	`value` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ratings_id` PRIMARY KEY(`id`),
	CONSTRAINT `value` CHECK(`ratings`.`value` > 0 AND `ratings`.`value` <= 10)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(40) NOT NULL,
	`game_id` varchar(40) NOT NULL,
	CONSTRAINT `tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`uid` varchar(40) NOT NULL,
	`username` varchar(40) NOT NULL,
	`first_name` varchar(40) NOT NULL,
	`last_name` varchar(40) NOT NULL,
	`email` varchar(255) NOT NULL,
	`is_admin` boolean NOT NULL DEFAULT false,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_uid_unique` UNIQUE(`uid`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `authors` ADD CONSTRAINT `authors_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `authors` ADD CONSTRAINT `authors_game_id_games_id_fk` FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_author_users_id_fk` FOREIGN KEY (`author`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_game_id_games_id_fk` FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `files` ADD CONSTRAINT `files_game_id_games_id_fk` FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `files` ADD CONSTRAINT `files_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `files` ADD CONSTRAINT `files_associated_thumbnail_files_id_fk` FOREIGN KEY (`associated_thumbnail`) REFERENCES `files`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_author_users_id_fk` FOREIGN KEY (`author`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_game_id_games_id_fk` FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `tags` ADD CONSTRAINT `tags_game_id_games_id_fk` FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `user_idx` ON `authors` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `comments` (`author`);--> statement-breakpoint
CREATE INDEX `game_idx` ON `comments` (`game_id`);--> statement-breakpoint
CREATE INDEX `game_author_idx` ON `comments` (`game_id`,`author`);--> statement-breakpoint
CREATE INDEX `files_idx` ON `files` (`id`);--> statement-breakpoint
CREATE INDEX `game_idx` ON `files` (`game_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `files` (`user_id`);--> statement-breakpoint
CREATE INDEX `game_idx` ON `games` (`id`);--> statement-breakpoint
CREATE INDEX `authorx` ON `ratings` (`author`);--> statement-breakpoint
CREATE INDEX `game_idx` ON `ratings` (`game_id`);--> statement-breakpoint
CREATE INDEX `game_author_idx` ON `ratings` (`game_id`,`author`);--> statement-breakpoint
CREATE INDEX `game_idx` ON `tags` (`game_id`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `tags` (`name`);
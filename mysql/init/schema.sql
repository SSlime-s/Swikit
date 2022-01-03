DROP DATABASE IF EXISTS Swikit;
CREATE DATABASE Swikit;
USE Swikit;

CREATE TABLE IF NOT EXISTS `pages` (
  `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT
  , `title` varchar(512) NOT NULL
  , `source` text NOT NULL
  , `create_time` timestamp NOT NULL
  , `update_time` timestamp NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `page_revisions` (
  `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT
  , `page_id` int NOT NULL
  , `source` text NOT NULL
  , `author` varchar(256) NOT NULL
  , `create_time` timestamp NOT NULL
) ENGINE=InnoDB;

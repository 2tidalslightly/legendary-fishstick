CREATE DATABASE IF NOT EXISTS RecommendMovieDB;
USE RecommendMovieDB;

CREATE TABLE `Movies` (
  `TMDBID` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `releaseDate` date DEFAULT NULL,
  `imgURL` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`TMDBID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `WatchList` (
  `listEntryID` int NOT NULL AUTO_INCREMENT,
  `accountID` int DEFAULT NULL,
  `movieID` int DEFAULT NULL,
  `status` enum('liked','want to watch','disliked') DEFAULT NULL,
  PRIMARY KEY (`listEntryID`),
  UNIQUE KEY `uniqueEntry` (`accountID`,`movieID`),
  KEY `movieID` (`movieID`),
  CONSTRAINT `WatchList_ibfk_1` FOREIGN KEY (`accountID`) REFERENCES `Users` (`userID`),
  CONSTRAINT `WatchList_ibfk_2` FOREIGN KEY (`movieID`) REFERENCES `Movies` (`TMDBID`)
) ENGINE=InnoDB AUTO_INCREMENT=889 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
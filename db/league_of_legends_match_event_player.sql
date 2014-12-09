CREATE DATABASE  IF NOT EXISTS `league_of_legends` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `league_of_legends`;
-- MySQL dump 10.13  Distrib 5.6.17, for Win64 (x86_64)
--
-- Host: localhost    Database: league_of_legends
-- ------------------------------------------------------
-- Server version	5.6.21-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `match_event_player`
--

DROP TABLE IF EXISTS `match_event_player`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `match_event_player` (
  `entryid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `matcheventid` bigint(20) unsigned NOT NULL,
  `playerid` int(10) unsigned NOT NULL,
  `ismainplayer` tinyint(1) unsigned zerofill DEFAULT '0',
  PRIMARY KEY (`entryid`,`matcheventid`,`playerid`),
  UNIQUE KEY `entryid_UNIQUE` (`entryid`),
  KEY `match_event_player_matcheventid_idx` (`matcheventid`),
  KEY `match_event_player_playerid_idx` (`playerid`),
  CONSTRAINT `match_event_player_matcheventid` FOREIGN KEY (`matcheventid`) REFERENCES `match_event` (`matcheventid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `match_event_player_playerid` FOREIGN KEY (`playerid`) REFERENCES `rocketelo`.`players` (`playerid`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-12-09  1:13:12

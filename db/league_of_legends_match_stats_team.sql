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
-- Table structure for table `match_stats_team`
--

DROP TABLE IF EXISTS `match_stats_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `match_stats_team` (
  `entryid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `parentmatchstatid` bigint(20) unsigned NOT NULL,
  `kills` tinyint(3) unsigned zerofill NOT NULL,
  `gold` tinyint(3) unsigned zerofill NOT NULL,
  `towers` tinyint(3) unsigned zerofill NOT NULL,
  `dragons` tinyint(3) unsigned zerofill NOT NULL,
  `barons` tinyint(3) unsigned zerofill NOT NULL,
  `inhibitors` tinyint(3) unsigned zerofill NOT NULL,
  `teamid` int(10) unsigned NOT NULL,
  PRIMARY KEY (`entryid`,`parentmatchstatid`,`teamid`),
  UNIQUE KEY `entryid_UNIQUE` (`entryid`),
  KEY `match_stats_team_parentmatchstatsid_idx` (`parentmatchstatid`),
  KEY `match_stats_team_teamid_idx` (`teamid`),
  CONSTRAINT `match_stats_team_parentmatchstatsid` FOREIGN KEY (`parentmatchstatid`) REFERENCES `match_stats` (`matchstatsid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `match_stats_team_teamid` FOREIGN KEY (`teamid`) REFERENCES `rocketelo`.`teams` (`teamid`) ON UPDATE CASCADE
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

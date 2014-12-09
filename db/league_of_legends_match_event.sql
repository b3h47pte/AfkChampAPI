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
-- Table structure for table `match_event`
--

DROP TABLE IF EXISTS `match_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `match_event` (
  `matcheventid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `eventtype` tinyint(3) unsigned zerofill NOT NULL,
  `eventtarget` tinyint(3) unsigned zerofill NOT NULL,
  `eventtargetsecondary` tinyint(3) unsigned zerofill NOT NULL,
  `relevantteam` tinyint(1) unsigned zerofill NOT NULL,
  `killtype` tinyint(1) unsigned zerofill NOT NULL,
  `timestamp` datetime NOT NULL,
  `parentmatchid` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`matcheventid`,`parentmatchid`),
  UNIQUE KEY `matcheventid_UNIQUE` (`matcheventid`),
  KEY `match_event_parentmatchid_idx` (`parentmatchid`),
  CONSTRAINT `match_event_parentmatchid` FOREIGN KEY (`parentmatchid`) REFERENCES `rocketelo`.`matches` (`matchid`) ON DELETE CASCADE ON UPDATE CASCADE
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

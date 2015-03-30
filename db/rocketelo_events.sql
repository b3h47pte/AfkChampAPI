CREATE DATABASE  IF NOT EXISTS `rocketelo` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `rocketelo`;
-- MySQL dump 10.13  Distrib 5.6.17, for Win64 (x86_64)
--
-- Host: localhost    Database: rocketelo
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
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `eventid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ownerid` bigint(20) unsigned NOT NULL,
  `eventname` tinytext NOT NULL,
  `streamurl` tinytext NOT NULL,
  `eventshorthand` varchar(20) NOT NULL,
  `parenteventid` bigint(20) unsigned DEFAULT '0',
  `isparentevent` tinyint(1) unsigned zerofill DEFAULT '0',
  `gameid` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`eventid`,`ownerid`,`eventshorthand`),
  UNIQUE KEY `eventid_UNIQUE` (`eventid`),
  UNIQUE KEY `eventshorthand_UNIQUE` (`eventshorthand`),
  KEY `ownerid_idx` (`ownerid`),
  KEY `events_parenteventid_idx` (`parenteventid`),
  KEY `events_gameid_idx` (`gameid`),
  CONSTRAINT `events_gameid` FOREIGN KEY (`gameid`) REFERENCES `games` (`gameid`) ON UPDATE CASCADE,
  CONSTRAINT `events_ownerid` FOREIGN KEY (`ownerid`) REFERENCES `users` (`userid`) ON UPDATE CASCADE,
  CONSTRAINT `events_parenteventid` FOREIGN KEY (`parenteventid`) REFERENCES `events` (`eventid`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-12-10  0:25:13

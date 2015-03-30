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
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teams` (
  `teamid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `teamname` varchar(45) NOT NULL,
  `teamshorthand` varchar(10) NOT NULL,
  `parentteamid` int(10) unsigned DEFAULT NULL,
  `gameid` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`teamid`,`teamshorthand`),
  UNIQUE KEY `teamid_UNIQUE` (`teamid`),
  UNIQUE KEY `teamname_UNIQUE` (`teamname`),
  UNIQUE KEY `teamshorthand_UNIQUE` (`teamshorthand`),
  KEY `teams_parentteamid_idx` (`parentteamid`),
  KEY `teams_gameid_idx` (`gameid`),
  CONSTRAINT `teams_gameid` FOREIGN KEY (`gameid`) REFERENCES `games` (`gameid`) ON UPDATE CASCADE,
  CONSTRAINT `teams_parentteamid` FOREIGN KEY (`parentteamid`) REFERENCES `teams` (`teamid`) ON DELETE SET NULL ON UPDATE CASCADE
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

-- Dump completed on 2014-12-10  0:25:13

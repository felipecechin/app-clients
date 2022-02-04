DROP DATABASE IF EXISTS `app_clients`;
CREATE DATABASE  IF NOT EXISTS `app_clients`;
USE `app_clients`;

DROP TABLE IF EXISTS `clients`;
CREATE TABLE `clients` (
                           `id` int(11) NOT NULL AUTO_INCREMENT,
                           `name` varchar(45) NOT NULL,
                           `birthdate` date NOT NULL,
                           `cellphone` varchar(45) NOT NULL,
                           `cpf` varchar(45) UNIQUE NOT NULL,
                           `email` varchar(45) NOT NULL,
                           `address` varchar(250) NOT NULL,
                           `note` text,
                           PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

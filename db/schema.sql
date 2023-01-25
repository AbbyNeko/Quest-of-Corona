DROP DATABASE IF EXISTS Quest_of_Corona_db;
CREATE DATABASE Quest_of_Corona_db;
USE Quest_of_Corona_db;


CREATE TABLE user (
    user_id int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    user_name varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    path_id1 int NOT NULL ,
    path_id2 int NOT NULL ,
    path_id3 int NOT NULL ,
    path_id4 int NOT NULL ,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    PRIMARY KEY (user_id)
);

CREATE TABLE enemies

(
	id int NOT NULL AUTO_INCREMENT,
	name VARCHAR(100) NOT NULL,
    health INTEGER(30) NOT NULL,
    attack INTEGER(30) NOT NULL,
    is_grunt BOOLEAN DEFAULT false,
    is_boss BOOLEAN DEFAULT false,
	PRIMARY KEY (id)
);

CREATE TABLE heros
(
	id int NOT NULL AUTO_INCREMENT,
	name VARCHAR(100) NOT NULL,
    health INTEGER(100) NOT NULL,
    attack INTEGER(30) NOT NULL,
	PRIMARY KEY (id)
);


CREATE TABLE character_paths
(
    id int NOT NULL AUTO_INCREMENT,
	character_class_id int NOT NULL,
    user_id int(10) UNSIGNED NOT NULL,
    health INTEGER(100) NOT NULL,
    attack INTEGER(30) NOT NULL,
	special_skill1 VARCHAR(30) NOT NULL,
    special_skill2 VARCHAR(30) NOT NULL,
    level INTEGER (20) NOT NULL,
    is_complete BOOLEAN DEFAULT false,
    currentPath VARCHAR (40) NOT NULL,
    heal BOOLEAN DEFAULT false,
    is_dead BOOLEAN DEFAULT false,
    Enemy_dead BOOLEAN DEFAULT false,
	block BOOLEAN DEFAULT false,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
	PRIMARY KEY (id)
);

INSERT INTO enemies (name, health, attack ) VALUES ("Covid Grunt", 10, 1);

INSERT INTO enemies (name, health, attack ) VALUES ("Covid Monster", 10, 1);

INSERT INTO enemies (name, health, attack ) VALUES ("Covid Slime", 10, 1);

INSERT INTO enemies (name, health, attack ) VALUES ("Murder Hornet", 16, 2);

INSERT INTO enemies (name, health, attack ) VALUES ("Covid Bat", 20, 2);

INSERT INTO enemies (name, health, attack ) VALUES ("Covid Dragon", 30, 3);


INSERT INTO heros (name, health, attack ) VALUES ("Covid Knight", 45, 3 );

INSERT INTO heros (name, health, attack ) VALUES ("Covid Nnja", 30, 4 );

INSERT INTO heros (name, health, attack ) VALUES ("Covid Mage", 40, 3 );

INSERT INTO heros (name, health, attack ) VALUES ("Covid Warlock", 30, 4 );
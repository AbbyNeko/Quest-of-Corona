const db = require("../models");

module.exports = function(sequelize, DataTypes) {

    const Path = sequelize.define("Path", {
        character_class_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        character_name: {
            type: DataTypes.STRING,
            allowNull:false
        },
        attack: {
            type: DataTypes.DOUBLE
        },
        health: {
            type: DataTypes.DOUBLE
        }, 
        level: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        is_complete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_dead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        Enemy_dead: {
            type: DataTypes.BOOLEAN, 
            defaultValue: false
        },
        currentPath: {
            type: DataTypes.STRING,
            defaultValue: 'forest'
        },
        block: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        heal: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return Path;

};
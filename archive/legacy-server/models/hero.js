module.exports = function(sequelize, DataTypes) {

    const Hero = sequelize.define("Hero", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        attack: {
            type: DataTypes.DOUBLE
        },
        health: {
            type: DataTypes.DOUBLE
        }
    });

    /*
    Hero.create({
        id: 1,
        name: 'Covid Knight',
        attack: 3,
        health: 45
    });

    Hero.create({
        id: 2,
        name: 'Covid Ninja',
        attack: 4,
        health: 35
    });

    Hero.create({
        id:3,
        name: 'Covid Mage',
        attack: 3,
        health: 45
    });

    Hero.create({
        id: 4,
        name: 'Covid Warlock',
        attack: 4,
        health: 35
    });*/

    Hero.sync();
    
    return Hero;

};
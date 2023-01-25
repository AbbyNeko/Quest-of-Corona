// Requiring our models and passport as we've configured it
const express = require("express");

const router = express.Router();

const db = require("../models");
const passport = require("../config/passport");

// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

//API ROUTES

  //PUT to block
  router.put("/rpg-api/users/block", (req, res) => {
    db.Path.update({
      block: true
    }, {
      where: {
        id: req.body.id
      }
    }).then(function(dbpath) {
        if (dbpath.changedRows == 0) {
          // If no rows were changed, then the ID must not exist, so 404
          return res.status(404).end();
        } else {
          res.status(200).end();
        }
    })
      .catch(function(err) {
      // Whenever a validation or flag fails, an error is thrown
      // We can "catch" the error to prevent it from being "thrown", which could crash our node app
        res.json(err);
      });
    });


  //PUT to heal
  router.put("/rpg-api/users/heal", (req, res) => {
    db.Path.update({
      heal: true
    }, {
      where: {
        id: req.body.id
      }
    }).then(function(dbpath) {
        if (dbpath.changedRows == 0) {
          // If no rows were changed, then the ID must not exist, so 404
          return res.status(404).end();
        } else {
          res.status(200).end();
        }
    })
      .catch(function(err) {
      // Whenever a validation or flag fails, an error is thrown
      // We can "catch" the error to prevent it from being "thrown", which could crash our node app
        res.json(err);
      });
    });

  //PUT to level up user
  router.put("/rpg-api/levelUp", (req, res) => {

    db.Path.findOne({
      where: {
        id: req.body.id
      }
    }).then(foundPath => {

      let newAttack = parseFloat(foundPath.attack) + 1;
      let newHealth = parseFloat(foundPath.health) + 1;

      let changesObj = {health: newHealth, attack: newAttack, heal: false, block: false, is_complete: false};

      console.log("current path - "+foundPath.currentPath);

      if(foundPath.currentPath == 'forest') {
        changesObj.currentPath = 'cave'
      } else if(foundPath.currentPath == 'cave') {
        changesObj.currentPath = 'deeper cave';
      }else if(foundPath.currentPath == 'deeper cave') {
        changesObj.is_complete = true;
      }

      //updating path with level up and resetting heal/block
      db.Path.update(changesObj, 
        {
        where: {
          id: foundPath.id
        }
      }).then(function(dbpath) {
        if (dbpath.changedRows == 0) {
          // If no rows were changed, then the ID must not exist, so 404
          return res.status(404).end();
        } 
    });

    res.json({is_complete: changesObj.is_complete});

      
    });
  
  });

  //PUT to reset for try again
  router.put("/rpg-api/reset", (req, res) => {

    db.Path.findOne({
      where: {
        id: req.body.id
      }
    }).then(foundPath => {
      console.log(foundPath);
      if(foundPath === null) {
        console.log('it is null')
      }else {

         //updating path with level up and resetting heal/block
          foundPath.update({ heal: false, block: false, is_dead: false}, {
            where: {
              id: foundPath.id
            }
          });

      }

      res.status(200).end();
      
    });
  
  });
  
  //POST to create RPG Character Path
  //Creates new path using character class as a template
  router.post("/rpg-api/createCharacter/", (req, res) => {

    //finding attack and health stats for this character class
    db.Hero.findOne({
      where: {
        id: req.body.characterClassId
      }
    }).then(HeroClass => {

        //creates path
        db.Path.create({
          character_name: HeroClass.name,
          character_class_id: req.body.characterClassId,
          user_id: req.body.userId,
          attack: HeroClass.attack,
          health: HeroClass.health
        })
        .then((dbPath) => {
          //get id and return id
          res.json({id: dbPath.id});
          
        })
        .catch(err => {
          res.status(401).json(err);
        });

    });

  });

  //GET character stats and path
  //use user id to get path
  router.get("/rpg-api/path/:id", (req, res) => {

    if (!req.params.id) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user data
      res.json({});
    }

  });

  //GETs user row
  router.get("/rpg-api/users/:id", (req, res) => {

    if (!req.params.id) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user data
      res.json({
        email: req.user.email,
        id: req.user.id,
        path1: user.path_id1,
        path2: user.path_id2,
        path3: user.path_id3,
        path4: user.path_id4
      });
    }

  });

  //GET enemy stats
  router.get("/rpg-api/badguys/:id", (req, res) => {

    db.Enemy.findOne({
      where: {
        id: req.body.id
      }
    }).then(foundEnemy => {

      res.json(foundEnemy);

    });

  });


  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  router.post("/rpg-api/signup", (req, res) => {
    db.User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
      .then((dbUser) => {
        //get id and return id
        console.log("id - "+dbUser.id);
        res.redirect('/welcome');
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  router.post("/rpg-api/login", passport.authenticate("local"), function(req, res) {
    console.log("logging in");
    res.json(req.user);
  });


  // Route for logging user out
  router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  //HTML ROUTES
  router.get("/", (req, res) => {
    // send the html file of index.html
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  //Game over screen
  router.get("/end", (req, res) => {
    //send the end.html file
    res.sendFile(path.join(__dirname, "../public/end.html"));
  });

  //Complete screen
  router.get("/complete", (req, res) => {
    //send the win.html file
    res.sendFile(path.join(__dirname, "../public/win.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  router.get("/welcome", isAuthenticated, (req, res) => {

    //Looks for path connected to user that is incomplete
    db.Path.findOne({
      where: {
        user_id: req.user.id,
        is_complete: false
      }
    }).then(pathResult => {
      return pathResult;
    }).then(pathInProgress => {

      if(pathInProgress != null) {
        res.render("welcome", { id: req.user.id, username: req.user.username, pathId: pathInProgress.id, attack: pathInProgress.attack, health: pathInProgress.health, characterClassId: pathInProgress.character_class_id, characterName: pathInProgress.character_name,});
      } else {
        res.render("welcome", { id: req.user.id, username: req.user.username, pathId: false});
      }

    });

  });

  //Renders start of path when game starts
  router.get("/plot/:pathId", isAuthenticated, (req, res) => {

      //Looks for path loaded and starts at current path
          db.Path.findOne({
            where: {
              id: req.params.pathId
            }
          }).then(pathInProgress => {
            
              res.render("plot", {
                userId: pathInProgress.user_id, 
                pathId: pathInProgress.id, 
                currentPath: pathInProgress.currentPath
              });
            
          });
  });

    //Renders battle based on current path
    //bee for forest
    //bat for cave
    //dragon for deeper cave
  router.get("/battle/:pathId/:currentPath", isAuthenticated, (req, res) => {

        let nameOfEnemy = '';
        let enemyImage = '';
        let enemyId = '';

        switch(req.params.currentPath) {
          case "forest":
              enemyId = 1;
              nameOfEnemy = 'Murder Hornet';
              enemyImage = '/images/leveloneBkg.gif';
              break;
          case "cave":
              enemyId = 2;
              nameOfEnemy = 'Ground Zero Bat';
              enemyImage = '/images/leveltwoBkg.gif';
              break;
          case "deeper cave":
              enemyId = 3;
              nameOfEnemy = 'Covid Dragon';
              enemyImage = '/images/levelthreeBkg.gif';
        }

        //Looks for path loaded and starts at current path
        db.Path.findOne({
          where: {
            id: req.params.pathId
          }
        }).then(pathInProgress => {
          
          let battleObj = {
            userId: pathInProgress.user_id, 
            pathId: pathInProgress.id, 
            attack: pathInProgress.attack, 
            health: pathInProgress.health, 
            heal: pathInProgress.heal,
            block: pathInProgress.block,
            characterClassId: pathInProgress.character_class_id,
            currentPath: pathInProgress.currentPath,
            enemyId: enemyId,
            enemyName: nameOfEnemy,
            enemyImgPath: enemyImage
          };

            db.Enemy.findOne({
              where: {
                id: enemyId
              }
            }).then((enemyFound) => {

              battleObj.enemyHealth = enemyFound.health;
              battleObj.enemyAttack = enemyFound.attack;
              res.render("battle", battleObj);

            });
          
        });
      
  });

module.exports = router

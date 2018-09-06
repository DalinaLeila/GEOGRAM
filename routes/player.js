const express = require("express");
const player = express.Router();
const User = require("../models/User");
const Game = require("../models/Game");
const Task = require("../models/Task");
const ensureLogin = require("connect-ensure-login");
const { upload } = require("../utils/cloudinary");
const fs = require("fs");

player.get("/player-overview", (req, res) => {
  User.findById(req.user._id)
    .populate("games")
    .then(user => {
      res.render("player/player-overview", { user });
    });
});

//search for games

player.post("/find-game", (req, res) => {
  const { code } = req.body;
  User.findById(req.user._id).then(user => {
    if (user.games.indexOf(code) == -1) {
      Game.findById(code)
        .then(game => {
          User.findByIdAndUpdate(
            req.user._id,
            { $push: { games: game._id } },
            { new: true }
          ).then(user => {
            User.findById(req.user._id)
              .populate("games")
              .then(user => {
                res.render("player/player-overview", { user });
              });
          });
        })
        .catch(err => {
          User.findById(req.user._id)
            .populate("games")
            .then(user => {
              res.render("player/player-overview", {
                user,
                message: "Invalid game code!"
              });
            });
        });
    } else {
      User.findById(req.user._id)
        .populate("games")
        .then(user => {
          res.render("player/player-overview", {
            user,
            message: "Game already displayed!"
          });
        });
    }
  });
});

player.get("/game/:id", ensureLogin.ensureLoggedIn(), (req, res) => {
  const id = req.params.id;
  const taskOrder = 1;
  Game.findById(id).then(game => {
    res.render("player/game", { game, taskOrder });
  });
});

player.get("/:id/player-task/1", ensureLogin.ensureLoggedIn(), (req, res) => {
  const id = req.params.id;

  let taskOrder = 2;

  Game.findById(id)
    .populate("tasks")
    .then(game => {
      console.log("TASKS LENGTH: ", game.tasks.length);
      if (game.tasks.length != 1) {
        let task;

        game.tasks.forEach(t => {
          if (t.order == 1) {
            task = t;
          }
        });

        res.render("player/player-task", { game, task, taskOrder });
      } else {
        res.render("player/game-finished", { game, taskOrder });
      }
    });
});

player.post(
  "/:id/player-task/:taskOrder",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    const id = req.params.id;
    let taskOrder = req.params.taskOrder;

    req.files.file.mv(`public/uploads/${req.files.file.name}`, function(err) {
      //moving the uploaded file with the specific name to the specified directory
      if (err) return res.status(500).send(err);

      let fileUrl;
      upload(`public/uploads/${req.files.file.name}`)
        .then(result => {
          fs.unlinkSync(`public/uploads/${req.files.file.name}`); //we do this to delete the files from the upload folder in order not to store them here in this project

          fileUrl = result.secure_url;
          return User.findById(req.user._id);
        })
        .then(user => {
          let existingGame = user.progress.find(
            el => el.game.toString() === id.toString()
          );
          if (!existingGame) {
            existingGame = {
              game: id,
              steps: [
                {
                  // task:
                  time: new Date(),
                  file: fileUrl
                }
              ]
            };

            user.progress.push(existingGame);
          } else {
            existingGame.steps.push({
              // task:
              time: new Date(),
              file: fileUrl
            });
          }
          console.log(user.progress[0]);
          return user.save();
        })
        .then(user => {
          return Game.findById(id).populate("tasks");
        })
        .then(game => {
          console.log("LENGTH; ORDER " + game.tasks.length + " " + taskOrder);
          if (game.tasks.length >= taskOrder) {
            let task;

            game.tasks.forEach(t => {
              if (t.order == taskOrder) {
                task = t;
              }
            });

            taskOrder++;
            res.render("player/player-task", { game, task, taskOrder });
          } else {
            const currentPlayer = req.user.progress[0].steps;
            res.render("player/game-finished", {
              game,
              taskOrder,
              currentPlayer
            });
          }
        });
    });
  }
);

player.post("/player-task/:id", (req, res, next) => {
  const id = req.params.id;
  const { file } = req.files;
  // const { name } = req.body
  const path = `public/uploads/${file.name}`;

  file.mv(path, function(err) {
    if (err) return res.status(500).send(err);

    //uploads to cloudinary
    upload(path)
      .then(result => {
        // console.log('RESUOLT', result)
        // console.log('REQ>BODY: ', req.body.file)
        return Task.findByIdAndUpdate(
          id,
          { file: req.body.file },
          { new: true, upsert: true }
        );
      })
      .then(task => {
        //deletes local copy
        fs.unlinkSync(path);
        res.send(task);
      });
  });
  // res.redirect('/player/player-task/:id', { id })
  res.redirect("back");
});

player.get("/finished", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("player/game-finished");
});

module.exports = player;
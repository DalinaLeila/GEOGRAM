const express = require("express");
const creator = express.Router();
const User = require("../models/User");
const Game = require("../models/Game");
const Task = require("../models/Task");
const ensureLogin = require("connect-ensure-login");
const url = require("url");
const nodemailer = require("nodemailer");

creator.get(
  "/creator-overview",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    const user = req.user
    let games = Game.find({ creator: req.user._id }).then(games => {
      res.render("creator/creator-overview", { games, user });
    });
  }
);

creator.get("/game-details", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const user = req.user
  res.render("creator/game-details", {user});
});

creator.post("/game-details", (req, res, next) => {
  const { title, description, private } = req.body;
  const user = req.user
  const game = new Game({
    title: title,
    creator: req.user._id,
    private: private,
    description: description
  })
    .save()
    .then(game => {
      let id = game._id;
      res.render("creator/tasks-overview", { id, user });
    });
});


//editing games
creator.get(
  "/:id/edit-game-details",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    const user = req.user
    let id = req.params.id;
    Game.findById(id).then(game => {
      res.render("creator/edit-game-details", { game, user });
    });
  }
);

creator.post(
  "/:id/edit-game-details",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    const user = req.user
    let id = req.params.id;
    const { title, description, private } = req.body;

    Game.findByIdAndUpdate(
      id,
      { title: title, description: description, private: private },
      { new: true }
    ).then(game => {
      res.redirect("/creator/" + id + "/tasks-overview", {user}) 
    });
  }
);

//

creator.get("/:id/add-task", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let id = req.params.id;
  const user = req.user
  res.render("creator/add-task", { id, user });
});

creator.post("/:id/add-task", (req, res, next) => {
  let id = req.params.id;
  const user = req.user
  const { title, location, description } = req.body;

  const task = new Task({
    title: title,
    description: description,
    location: location
  })
    .save()
    .then(task => {
      //Game.findById(id).populate("tasks")
      Game.findByIdAndUpdate(
        id,
        { $push: { tasks: task._id } },
        { new: true }
      ).then(game => {
        Game.findById(id)
          .populate("tasks")
          .then(game =>
            res.render("creator/tasks-overview", {
              id: id,
              tasks: game.tasks,
              user
            })
          );
      });
    });
});

creator.get(
  "/:id/tasks-overview",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    let id = req.params.id;
    const user = req.user
    game = Game.findById(id)
      .populate("tasks")
      .then(game => {
        res.render("creator/tasks-overview", {
          game,
          id: id,
          tasks: game.tasks,
          user
        });
      });
  }
);

creator.get(
  "/:id/edit-task/:taskId",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    let id = req.params.id;
    let taskId = req.params.taskId;
    let taskObj;
    const user = req.user
    Task.findById(taskId).then(task => {
      taskObj = task;

      res.render("creator/edit-task", { id: id, task: taskObj, user });
    });
  }
);

creator.post("/:id/edit-task/:taskId", (req, res, next) => {
  let id = req.params.id;
  let taskId = req.params.taskId;
  const user = req.user
  const { title, location, description } = req.body;

  Task.findByIdAndUpdate(taskId, {
    title: title,
    location: location,
    description: description
  }).then(task => {
    Game.findById(id)
      .populate("tasks")
      .then(game =>
        res.render("creator/tasks-overview", {
          id: id,
          tasks: game.tasks,
          user
        })
      );
  });
});

creator.get("/:id/delete-task/:taskId", (req, res, next) => {
  let id = req.params.id;
  let taskId = req.params.taskId;
  const user = req.user
  Task.findByIdAndRemove(taskId).then(task => {
    Game.findById(id)
      .then(game => {
        game.tasks.splice(game.tasks.indexOf(taskId), 1);
        return game.save();
      })
      .then(game => {
        return Game.findById(game._id).populate("tasks"); // TODO manually populate? maybe?
      })
      .then(game => {
        res.render("creator/tasks-overview", {
          id: id,
          tasks: game.tasks,
          user
        });
      })
      .catch(err => console.log(err));
  });
});

//delete games

creator.get("/:id/delete-game", (req, res, next) => {
  let id = req.params.id
  Game.findByIdAndRemove(id).then(game=>{
    res.redirect("/creator/creator-overview")
  })
});

creator.post("/:id/save-order", (req, res, next) => {
  const id = req.params.id;
  const user = req.user
  for (let key in req.body) {
    let value = req.body[key];
    Task.findByIdAndUpdate(key, { order: value }).then(task => {
      {
        res.render("creator/invite-friends", { id, user });
      }
    });
  }
});

creator.post("/send-email/:id", (req, res, next) => {
  const { email, subject, message, name } = req.body;
  const id = req.params.id;
  console.log(id);
  const user = req.user
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "geolocation.ironhack@gmail.com",
      pass: "ir0nhackproject2"
    }
  });
  transporter
    .sendMail({
      from: '"GEOGRAM" <geolocation.ironhack@gmail.com>',
      to: email,
      subject: "GEOGAME INVITE ✔",
      text: `Hello ${name}!`,
      html: `<p>Hello <b>${name}!</b></p>
      <br>
      <p>You are invited to play a GEOGAME! <br><br>Copy this game code: <br>
      <b>${id}</b><br>
      and begin your journey!</p>`
    })
    .then(info => res.render("message", { email, subject, message, info, user }))
    .catch(error => console.log(error));
});

module.exports = creator;

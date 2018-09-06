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
    let games = Game.find({ creator: req.user._id }).then(games => {
      res.render("creator/creator-overview", { games });
    });
  }
);

creator.get("/game-details", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("creator/game-details");
});

creator.post("/game-details", (req, res, next) => {
  const { title, description, private } = req.body;

  const game = new Game({
    title: title,
    creator: req.user._id,
    private: private,
    description: description
  })
    .save()
    .then(game => {
      let id = game._id;
      res.render("creator/tasks-overview", { id });
    });
});

creator.get(
  "/:id/edit-game-details",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    let id = req.params.id;
    Game.findById(id).then(game => {
      res.render("creator/edit-game-details", { game });
    });
  }
);

//editing games
creator.get(
  "/:id/edit-game-details",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    let id = req.params.id;
    Game.findById(id).then(game => {
      res.render("creator/edit-game-details", { game });
    });
  }
);

creator.post(
  "/:id/edit-game-details",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    let id = req.params.id;
    const { title, description, private } = req.body;

    Game.findByIdAndUpdate(
      id,
      { title: title, description: description, private: private },
      { new: true }
    ).then(game => {
      res.redirect(
        url.format({
          pathname: "/creator/" + id + "/tasks-overview"
        })
      );
    });
  }
);

//

creator.get("/:id/add-task", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let id = req.params.id;
  res.render("creator/add-task", { id });
});

creator.post("/:id/add-task", (req, res, next) => {
  let id = req.params.id;
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
              tasks: game.tasks
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

    game = Game.findById(id)
      .populate("tasks")
      .then(game => {
        res.render("creator/tasks-overview", {
          game,
          id: id,
          tasks: game.tasks
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
    Task.findById(taskId).then(task => {
      taskObj = task;

      res.render("creator/edit-task", { id: id, task: taskObj });
    });
  }
);

creator.post("/:id/edit-task/:taskId", (req, res, next) => {
  let id = req.params.id;
  let taskId = req.params.taskId;

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
          tasks: game.tasks
        })
      );
  });
});

creator.get("/:id/delete-task/:taskId", (req, res, next) => {
  let id = req.params.id;
  let taskId = req.params.taskId;
  console.log("game-1");
  Task.findByIdAndRemove(taskId).then(task => {
    Game.findById(id)
      .then(game => {
        console.log("game0", game);

        game.tasks.splice(game.tasks.indexOf(taskId), 1);
        return game.save();
      })
      .then(game => {
        console.log("game1", game);

        return Game.findById(game._id).populate("tasks"); // TODO manually populate? maybe?
      })
      .then(game => {
        console.log("game 2", game);
        res.render("creator/tasks-overview", {
          id: id,
          tasks: game.tasks
        });
      })
      .catch(err => console.log(err));
  });
});

//delete games

creator.get("/:id/delete-game", (req, res, next) => {});

creator.post("/:id/save-order", (req, res, next) => {
  for (let key in req.body) {
    let value = req.body[key];
    Task.findByIdAndUpdate(key, { order: value }).then(task => {
      {
        res.render("creator/invite-friends");
      }
    });
  }
});

creator.post("/send-email", (req, res, next) => {
  let { email, subject, message, name } = req.body;
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "geolocation.ironhack@gmail.com",
      pass: "ir0nhackproject2"
    }
  });
  transporter
    .sendMail({
      from: '"NAME" <geolocation.ironhack@gmail.com>',
      to: email,
      subject: "GEOGAME INVITE ✔",
      text: `Hello ${name}!`,
      html:
        `<p>Hello <b>${name}!</b></p>` +
        "<p>Click the link below to play!: <br><br><a> LINK </a></p>"
    })
    .then(info => res.render("message", { email, subject, message, info }))
    .catch(error => console.log(error));
});

module.exports = creator;

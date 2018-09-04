const express = require("express");
const creator = express.Router();

const User = require("../models/User");
const Game = require("../models/Game");
const Task = require("../models/Task");
const ensureLogin = require("connect-ensure-login");

const nodemailer = require("nodemailer");

creator.get(
  "/creator-overview",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    res.render("creator/creator-overview");
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

creator.get("/:id/add-task", (req, res, next) => {
  let id = req.params.id;
  res.render("creator/add-task", { id });
});

creator.post("/:id/add-task", (req, res, next) => {
  let id = req.params.id;
  var tasks = [];
  const { title, location, taskType, description } = req.body;

  const task = new Task({
    title: title,
    taskType: taskType,
    description: description,
    location: location
  })
    .save()
    .then(task => {
      console.log("TASK ", task);

      Game.findByIdAndUpdate(id, { $push: { tasks: task._id } }, { new: true })
        .then(game => {
          console.log("FOUND GAME ", game);
          game.tasks.forEach(taskId => {
            Task.findById(taskId).then(t => {
              console.log("FOUND TASK", t);
              tasks.push(t);
            });
          });
        })
        .then(result =>
          res.render("creator/tasks-overview", {
            gameId: id,
            tasks: tasks
          })
        )
        .catch(err => console.error(err));
    })
    .catch(err => {
      console.error(err);
    });
});

creator.get("/:id/tasks-overview", (req, res, next) => {
  let id = req.params.id;
  game = Game.findById(id).then(game => {
    res.render("creator/tasks-overview", { game });
  });
});

creator.get("/:id/");

creator.get("/invite-friends", (req, res, next) => {
  res.render("creator/invite-friends");
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

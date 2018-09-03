const express = require("express");
const creator = express.Router();
const User = require("../models/User");
const Game = require("../models/Game");
const Task = require("../models/Task");
const ensureLogin = require("connect-ensure-login");

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
          res.render("creator/tasks-overview", { id: id, tasks: tasks })
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

module.exports = creator;

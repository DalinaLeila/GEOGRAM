const express = require('express')
const creator = express.Router()
const User = require('../models/User')
const Game = require('../models/Game')
const Task = require('../models/Task')
const ensureLogin = require('connect-ensure-login')


creator.get('/creator-overview', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render('creator/creator-overview')
})

creator.get('/game-details', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render('creator/game-details')
})

creator.post('/game-details', (req, res, next) => {
  const { title, description, private } = req.body

  const game = new Game({
    title: title,
    creator: req.user._id,
    private: private,
    description: description
  })
    .save()
    .then(game => {
      let id = game._id
      res.render('creator/tasks-overview', { id })
    })
})

creator.get('/:id/add-task', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let id = req.params.id
  res.render('creator/add-task', { id })
})

creator.post("/:id/add-task", (req, res, next) => {
  let id = req.params.id;
  const { title, location, taskType, description } = req.body;

  const task = new Task({
    title: title,
    taskType: taskType,
    description: description,
    location: location
  })
    .save()
    .then(task => {

      //Game.findById(id).populate("tasks")
      Game.findByIdAndUpdate(id, { $push: { tasks: task._id } }, { new: true })
        .then(game => {

          Game.findById(id).populate("tasks")
            .then(game =>
              res.render("creator/tasks-overview", {
                id: id,
                tasks: game.tasks
              })
            )

        })

    });
});



creator.get('/:id/tasks-overview', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let id = req.params.id
  game = Game.findById(id).then(game => {
    res.render('creator/tasks-overview', { game })
  })
})



creator.get("/:id/edit-task/:taskId", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let id = req.params.id;
  let taskId = req.params.taskId;
  let taskObj;
  Task.findById(taskId).then(task => {
    taskObj = task;
    console.log("TASK: ", taskObj)
    res.render("creator/edit-task", { id: id, task: taskObj });
  })

});

creator.post("/:id/edit-task/:taskId", (req, res, next) => {
  let id = req.params.id;
  let taskId = req.params.taskId;

  const {
    title,
    location,
    taskType,
    description
  } = req.body;

  Task.findByIdAndUpdate(taskId, {
    title: title, location: location, taskType: taskType, description: description
  }).then(task => {

    Game.findById(id).populate("tasks").then(game =>
      res.render("creator/tasks-overview", {
        id: id,
        tasks: game.tasks
      })
    )

  })

});


creator.get("/:id/delete-task/:taskId", (req, res, next) => {
  let id = req.params.id;
  let taskId = req.params.taskId;
  let tasks = [];
  Task.findByIdAndRemove(taskId).then(task => {

    Game.findById(id).then(game => {

      game.tasks.splice(game.tasks.indexOf(taskId), 1);
      return game.save()
    }).then(game => {
      return Game.findById(game._id).populate("tasks") // TODO manually populate? maybe?
    }).then(game => {
      console.log(game)
      res.render("creator/tasks-overview", {
        id: id,
        tasks: game.tasks
      })
    }
    )

  })

});

module.exports = creator

const express = require("express");
const creator = express.Router();
const User = require("../models/User");
const Game = require("../models/Game");
const Task = require("../models/Task");

creator.get("/creator-overview", (req, res, next) => {
  res.render("creator/creator-overview");
});

creator.get("/game-details", (req, res, next) => {
  res.render("creator/game-details");
});

creator.post("/game-details", (req, res, next) => {

    const { title,
        description,
        private } = req.body

        console.log(req.body)

    const game = new Game({
        title: title,
        creator: req.user._id,
        private: private,
        description: description,
    }).save().then(
        game => {
            let id = game._id
            console.log("ID of Game: ", id)
            res.render("creator/tasks-overview", {id})
        });
})

creator.get("/add-task/:id", (req, res, next) => {
    let id = req.params.id;
    res.render("creator/add-task", {id});
})


creator.post("/add-task/:id", (req, res, next) => {
    let id = req.params.id;
    const { title,
        location,
        taskType,
        description } = req.body

    const task = new Task({
        title: title,
        taskType: taskType,
        description: description,
        location: location
    }).save().then(
        task => {
            Game.findByIdAndUpdate(id, {$push: { tasks: task._id}}).then(game=>{
                res.render("creator/tasks-overview", { game })
            })
            
        });
})

creator.get("/tasks-overview/:id", (req, res, next) => {
    let id = req.params.id;
    game= Game.findById(id).then(game=>{
        res.render("creator/tasks-overview", {game});
    })
    
})




module.exports = creator;

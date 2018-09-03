const express = require("express");
const creator = express.Router();
const User = require("../models/User");
const Game = require("../models/Game");

creator.get("/creator-overview", (req, res, next) => {
  res.render("creator/creator-overview");
});

creator.get("/game-details", (req, res, next) => {
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
      res.render("creator/tasks-overview", { game });
    });
});

module.exports = creator;

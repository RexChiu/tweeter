"use strict";

const userHelper = require("../lib/util/user-helper");

const express = require("express");
const tweetsRoutes = express.Router();

module.exports = function(DataHelpers) {
  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: "invalid request: no data in POST body" });
      return;
    }

    const user = req.body.user
      ? req.body.user
      : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now(),
      likes: 0
    };

    DataHelpers.saveTweet(tweet, err => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  tweetsRoutes.put("/likes", function(req, res) {
    if (!req.body.id) {
      res.status(401).json({ error: "invalid request: no data in PUT body" });
      return;
    }

    const id = req.body.id;
    const change = req.body.change;

    DataHelpers.modifyLikes(id, change, err => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.status(200).send();
      }
    });

    res.status(200).send();
  });

  return tweetsRoutes;
};
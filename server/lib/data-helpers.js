"use strict";

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {
    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet, (err, id) => {
        if (err) {
          return callback(err);
        }
        callback(null, id);
      });
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      const sortNewestFirst = (a, b) => b.created_at - a.created_at;
      db.collection("tweets")
        .find()
        .toArray((err, tweets) => {
          if (err) {
            return callback(err);
          }
          callback(null, tweets.sort(sortNewestFirst));
        });
    },

    // Changes the like count of selected tweet
    modifyLikes: function(id, change, callback) {
      var ObjectID = require("mongodb").ObjectID(id);

      let err = db
        .collection("tweets")
        .update({ _id: ObjectID }, { $inc: { likes: Number(change) } });

      callback(err.writeConcernError);
    },

    //checks if user exists in the database
    findUser: function(handle, callback) {
      if (handle === undefined) {
        callback(null, null);
      }

      //search DB and return results
      //user will be null if does not exist
      db.collection("users").findOne({ handle: handle }, function(err, user) {
        if (err) {
          return callback(err);
        }
        callback(null, user);
      });
    },

    //creates a new user
    createUser: function(user, callback) {
      db.collection("users").insertOne(user, function(err, index) {
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    }
  };
};

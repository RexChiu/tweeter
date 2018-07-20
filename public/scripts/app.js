/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
*/

$(document).ready(function() {
  let tweetData = null;

  getAndRenderTweets();

  //event handler for the form submission
  $("#submit-new-tweet").on("submit", function(event) {
    event.preventDefault();

    //grabs the text in the form
    let $form = $(this);
    let formInput = $(this)
      .find("textarea")
      .val();
    let $errorMessage = $newTweet.find(".error-message");

    //removes empty space/line breaks from front and end of

    //if empty/null, return true
    if (!formInput.trim()) {
      $errorMessage.text("Tweet cannot be empty!");
      $errorMessage.slideDown();
      return;
    } else if (formInput.length > 140) {
      //if form length is over 140
      $errorMessage.text("Tweet cannot be over 140 characters!");
      $errorMessage.slideDown();
      return;
    } else {
      $errorMessage.text("");
      $errorMessage.slideUp();
    }

    $.post("/tweets", $(this).serialize(), function(resp, err) {
      if (err !== "success") {
        console.log(err);
      } else {
        //reset the form
        $form.find(".counter").text("140");
        $form.find("textarea").val("");
        //render everything
        getAndRenderTweets();
      }
    });
  });

  //event handler for the slide toggle for new tweet box
  $("#nav-bar .compose-button").on("click", function(event) {
    $newTweet = $(".new-tweet");
    $newTweet.slideToggle();
    //focus on the new tweet if expanded
    if ($newTweet.is(":visible")) {
      $newTweet.find("textarea").focus();
    }
  });

  //event handler for clicking the like button
  $(".tweet-container").on("click", ".fa-heart", function(event) {
    let $likeButton = $(".tweet-container .fa-heart");
    let change = null;
    let id = $(this)
      .closest(".tweet")
      .data("id");

    //if already liked, decrement
    if ($likeButton.hasClass("liked-tweet")) {
      change = -1;
    } else {
      change = 1;
    }

    //construct body
    let data = {
      id: id,
      change: change
    };

    console.log(JSON.stringify(data));

    // $.post("/tweets?_method=PUT", JSON.stringify(data))
    //   .done(function(msg) {
    //     console.log("Success: " + msg);
    //   })
    //   .fail(function(err, res) {
    //     console.log("Error: " + JSON.stringify(err));
    //   });

    $.ajax({
      url: "/tweets",
      type: "PUT",
      data: data,
      success: function(err, resp) {
        console.log("Error: " + err);
        console.log("Resp: " + resp);
      }
    });
  });
});

function renderTweets(tweets) {
  //clears everything in the tweet-container
  $(".tweet-container").empty();

  // loops through tweets
  // calls createTweetElement for each tweet
  // takes return value and appends it to the tweets container

  let $tweetContainer = $(".container .tweet-container");

  for (var elem of tweets) {
    var $tweet = createTweetElement(elem);
    $tweetContainer.append($tweet);
  }
}

function createTweetElement(tweetObj) {
  //calculates the difference in time for tweet creation
  var timeDiff = new Date().getTime() - tweetObj.created_at;
  var daysDiff = parseInt(Math.floor(timeDiff / (1000 * 60 * 60 * 24)));
  if (daysDiff < 0) {
    daysDiff = 0;
  }

  var $tweet = $(
    `<article class="tweet" data-id="${escape(tweetObj._id)}">
        <header class="tweet-header">
            <img src="${escape(tweetObj.user.avatars.regular)}">
            <span class="tweet-author">${escape(tweetObj.user.name)}</span>
            <span class="tweet-mention">${escape(tweetObj.user.handle)}</span>
        </header>
        <div class="tweet-body">${escape(tweetObj.content.text)}</div>
        <hr>
        <footer class="tweet-footer">
            <span class="tweet-date">${daysDiff} days ago</span>
            <i class="fa fa-flag"></i>
            <i class="fa fa-retweet"></i>
            <i class="fa fa-heart"></i>
            <span class="tweet-num-likes">${escape(tweetObj.likes)}</span>
        </footer>
    </article>`
  );

  return $tweet;
}

function getAndRenderTweets() {
  $.get("/tweets", function(resp, err) {
    if (err !== "success") {
      console.log(err);
    } else {
      renderTweets(resp);
    }
  });
}

//function to prevent code injection, escapes all unsafe strings
function escape(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

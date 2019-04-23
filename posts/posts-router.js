const express = require("express");

const router = express.Router();

//add this for GET request
const db = require("../data/db.js");

//  Returns an array of all the posts objects contained in the database.
router.get("/", (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({
        message: "The post information could not be retrieved."
      });
    });
});

//  Returns the post object with the specified id.
router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(post => {
      if (post[0]) {
        res.json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "The post information could not be retrieved."
      });
    });
});

//  Creates a post using the information sent inside the request body.
router.post("/", (req, res) => {
  const post = req.body;

  if (post.title && post.contents) {
    db.insert(post)
      .then(postId => {
        db.findById(postId.id).then(post => {
          res.status(201).json(post);
        });
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the post to the database."
        });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

//  Removes the post with the specified id and returns the deleted post object.
router.delete("/:id", (req, res) => {
  const postId = req.params.id; //req.params has the URL parameters

  db.remove(postId)
    .then(removed => {
      if (removed) {
        res.status(204).end(); //sends back a response to the client without sending any data
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "The post information could not be removed."
      });
    });
});

//  Updates the post with the specified id using data from the request body.
//  Returns the modified document, NOT the original.
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const post = req.body;

  if (post.title && post.contents) {
    db.update(id, post)
      .then(updated => {
        if (updated) {
          db.findById(id).then(post => {
            res.json(post);
          });
        } else {
          //404 invalid id / not found
          res.status(404).json({
            errorMessage: "The post with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        // something else went wrong
        res.status(500).json({
          error: "The post information could not be modified."
        });
      });
  } else {
    res
      .status(400) //400 bad request
      .json({ message: "Please provide title and contents for the post." });
  }
});

module.exports = router;

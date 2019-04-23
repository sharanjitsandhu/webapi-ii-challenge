const express = require("express"); //commonJS module import

const postsRouter = require("./posts/posts-router.js");

const server = express();

//middleware / add this for POST request
server.use(express.json());

server.get("/", (req, res) => {
  res.send("It's working!");
});

server.use("/api/posts", postsRouter);

//export default server; //ES2015
module.exports = server; //CommonJS module server

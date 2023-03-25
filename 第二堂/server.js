const http = require("http");
const Post = require("./models/post");
const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config({path: "./config.env"});

const requestListener = async (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json'
  }
  let body = "";
  req.on("data", chunk => {
    body += chunk;
  });
  if (req.url === "/posts" && req.method === "GET") {
    const posts = await Post.find(); // get all posts
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      posts,
    }));
    res.end();
  } else if (req.url === "/posts" && req.method === "POST") {
    req.on("end", async() => {
      try {
        const data = JSON.parse(body);
        const newPost = await Post.create({
          name: data.name,
          price: data.price,
          rating: data.rating,
        });
        res.writeHead(200, headers);
        res.write(JSON.stringify({
          "status": "success",
          posts: newPost,
        }));
        res.end();
      } catch(error) {
        res.writeHead(400, headers);
        res.write(JSON.stringify({
          "status": "false",
          "message": "欄位不正確",
        }));
      }
    })
  } else if (req.url === "/posts" && req.method === "DELETE") {
    await Post.deleteMany({});
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      posts: []
    }));
    res.end();
  } else if (req.url.startsWith("/posts/") && req.method === "DELETE") {
    const id = req.url.split("/").pop();
    Post.findByIdAndDelete(id).then(() => console.log('deleted successfully'));
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
    }));
    res.end();
  } else if (req.method === "OPTIONS") {
    res.writeHead(200, headers);
  } else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      "status": "false",
      "message": "無此網站路由",
    }));
    res.end();
  }
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT);

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)
mongoose.connect(DB)
  .then(() => {
    console.log("successful");
  })
  .catch((error) => {
    console.log("error");
  });
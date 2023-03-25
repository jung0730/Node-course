const http = require("http");
const Room = require("./models/room");
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
  if (req.url === "/rooms" && req.method === "GET") {
    const rooms = await Room.find(); // get all rooms
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      rooms,
    }));
    res.end();
  } else if (req.url === "/rooms" && req.method === "POST") {
    req.on("end", async() => {
      try {
        const data = JSON.parse(body);
        // 第二種新增方式
        const newRoom = await Room.create({
          name: data.name,
          price: data.price,
          rating: data.rating,
        });
        res.writeHead(200, headers);
        res.write(JSON.stringify({
          "status": "success",
          rooms: newRoom,
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
  } else if (req.url === "/rooms" && req.method === "DELETE") {
    const rooms = await Room.deleteMany({});
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      rooms: []
    }));
    res.end();
  } else if (req.url.startsWith("/rooms/") && req.method === "DELETE") {
    const id = req.url.split("/").pop();
    Room.findByIdAndDelete(id).then(() => console.log('deleted successfully'));
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

// 第一種新增方式
// const testRoom = new Room({
//   name: "President",
//   price: 2000,
//   rating: 4.5,
// });

// testRoom.save()
//   .then(() => {
//     console.log("第一種方式新增資料成功");
//   })
//   .catch((error) => {
//     console.log("error");
//   });
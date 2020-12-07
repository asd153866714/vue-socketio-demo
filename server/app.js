const app = new (require("koa"))();
const router = require("koa-router")();
const server = require("http").createServer(app.callback());
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
const cors = require("@koa/cors");
const PORT = 3000;

app.use(
  cors({
    origin: function (ctx) {
      return "*";
    },
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
    maxAge: 5,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

router.get("/", (ctx) => {
  ctx.body = 200;
});

app.use(router.routes());

let users = [];

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("join room", (userName) => {
    console.log(userName);
    users.push({
      id: socket.id,
      name: userName,
    });

    io.emit("users", users);
  });

  socket.on("message", (message) => {
    const user = users.find((user) => user.id === socket.id);
    console.log(message, user);

    let msg = {
      userName: user.name,
      content: message,
      time: Date.now(),
    };

    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    const user = users.find((user) => user.id === socket.id);
    const index = users.indexOf(user);
    users.splice(index, 1);
    console.log(users);
  });
});

module.exports = server.listen(PORT, () => {
  console.log(`Server run on http://localhost:${PORT}`);
});

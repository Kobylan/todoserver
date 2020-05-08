const express = require("express");
const cors = require("cors");
const connectdb = require("./connections/connectionDB");
const app = express();
const PORT = process.env.PORT || 5000;
const Todo = require("./shema/todo");
const Column = require("./shema/collum");

connectdb();

app.use(cors());
app.use(express.json({ extended: false }));
app.use("/", require("./routes/homepage/homepage"));
app.use(express.json({ extended: false }));

const server = require("http").createServer(app);
server.listen(PORT, () => console.log(`server started on port ` + PORT));
const io = require("socket.io")(server, { wsEngine: "ws" });

io.sockets.on("connection", (data) => {
  Todo.watch().on("change", (data) => {
    io.sockets.emit("data", data.operationType);
  });
  Column.watch().on("change", (data) => {
    io.sockets.emit("data", data.operationType);
  });
});
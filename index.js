const express = require("express");
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const cors = require("cors")
const fileUpload = require("express-fileupload")
const bodyParser = require('body-parser');
const server = require("http").createServer(app);
const route = require("./src/routes/routes.js")
const sendNotification = require("./src/service/Notification/sendNotification.js");
// database 
const connectToDatabase = require("./src/config/db")
const { connection, client } = require("./src/config/redisConnect");
const FCMinit = require("./src/service/Notification/Notification.js");
const io = require('./src/service/socketio/io.js')
connectToDatabase()
io(server, port)
// connection()
FCMinit()
// middlewares
app.use(cors())
app.use(express.json())
app.use(fileUpload({
    tempFileDir: "tmp",
    useTempFiles: true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(route)

app.get("/", (req, res) => {
    res.status(401).send()
})


server.listen(port, () => {
    console.log(`connected to http://localhost:${port} 🚀`);
})

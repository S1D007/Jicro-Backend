const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const http = require("http");
const server = http.createServer(app);
const route = require("./src/routes/routes");
const sendNotification = require("./src/service/Notification/sendNotification");
const connectToDatabase = require("./src/config/db");
const { client } = require("./src/config/redisConnect");
const FCMinit = require("./src/service/Notification/Notification");
const io = require("./src/service/socketio/io");
const errorLogger = require("./src/middlewares/error.middleman");

dotenv.config();
const port = process.env.PORT || 3000;

// Database connection
connectToDatabase();
io(server);
FCMinit();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(fileUpload({ tempFileDir: "tmp", useTempFiles: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use(route);

// Error handling middleware
app.use(errorLogger);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

app.get("/", (req, res) => {
  res.status(401).send();
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

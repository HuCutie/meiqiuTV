require("dotenv").config();
require("express-async-errors");
const { clientURL } = require("./URI");
const fileUpload = require("express-fileupload");
const express = require("express");
const cloudinary = require("cloudinary").v2;
const connectDB = require("./db/connect");
const https = require("https");
const fs = require("fs");

//security dependencies
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

//app initialization
const app = express();

// Load SSL certificate and private key
const sslOptions = {
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
};

const { Server } = require("socket.io");
const server = https.createServer(sslOptions, app);
const io = new Server(server, { cors: { origin: clientURL } });

const PORT = process.env.PORT || 5000;

// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Routes
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");

// middlewares
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");

app.use(xss());
app.use(helmet());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).json({ message: "welcome" });
});

// Routes for API endpoints
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

// Start server
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        server.listen(PORT, "0.0.0.0", () => console.log(`Server is listening on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
};

start();
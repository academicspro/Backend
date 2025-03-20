import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import Logger from "./utils/logger";
import morganMiddleware from "./middlewares/morganMiddleware";
import { errorHandler } from "./middlewares/errorMiddleware";
import { authenticateToken, injectUserByToken } from "./utils/jwt_utils";
import { createServer } from "http";
import { Server } from "socket.io";
import apiRouter from "../src/routes/app";
import { sendErrorMessageToSupport } from "./utils/mailer";
import { getErrorStack } from "./utils/common_utils";
import signinRoute from "./routes/signin/signinRoute";

dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression({ threshold: 0 }));
app.use(morganMiddleware);
app.use(injectUserByToken);

// Basic route
app.get("/", (req, res) => {
  res.send("Backend is live");
});

app.use("/api/v1/auth", signinRoute)


app.use("/api/v1", authenticateToken, apiRouter);

// Error handling middleware
app.use(errorHandler);

// Handle uncaught exceptions
process.on("uncaughtException", function (err) {
  Logger.error(`Error occurred: ${getErrorStack(err)}`);
  sendErrorMessageToSupport(getErrorStack(err));
});

// Create and start the server
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust for production
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

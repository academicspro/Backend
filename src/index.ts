import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import Logger from "./utils/logger";
import morganMiddleware from "./middlewares/morganMiddleware";
import { errorHandler } from "./middlewares/errorMiddleware";
import { authenticateToken, getJwtToken, injectUserByToken, validateRefreshToken } from "./utils/jwt_utils";
import { createServer } from "http";
import { Server } from "socket.io";
import apiRouter from "../src/routes/app";
import { sendErrorMessageToSupport } from "./utils/mailer";
import { customValidationResult, getErrorMessage, getErrorStack } from "./utils/common_utils";
// import signinRoute from "./routes/signin/signinRoute";
// import { body } from "express-validator";
// import UserModel from "./models/UserModel.model";
// import { CONFIG } from "./config";
// import publicRouter from "./routes/public-routes/publicRoutes";
import { body } from "express-validator";
import UserModel from "./models/UserModel.model";
import { CONFIG } from "./config";
import signinRoute from "./routes/signin/signinRoute";
import superAdminRoute from "./routes/superadmin/superAdminRoute";

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



app.use("/api/v1/administrator/super-admin/", superAdminRoute);
// app.use("/api/v1", publicRouter);
app.use("/api/v1/auth", signinRoute)

/**
 * refresh token
 */
app.post(
  "/api/v1/auth/refresh-token",
  [body("token", "Refresh Token is required").trim().notEmpty()],
  async (req: Request, res: Response) => {
    const errors = customValidationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    }

    try {
      const token = req.body.token as string;

      const refreshTokenData = await validateRefreshToken(token);

      const usersModelObj = new UserModel();

      const userObj = await usersModelObj.getByParams({
        id: refreshTokenData.user!.userId,
        isActive: 1,
      });

      if (!userObj) {
        throw new Error("Invalid user account");
      }

      const accessToken = await getJwtToken(
        { userId: userObj.id, email: userObj.email, role: userObj.role },
        CONFIG.JWT_LOGIN_TOKEN_EXPIRY_TIME,
        false
      );

      // TODO: need to add refresh token

      const refreshToken = await getJwtToken(
        { userId: userObj.id, email: userObj.email, role: userObj.role },
        CONFIG.JWT_REFRESH_TOKEN_EXPIRY_TIME,
        true
      );

      res.status(200).send({ success: "ok", accessToken, refreshToken });
    } catch (error) {
      res.status(422).send({ success: "error", errors: getErrorMessage(error) });
    }
  }
);

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



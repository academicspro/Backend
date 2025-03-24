import express from "express";
import signinRoute from "../signin/signinRoute";

// import refreshTokenRoutes from "../signin/refreshTokenRoutes";
import forgotRoute from "../signin/forgotRoute";

const publicRouter = express.Router();

publicRouter.use("/auth/sign-in", signinRoute);
publicRouter.use("/auth/forgot-password", forgotRoute);
// publicRouter.use("auth/refresh-token", refreshTokenRoutes);

export default publicRouter;

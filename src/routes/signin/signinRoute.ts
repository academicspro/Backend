import express from "express";

import {
  getUserProfile,
  signIn,
} from "../../controller/signin/signinController";

import { authenticateToken } from "../../utils/jwt_utils";

const router = express.Router();

router.post("/sign-in", signIn);
// router.get("/get-profile", authenticateToken, getUserProfile);

export default router;

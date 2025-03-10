import express from "express";

import { getUserProfile } from "../../controller/signin/signinController";
import { authenticateToken } from "../../utils/jwt_utils";

const router = express.Router();

router.get("/get-profile", authenticateToken, async (req, res) => {
  try {
    console.log(req.user);
    const user = await getUserProfile(req.user!.id);

    res.status(200).json({ success: "ok", user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

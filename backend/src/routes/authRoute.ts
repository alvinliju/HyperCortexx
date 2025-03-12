import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
import {loginController, registerController, googleCallbackController} from '../controllers/authController'
const router = express.Router();
router.use(bodyParser.json());

import googleStratergy from "../utils/googleAuth";



passport.use(googleStratergy);

router.post('/register', registerController);


router.post('/login',loginController)

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", passport.authenticate("google", {session: false,failureRedirect: "/login",}), googleCallbackController);

export default router;

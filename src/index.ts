import "reflect-metadata";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";
import cookieParser from "cookie-parser";
import connectDB from "./global/configurations/db.config";
import express, { Express } from "express";
import { useExpressServer } from "routing-controllers";
import { CustomErrorHandler } from "./global/middlewares";
import { v2 as cloudinary } from "cloudinary";
import { UserController } from "./user";
import { QuoteController } from "./quote";
import { QuoteLikerController } from "./quote-liker";
import { PlaylistLikerController } from "./playlist-liker";
import { PlaylistSaverController } from "./playlist-saver";
import { PlaylistQuoteController } from "./playlist-quote";
import { PlaylistController } from "./playlist";
import { AuthorController } from "./author";
import { TopicController } from "./topic";
import { MessageController } from "./message";
import { CitedQuoteController } from "./cited-quote";
import {
  stripeControllerRouter,
  stripeWebhookRouter,
  paypalControllerRouter,
  paypalWebhookRouter,
} from "./subscription";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB().then((r) => console.log("Connected to MongoDB"));
//@ts-ignore
const port = parseInt(process.env.PORT);
let app: Express = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// StripeWebhook & PayPalWebhook are registered separately and do NOT use express.json()
app.use("/stripe/webhook", stripeWebhookRouter);
app.use("/paypal/webhook", paypalWebhookRouter);
app.use(express.json());
app.use("/stripe", stripeControllerRouter);
app.use("/paypal", paypalControllerRouter);

useExpressServer(app, {
  controllers: [
    UserController,
    QuoteController,
    PlaylistController,
    AuthorController,
    TopicController,
    MessageController,
    CitedQuoteController,
    QuoteLikerController,
    PlaylistLikerController,
    PlaylistSaverController,
    PlaylistQuoteController,
  ],
  middlewares: [CustomErrorHandler],
  defaultErrorHandler: false,
  // authorizationChecker: new UserUtility().authorizationChecker,
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

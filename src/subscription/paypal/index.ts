import paypalControllerRouter, { paypalController } from "./paypal.controller";
import paypalWebhookRouter from "./paypal.webhook";
import { PayPalService, paypalService } from "./paypal.service";
import { userService, UserService } from "../../user";

paypalService.setUserService(userService);
paypalController.setPayPalService(paypalService);

export {
  paypalControllerRouter,
  paypalWebhookRouter,
  paypalService,
  PayPalService,
  userService,
  UserService,
};

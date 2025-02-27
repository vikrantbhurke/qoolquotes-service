import paypalControllerRouter from "./paypal.controller";
import paypalWebhookRouter from "./paypal.webhook";
import { PayPalService, paypalService } from "./paypal.service";
import { userService, UserService } from "../../user";

paypalService.setUserService(userService);

export {
  paypalControllerRouter,
  paypalWebhookRouter,
  paypalService,
  PayPalService,
  userService,
  UserService,
};

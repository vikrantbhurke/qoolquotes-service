import stripeControllerRouter, { stripeController } from "./stripe.controller";
import stripeWebhookRouter from "./stripe.webhook";
import { StripeService, stripeService } from "./stripe.service";
import { userService, UserService } from "../../user";

stripeService.setUserService(userService);
stripeController.setStripeService(stripeService);

export {
  stripeControllerRouter,
  stripeWebhookRouter,
  stripeService,
  StripeService,
  userService,
  UserService,
};

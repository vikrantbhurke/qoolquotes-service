import paypalControllerRouter from "./paypal/paypal.controller";
import paypalWebhookRouter from "./paypal/paypal.webhook";
import stripeControllerRouter from "./stripe/stripe.controller";
import stripeWebhookRouter from "./stripe/stripe.webhook";
import { stripeService, StripeService } from "./stripe/stripe.service";
import { paypalService, PayPalService } from "./paypal/paypal.service";
import { userService, UserService } from "../user";

stripeService.setUserService(userService);
paypalService.setUserService(userService);

export {
  stripeService,
  stripeControllerRouter,
  stripeWebhookRouter,
  paypalService,
  paypalControllerRouter,
  paypalWebhookRouter,
  StripeService,
  PayPalService,
  UserService,
};

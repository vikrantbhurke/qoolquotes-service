import {
  paypalControllerRouter,
  paypalWebhookRouter,
  paypalService,
} from "./paypal";

import {
  stripeControllerRouter,
  stripeWebhookRouter,
  stripeService,
} from "./stripe";

import { userService, UserService } from "../user";

stripeService.setUserService(userService);
paypalService.setUserService(userService);

export {
  paypalControllerRouter,
  paypalWebhookRouter,
  stripeControllerRouter,
  stripeWebhookRouter,
  UserService,
};

import express, { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export class StripeController {
  async createStripeSubscription(request: Request, response: Response) {
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID as string,
            quantity: 1,
          },
        ],
        success_url: `${process.env.CLIENT_URL}/users/${request.body.userId}?subscribed=true`,
        cancel_url: `${process.env.CLIENT_URL}/users/${request.body.userId}?subscribed=true`,
      });

      return response.json({ sessionUrl: session.url });
      // return response.redirect(303, session.url);
    } catch (err: any) {
      return response.status(500).json({ message: err.message });
    }
  }

  async getStripeSubscription(request: Request, response: Response) {
    try {
      if (request.body.subscriptionId === "none")
        return response
          .status(204)
          .json({ message: "User has no active subscription." });

      const subscription = await stripe.subscriptions.retrieve(
        request.body.subscriptionId
      );

      return response.status(200).json(subscription);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  async suspendStripeSubscription(request: Request, response: Response) {
    try {
      await stripe.subscriptions.update(request.body.subscriptionId, {
        pause_collection: { behavior: "mark_uncollectible" },
      });

      return response
        .status(200)
        .json({ message: "Subscription suspended successfully." });
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  async activateStripeSubscription(request: Request, response: Response) {
    try {
      await stripe.subscriptions.update(request.body.subscriptionId, {
        pause_collection: null,
      });

      return response
        .status(200)
        .json({ message: "Subscription activated successfully." });
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  async cancelStripeSubscription(request: Request, response: Response) {
    try {
      await stripe.subscriptions.cancel(request.body.subscriptionId);

      return response
        .status(200)
        .json({ message: "Subscription canceled successfully." });
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }
}

export const stripeController = new StripeController();

const stripeControllerRouter = express.Router();

stripeControllerRouter.post(
  "/create-subscription",
  stripeController.createStripeSubscription.bind(stripeController)
);

stripeControllerRouter.post(
  "/get-subscription",
  stripeController.getStripeSubscription.bind(stripeController)
);

stripeControllerRouter.post(
  "/suspend-subscription",
  stripeController.suspendStripeSubscription.bind(stripeController)
);

stripeControllerRouter.post(
  "/activate-subscription",
  stripeController.activateStripeSubscription.bind(stripeController)
);

stripeControllerRouter.post(
  "/cancel-subscription",
  stripeController.cancelStripeSubscription.bind(stripeController)
);

export default stripeControllerRouter;

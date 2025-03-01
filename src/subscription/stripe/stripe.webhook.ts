import Stripe from "stripe";
import { Role } from "../../user/enums";
import { Status, Subscription } from "../enums";
import express, { Request, Response } from "express";
import { StripeService, stripeService } from "./stripe.service";

export class StripeWebhook {
  stripe: Stripe;
  stripeService: StripeService;

  constructor() {
    this.stripeService = stripeService;
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  async webhook(request: Request, response: Response) {
    try {
      // If you are testing with the CLI, find the secret by running `stripe listen`
      // or `stripe listen --forward-to localhost:3000/stripe/webhook`
      // If you are using an endpoint defined with the API or dashboard,
      // look in your webhook settings at https://dashboard.stripe.com/webhooks
      // Only verify the event if you have an endpoint secret defined.
      // Otherwise use the basic event deserialized with JSON.parse

      let event = request.body;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;

      if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers["stripe-signature"];
        try {
          event = this.stripe.webhooks.constructEvent(
            event,
            signature as string,
            endpointSecret
          );
        } catch (error: any) {
          console.log(
            `⚠️ Webhook signature verification failed.`,
            error.message
          );
          return response.sendStatus(400);
        }
      }

      const eventType = event.type;

      switch (eventType) {
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscriptionObject = event.data.object as Stripe.Subscription;
          const subscriptionId = subscriptionObject.id;
          const status = subscriptionObject.status;
          const pauseCollection = subscriptionObject.pause_collection;
          const customerId = subscriptionObject.customer as string;
          const customer = await this.stripe.customers.retrieve(customerId);
          const email = (customer as any).email;

          console.log(
            "Event -",
            eventType,
            "| Id -",
            subscriptionId,
            "| Status -",
            status,
            "| Pause -",
            pauseCollection,
            "| Email -",
            email
          );

          let role;
          let subscription;
          let subscriptionStatus;
          let updateUserDTO = {};
          const emailDTO = { email };

          switch (status) {
            case "active":
              if (!pauseCollection) {
                role = Role.Subscriber;
                subscription = Subscription.Stripe;
                subscriptionStatus = Status.Active;
              } else {
                role = Role.Private;
                subscription = Subscription.Stripe;
                subscriptionStatus = Status.Suspended;
              }
              break;
            case "canceled":
            case "incomplete":
              role = Role.Private;
              subscription = Subscription.Free;
              subscriptionStatus = Status.Inactive;
              break;
          }

          updateUserDTO = {
            role,
            subscription,
            subscriptionId,
            subscriptionStatus,
          };

          await this.stripeService.updateUserByEmail(emailDTO, updateUserDTO);
          break;
      }

      return response.status(200).json({ message: "Webhook received." });
    } catch (error: any) {
      console.error("Stripe Webhook Error:", error);
      return response.status(500).json({ message: error.message });
    }
  }
}

export const stripeWebhook = new StripeWebhook();

const stripeWebhookRouter = express.Router();

stripeWebhookRouter.post(
  "/",
  express.raw({ type: "application/json" }),
  stripeWebhook.webhook.bind(stripeWebhook)
);

export default stripeWebhookRouter;

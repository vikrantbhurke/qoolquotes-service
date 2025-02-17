import express, { Request, Response } from "express";
import { StripeService, stripeService } from "../index";
import { stripe } from "../../index";

export class StripeWebhook {
  stripeService: StripeService;

  constructor() {
    this.stripeService = stripeService;
  }

  async webhook(request: Request, response: Response) {
    try {
      let event = request.body;

      //  If you are testing with the CLI, find the secret by running `stripe listen` or `stripe listen --forward-to localhost:3000/webhook`
      // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
      // at https://dashboard.stripe.com/webhooks
      const endpointSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;

      // Only verify the event if you have an endpoint secret defined.
      // Otherwise use the basic event deserialized with JSON.parse
      if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers["stripe-signature"];
        try {
          event = stripe.webhooks.constructEvent(
            request.body,
            signature,
            endpointSecret
          );
        } catch (err: any) {
          console.log(`⚠️ Webhook signature verification failed.`, err.message);
          return response.sendStatus(400);
        }
      }

      let customer = await stripe.customers.retrieve(
        event.data.object.customer
      );

      let details = {
        subscriptionStatus: event.data.object.status,
        customerEmail: customer.email,
      };

      let addUserDetails = {
        customerId: event.data.object.customer,
        customerEmail: customer.email,
      };

      let removeUserDetails = {
        customerEmail: customer.email,
      };

      switch (event.type) {
        case "customer.subscription.created":
          await this.stripeService.updateUserSubscriptionStatus(details);
          await this.stripeService.addUserCustomerId(addUserDetails);
          console.log(
            "customer.subscription.created",
            addUserDetails.customerId,
            details.subscriptionStatus
          );
          break;
        case "customer.subscription.deleted":
          await this.stripeService.updateUserSubscriptionStatus(details);
          await this.stripeService.removeUserCustomerId(removeUserDetails);
          console.log(
            "customer.subscription.deleted",
            details.subscriptionStatus
          );
          break;
        case "customer.subscription.paused":
          await this.stripeService.updateUserSubscriptionStatus(details);
          console.log(
            "customer.subscription.paused",
            details.subscriptionStatus
          );
          break;
        case "customer.subscription.pending_update_applied":
          await this.stripeService.updateUserSubscriptionStatus(details);
          console.log(
            "customer.subscription.pending_update_applied",
            details.subscriptionStatus
          );
          break;
        case "customer.subscription.pending_update_expired":
          await this.stripeService.updateUserSubscriptionStatus(details);
          console.log(
            "customer.subscription.pending_update_expired",
            details.subscriptionStatus
          );
          break;
        case "customer.subscription.resumed":
          await this.stripeService.updateUserSubscriptionStatus(details);
          console.log(
            "customer.subscription.resumed",
            details.subscriptionStatus
          );
          break;
        case "customer.subscription.trial_will_end":
          await this.stripeService.updateUserSubscriptionStatus(details);
          console.log(
            "customer.subscription.trial_will_end",
            details.subscriptionStatus
          );
          break;
        case "customer.subscription.updated":
          await this.stripeService.updateUserSubscriptionStatus(details);
          console.log(
            "customer.subscription.updated",
            details.subscriptionStatus
          );
          break;
        default:
      }

      return response.status(200).json({ message: "Webhook received." });
    } catch (err: any) {
      return response.status(500).json({ message: err.message });
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

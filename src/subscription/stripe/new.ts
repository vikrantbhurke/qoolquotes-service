import express, { Request, Response } from "express";
import { stripe } from "../../index";

const clientUrl = process.env.CLIENT_URL;

export class StripeController {
  async createSubscription(request: Request, response: Response) {
    try {
      const session = await stripe.checkout.sessions.create({
        billing_address_collection: "auto",
        line_items: [
          {
            price: request.body.price_id,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${clientUrl}/subscription/?success=true`,
        cancel_url: `${clientUrl}/subscription/?canceled=true`,
        payment_method_types: ["card"],
        // subscription_data: {
        // trial_period_days: 7,
        //   billing_cycle_anchor: "now",
        // },
      });

      return response.redirect(303, session.url);
    } catch (err: any) {
      return response.status(500).json({ message: err.message });
    }
    // try {
    //   const { customerId, priceId } = request.body;

    //   const subscription = await stripe.subscriptions.create({
    //     customer: customerId,
    //     items: [{ price: priceId }],
    //     payment_behavior: "default_incomplete",
    //     expand: ["latest_invoice.payment_intent"],
    //   });

    //   return response.status(200).json(subscription);
    // } catch (error: any) {
    //   return response.status(500).json({ message: error.message });
    // }
  }

  async getSubscriptionDetails(request: Request, response: Response) {
    try {
      const { subscriptionId } = request.params;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return response.status(200).json(subscription);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  async cancelSubscription(request: Request, response: Response) {
    try {
      const { subscriptionId } = request.body;

      const canceledSubscription = await stripe.subscriptions.update(
        subscriptionId,
        {
          cancel_at_period_end: true,
        }
      );

      return response.status(200).json(canceledSubscription);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  async resumeSubscription(request: Request, response: Response) {
    try {
      const { subscriptionId } = request.body;

      const resumedSubscription = await stripe.subscriptions.update(
        subscriptionId,
        {
          cancel_at_period_end: false,
        }
      );

      return response.status(200).json(resumedSubscription);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  async deleteSubscription(request: Request, response: Response) {
    try {
      const { subscriptionId } = request.body;
      await stripe.subscriptions.del(subscriptionId);

      return response
        .status(200)
        .json({ message: "Subscription deleted successfully." });
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }
}

export const stripeController = new StripeController();

const stripeControllerRouter = express.Router();

stripeControllerRouter.post(
  "/create-subscription",
  stripeController.createSubscription.bind(stripeController)
);

stripeControllerRouter.get(
  "/get-subscription/:subscriptionId",
  stripeController.getSubscriptionDetails.bind(stripeController)
);

stripeControllerRouter.post(
  "/cancel-subscription",
  stripeController.cancelSubscription.bind(stripeController)
);

stripeControllerRouter.post(
  "/resume-subscription",
  stripeController.resumeSubscription.bind(stripeController)
);

stripeControllerRouter.post(
  "/delete-subscription",
  stripeController.deleteSubscription.bind(stripeController)
);

export default stripeControllerRouter;

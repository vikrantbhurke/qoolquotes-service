import express, { Request, Response } from "express";
import { stripe } from "../../index";

const clientUrl = process.env.CLIENT_URL;

export class StripeController {
  async createCheckoutSession(request: Request, response: Response) {
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
  }

  async createPortalSession(request: Request, response: Response) {
    try {
      // const { customerId } = request.body;
      const { subscriptionId } = request.body;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const customerId = subscription.customer as string;

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${clientUrl}/subscription`,
      });

      return response.redirect(303, portalSession.url);
    } catch (err: any) {
      return response.status(500).json({ message: err.message });
    }
  }
}

export const stripeController = new StripeController();

const stripeControllerRouter = express.Router();

stripeControllerRouter.post(
  "/create-checkout-session",
  stripeController.createCheckoutSession.bind(stripeController)
);

stripeControllerRouter.post(
  "/create-portal-session",
  stripeController.createPortalSession.bind(stripeController)
);

export default stripeControllerRouter;

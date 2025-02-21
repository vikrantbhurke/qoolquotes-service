import { subscriptionUtility } from "../subscription.utility";
import { PayPalService, paypalService } from "./paypal.service";
import express, { Request, Response } from "express";

export class PayPalWebhook {
  paypalService: PayPalService;

  constructor() {
    this.paypalService = paypalService;
  }

  async webhook(request: Request, response: Response) {
    try {
      const rawBody = request.body.toString();
      const event = JSON.parse(rawBody);
      const subscriptionId = event.resource.id;
      const eventType = event.event_type;
      const subscriptionStatus = event.resource.status;
      const email = event.resource.subscriber.email_address;

      const emailDTO = { email };

      const updateUserDTO = {
        subscriptionId,
        subscriptionStatus: subscriptionUtility.getSubscriptionStatus(
          subscriptionStatus
        ) as any,
      };

      console.log("Subscription Id", subscriptionId);
      console.log("Event Type", eventType);
      console.log("Subscription Status", subscriptionStatus);
      console.log("Email Address", email);

      await this.paypalService.updateUserByEmail(emailDTO, updateUserDTO);
      return response.status(200).json({ message: "Webhook received." });
    } catch (error: any) {
      console.log("Error", error);
      return response.status(500).json({ message: error.message });
    }
  }
}

export const paypalWebhook = new PayPalWebhook();

const paypalWebhookRouter = express.Router();

paypalWebhookRouter.post(
  "/",
  express.raw({ type: "application/json" }),
  paypalWebhook.webhook.bind(paypalWebhook)
);

export default paypalWebhookRouter;

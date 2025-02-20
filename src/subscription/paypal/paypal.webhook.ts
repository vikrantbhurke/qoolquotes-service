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
      const emailDTO = { email: event.resource.subscriber.email_address };

      const updateUserDTO = {
        subscriptionId: event.resource.id,
        subscriptionStatus: subscriptionUtility.getSubscriptionStatus(
          event.resource.status
        ) as any,
      };

      console.log("Event", event);

      await this.paypalService.updateUserByEmail(emailDTO, updateUserDTO);
      return response.status(200).json({ message: "Webhook received." });
    } catch (error: any) {
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

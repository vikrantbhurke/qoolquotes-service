import express, { Request, Response } from "express";
import crypto from "crypto";
import axios from "axios";

export class PayPalWebhook {
  async webhook(request: Request, response: Response) {
    try {
      const rawBody = JSON.stringify(request.body);
      const event = JSON.parse(rawBody);

      console.log(
        "PayPal Webhook:",
        event.event_type,
        event.resource.id,
        event.resource.status
      );

      switch (event.event_type) {
        case "BILLING.SUBSCRIPTION.CREATED":
          // event.resource.id is the subscription ID
          // event.resource.status is the subscription status (e.g. APPROVAL_PENDING)
          break;
        case "BILLING.SUBSCRIPTION.ACTIVATED":
          // event.resource.id is the subscription ID
          // event.resource.status is the subscription status (e.g. ACTIVE)
          break;
        case "BILLING.SUBSCRIPTION.SUSPENDED":
          // event.resource.id is the subscription ID
          // event.resource.status is the subscription status (e.g. SUSPENDED)
          break;
        case "BILLING.SUBSCRIPTION.CANCELLED":
          // event.resource.id is the subscription ID
          // event.resource.status is the subscription status (e.g. CANCELLED)
          break;
        default:
          break;
      }

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

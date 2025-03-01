import { Role } from "../../user/enums";
import { Status, Subscription } from "../enums";
import express, { Request, Response } from "express";
import { PayPalService, paypalService } from "./paypal.service";

export class PayPalWebhook {
  paypalService: PayPalService;

  constructor() {
    this.paypalService = paypalService;
  }

  async webhook(request: Request, response: Response) {
    try {
      const rawBody = request.body.toString();
      const event = JSON.parse(rawBody);
      const eventType = event.event_type;
      const subId = event.resource.id;
      const status = event.resource.status;
      const email = event.resource.subscriber.email_address;

      console.log(
        "Event:",
        eventType,
        "| Id:",
        subId,
        "| Status:",
        status,
        "| Email:",
        email
      );

      let role;
      let subscription;
      let subscriptionId;
      let subscriptionStatus;
      let updateUserDTO = {};
      const emailDTO = { email };

      switch (eventType) {
        case "BILLING.SUBSCRIPTION.ACTIVATED":
          role = Role.Subscriber;
          subscriptionId = subId;
          subscription = Subscription.PayPal;
          subscriptionStatus = status === "ACTIVE" && Status.Active;
          break;
        case "BILLING.SUBSCRIPTION.SUSPENDED":
          role = Role.Private;
          subscriptionId = subId;
          subscription = Subscription.PayPal;
          subscriptionStatus = status === "SUSPENDED" && Status.Suspended;
          break;
        case "BILLING.SUBSCRIPTION.CANCELLED":
        case "BILLING.SUBSCRIPTION.EXPIRED":
          role = Role.Private;
          subscriptionId = "none";
          subscription = Subscription.Free;
          subscriptionStatus =
            (status === "CANCELLED" || status === "EXPIRED") && Status.Inactive;
          break;
      }

      updateUserDTO = {
        role,
        subscription,
        subscriptionId,
        subscriptionStatus,
      };

      await this.paypalService.updateUserByEmail(emailDTO, updateUserDTO);
      return response.status(200).json({ message: "Webhook received." });
    } catch (error: any) {
      console.log("PayPal Webhook Error:", error);
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

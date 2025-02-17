import express, { Request, Response } from "express";
import crypto from "crypto";
import axios from "axios";

export class PayPalWebhook {
  async webhook(request: Request, response: Response) {
    try {
      const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

      const transmissionId = request.headers[
        "paypal-transmission-id"
      ] as string;

      const transmissionTime = request.headers[
        "paypal-transmission-time"
      ] as string;

      const certUrl = request.headers["paypal-cert-url"] as string;
      const authAlgo = request.headers["paypal-auth-algo"] as string;
      const transmissionSig = request.headers[
        "paypal-transmission-sig"
      ] as string;

      const webhookEventBody = JSON.stringify(request.body);

      // Fetch PayPal's public certificate
      const { data: publicCert } = await axios.get(certUrl);

      // Generate expected signature
      const verifier = crypto.createVerify(authAlgo);

      verifier.update(
        `${transmissionId}|${transmissionTime}|${PAYPAL_WEBHOOK_ID}|${webhookEventBody}`
      );
      const isValid = verifier.verify(publicCert, transmissionSig, "base64");

      if (!isValid) {
        return response
          .status(400)
          .json({ message: "Invalid PayPal signature." });
      }

      const event = JSON.parse(webhookEventBody);
      console.log("Verified PayPal webhook:", event);

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

import express, { Request, Response } from "express";

export class PayPalWebhook {
  async webhook(request: Request, response: Response) {
    try {
      let event = request.body;
      console.log(event);
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

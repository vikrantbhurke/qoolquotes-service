import express, { Request, Response } from "express";
import { PayPalService, paypalService } from "./paypal.service";
import axios from "axios";

export class PayPalController {
  paypalService: PayPalService;

  constructor() {
    this.paypalService = paypalService;
  }

  // Utility method to get PayPal access token
  async getPayPalAccessToken() {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    const paypalResponse = await axios.post(
      `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return paypalResponse.data.access_token;
  }

  // Utility method to get PayPal headers
  async getHeader() {
    const accessToken = await this.getPayPalAccessToken();

    return {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
  }

  async createSubscription(request: Request, response: Response) {
    try {
      const paypalResponse = await axios.post(
        `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions`,
        {
          plan_id: process.env.PAYPAL_PLAN_ID,
          application_context: {
            brand_name: process.env.APP_NAME,
            locale: "en-US",
            user_action: "SUBSCRIBE_NOW",
            payment_method: {
              payer_selected: "PAYPAL",
              payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
            },
            return_url: `${process.env.CLIENT_URL}/users/${request.body.userId}`,
            cancel_url: `${process.env.CLIENT_URL}/users/${request.body.userId}`,
          },
        },
        await this.getHeader()
      );

      const approve_url = paypalResponse.data.links.find(
        (link: any) => link.rel === "approve"
      ).href;

      return response.status(200).json({ approve_url });
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  async getSubscription(request: Request, response: Response) {
    try {
      const user = await this.paypalService.getUserByEmail({
        email: request.body.email,
      });

      if (!user)
        return response.status(404).json({ message: "User not found." });

      const paypalResponse = await axios.get(
        `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions/${user.subscriptionId}`,
        await this.getHeader()
      );

      return response.status(200).json(paypalResponse.data);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  async suspendSubscription(request: Request, response: Response) {
    try {
      const user = await this.paypalService.getUserByEmail({
        email: request.body.email,
      });

      if (!user)
        return response.status(404).json({ message: "User not found." });

      await axios.post(
        `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions/${user.subscriptionId}/suspend`,
        { reason: "User requested suspension." },
        await this.getHeader()
      );

      return response
        .status(200)
        .json({ message: "Subscription suspended successfully." });
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  async activateSubscription(request: Request, response: Response) {
    try {
      const user = await this.paypalService.getUserByEmail({
        email: request.body.email,
      });

      if (!user)
        return response.status(404).json({ message: "User not found." });

      await axios.post(
        `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions/${user.subscriptionId}/activate`,
        { reason: "User requested activation." },
        await this.getHeader()
      );

      return response
        .status(200)
        .json({ message: "Subscription activated successfully." });
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  async cancelSubscription(request: Request, response: Response) {
    try {
      const user = await this.paypalService.getUserByEmail({
        email: request.body.email,
      });

      if (!user)
        return response.status(404).json({ message: "User not found." });

      await axios.post(
        `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions/${user.subscriptionId}/cancel`,
        { reason: "User requested cancellation." },
        await this.getHeader()
      );

      return response
        .status(200)
        .json({ message: "Subscription canceled successfully." });
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }
}

export const paypalController = new PayPalController();

const paypalControllerRouter = express.Router();

paypalControllerRouter.post(
  "/create-subscription",
  paypalController.createSubscription.bind(paypalController)
);

paypalControllerRouter.post(
  "/get-subscription",
  paypalController.getSubscription.bind(paypalController)
);

paypalControllerRouter.post(
  "/suspend-subscription",
  paypalController.suspendSubscription.bind(paypalController)
);

paypalControllerRouter.post(
  "/activate-subscription",
  paypalController.activateSubscription.bind(paypalController)
);

paypalControllerRouter.post(
  "/cancel-subscription",
  paypalController.cancelSubscription.bind(paypalController)
);

export default paypalControllerRouter;

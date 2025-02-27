import axios from "axios";
import express, { Request, Response } from "express";
import { PayPalService } from "./index";

export class PayPalController {
  paypalService: PayPalService;

  setPayPalService(paypalService: PayPalService) {
    this.paypalService = paypalService;
  }

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

  async createPayPalSubscription(request: Request, response: Response) {
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
            return_url: `${process.env.CLIENT_URL}/users/${request.body.userId}?subscribed=true`,
            cancel_url: `${process.env.CLIENT_URL}/users/${request.body.userId}?subscribed=false`,
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

  async getPayPalSubscription(request: Request, response: Response) {
    try {
      const email = request.body.email;
      const user = await this.paypalService.getUserByEmail({ email });

      if (!user)
        return response.status(404).json({ message: "User not found." });

      if (user.subscriptionId === "none")
        return response
          .status(204)
          .json({ message: "User has no active subscription." });

      const paypalResponse = await axios.get(
        `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions/${user.subscriptionId}`,
        await this.getHeader()
      );

      return response.status(200).json(paypalResponse.data);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  async suspendPayPalSubscription(request: Request, response: Response) {
    try {
      await axios.post(
        `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions/${request.body.subscriptionId}/suspend`,
        { reason: "User requested suspension." },
        await this.getHeader()
      );

      return response
        .status(200)
        .json({ message: "Subscription suspended successfully." });
    } catch (error: any) {
      console.log("Error suspending PayPal subscription: ", error);
      return response.status(500).json({ message: error.message });
    }
  }

  async activatePayPalSubscription(request: Request, response: Response) {
    try {
      await axios.post(
        `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions/${request.body.subscriptionId}/activate`,
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

  async cancelPayPalSubscription(request: Request, response: Response) {
    try {
      await axios.post(
        `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions/${request.body.subscriptionId}/cancel`,
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
  paypalController.createPayPalSubscription.bind(paypalController)
);

paypalControllerRouter.post(
  "/get-subscription",
  paypalController.getPayPalSubscription.bind(paypalController)
);

paypalControllerRouter.post(
  "/suspend-subscription",
  paypalController.suspendPayPalSubscription.bind(paypalController)
);

paypalControllerRouter.post(
  "/activate-subscription",
  paypalController.activatePayPalSubscription.bind(paypalController)
);

paypalControllerRouter.post(
  "/cancel-subscription",
  paypalController.cancelPayPalSubscription.bind(paypalController)
);

export default paypalControllerRouter;

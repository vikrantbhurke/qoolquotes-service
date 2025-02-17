import express, { Request, Response } from "express";
import axios from "axios";

export class PayPalController {
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

  async createSubscription(_request: Request, response: Response) {
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
            return_url: `${process.env.CLIENT_URL}/paypal/?success=true`,
            cancel_url: `${process.env.CLIENT_URL}/paypal/?canceled=true`,
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

  async getSubscriptionDetails(_request: Request, response: Response) {
    try {
      const paypalResponse = await axios.get(
        `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions/I-70R83XDX6T6B`,
        await this.getHeader()
      );

      return response.status(200).send(paypalResponse.data);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  async suspendSubscription(_request: Request, response: Response) {
    try {
      await axios.post(
        `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions/I-70R83XDX6T6B/suspend`,
        { reason: "User requested suspension" },
        await this.getHeader()
      );

      return response
        .status(200)
        .json({ message: "Subscription suspended successfully." });
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  async activateSubscription(_request: Request, response: Response) {
    try {
      await axios.post(
        `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions/I-70R83XDX6T6B/activate`,
        { reason: "User requested activation" },
        await this.getHeader()
      );

      return response
        .status(200)
        .json({ message: "Subscription activated successfully." });
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  async cancelSubscription(_request: Request, response: Response) {
    try {
      await axios.post(
        `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions/I-70R83XDX6T6B/cancel`,
        { reason: "User requested cancellation" },
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

paypalControllerRouter.get(
  "/get-subscription",
  paypalController.getSubscriptionDetails.bind(paypalController)
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

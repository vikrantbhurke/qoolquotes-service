import { Role } from "../../user/enums";
import { Subscription } from "../enums";
import { subscriptionUtility } from "../subscription.utility";
import { StripeService, stripeService } from "./stripe.service";
import express, { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export class StripeWebhook {
  stripeService: StripeService;

  constructor() {
    this.stripeService = stripeService;
  }

  async webhook(request: Request, response: Response) {
    try {
      const sig = request.headers["stripe-signature"] as string;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

      let event;
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          sig,
          endpointSecret
        );
      } catch (err: any) {
        console.error("Webhook signature verification failed.", err.message);
        return response.status(400).json({ message: "Invalid signature." });
      }

      console.log("Stripe Webhook:", event);

      //   const eventType = event.type;
      //   const subscription = event.data.object as Stripe.Subscription;
      //   const subscriptionId = subscription.id;
      //   const subscriptionStatus = subscription.status;
      //   const customerId = subscription.customer as string;

      //   const customer = await stripe.customers.retrieve(customerId);
      //   const email = (customer as any).email;

      //   const emailDTO = { email };
      //   let updateUserDTO = {};

      //   if (
      //     eventType === "customer.subscription.created" ||
      //     eventType === "customer.subscription.updated"
      //   ) {
      //     if (subscriptionStatus === "active") {
      //       updateUserDTO = {
      //         role: Role.Subscriber,
      //         subscription: Subscription.Stripe,
      //         subscriptionId,
      //         subscriptionStatus: subscriptionUtility.getStatus(
      //           subscriptionStatus
      //         ) as any,
      //       };
      //     } else if (
      //       subscriptionStatus === "paused" ||
      //       subscriptionStatus === "past_due"
      //     ) {
      //       updateUserDTO = {
      //         role: Role.Private,
      //         subscription: Subscription.Stripe,
      //         subscriptionId,
      //         subscriptionStatus: subscriptionUtility.getStatus(
      //           subscriptionStatus
      //         ) as any,
      //       };
      //     }
      //   }

      //   if (eventType === "customer.subscription.deleted") {
      //     updateUserDTO = {
      //       role: Role.Private,
      //       subscription: Subscription.Free,
      //       subscriptionId: "none",
      //       subscriptionStatus: subscriptionUtility.getStatus(
      //         subscriptionStatus
      //       ) as any,
      //     };
      //   }

      //   console.log("Stripe Subscription Id:", subscriptionId);
      //   console.log("Event Type:", eventType);
      //   console.log("Subscription Status:", subscriptionStatus);
      //   console.log("Customer Id:", customerId);

      //   await this.stripeService.updateUserByEmail(emailDTO, updateUserDTO);

      return response.status(200).json({ message: "Webhook received." });
    } catch (error: any) {
      console.error("Error processing Stripe webhook:", error);
      return response.status(500).json({ message: error.message });
    }
  }
}

export const stripeWebhook = new StripeWebhook();

const stripeWebhookRouter = express.Router();

stripeWebhookRouter.post(
  "/",
  express.raw({ type: "application/json" }),
  stripeWebhook.webhook.bind(stripeWebhook)
);

export default stripeWebhookRouter;

// export class StripeWebhook {
//   stripeService: StripeService;

//   constructor() {
//     this.stripeService = stripeService;
//   }

//   async webhook(request: Request, response: Response) {
//     try {
//       const sig = request.headers["stripe-signature"] as string;
//       const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

//       const event = stripe.webhooks.constructEvent(
//         request.body,
//         sig,
//         endpointSecret
//       );

//       const subscriptionId = event.data.object.id;
//       const eventType = event.type;
//       const subscriptionStatus = event.data.object.status;
//       const email = event.data.object.customer_email;

//       const emailDTO = { email };

//       let updateUserDTO = {};

//       if (eventType === "customer.subscription.created") {
//         updateUserDTO = {
//           role: Role.Subscriber,
//           subscription: Subscription.Stripe,
//           subscriptionId,
//           subscriptionStatus: subscriptionUtility.getStatus(
//             subscriptionStatus
//           ) as any,
//         };
//       }

//       if (eventType === "customer.subscription.updated") {
//         updateUserDTO = {
//           role:
//             subscriptionStatus === "active" ? Role.Subscriber : Role.Private,
//           subscription: Subscription.Stripe,
//           subscriptionId,
//           subscriptionStatus: subscriptionUtility.getStatus(
//             subscriptionStatus
//           ) as any,
//         };
//       }

//       if (eventType === "customer.subscription.deleted") {
//         updateUserDTO = {
//           role: Role.Private,
//           subscription: Subscription.Free,
//           subscriptionId: "none",
//           subscriptionStatus: subscriptionUtility.getStatus(
//             subscriptionStatus
//           ) as any,
//         };
//       }

//       console.log("Subscription Id", subscriptionId);
//       console.log("Event Type", eventType);
//       console.log("Subscription Status", subscriptionStatus);
//       console.log("Email Address", email);

//       await this.stripeService.updateUserByEmail(emailDTO, updateUserDTO);
//       return response.status(200).json({ message: "Webhook received." });
//     } catch (error: any) {
//       console.log("Error", error);
//       return response.status(500).json({ message: error.message });
//     }
//   }
// }

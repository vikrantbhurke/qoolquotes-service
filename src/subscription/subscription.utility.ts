import { Status } from "./enums";

export class SubscriptionUtility {
  getStatus(status: string) {
    // PayPal
    switch (status) {
      case "ACTIVE":
        return Status.Active;
      case "SUSPENDED":
        return Status.Suspended;
      case "CANCELLED":
        return Status.Canceled;
      case "EXPIRED":
        return Status.Expired;
      // Stripe
      case "active":
        return Status.Active;
      default:
        return Status.Inactive;
    }
  }
}

export const subscriptionUtility = new SubscriptionUtility();

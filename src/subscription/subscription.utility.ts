import { SubscriptionStatus } from "./enums";

export class SubscriptionUtility {
  getSubscriptionStatus(subscriptionStatus: string) {
    // PayPal
    switch (subscriptionStatus) {
      case "ACTIVE":
        return SubscriptionStatus.Active;
      case "SUSPENDED":
        return SubscriptionStatus.Suspended;
      case "CANCELLED":
        return SubscriptionStatus.Canceled;
      case "EXPIRED":
        return SubscriptionStatus.Expired;
      // Stripe
      case "active":
        return SubscriptionStatus.Active;
      default:
        return SubscriptionStatus.Inactive;
    }
  }
}

export const subscriptionUtility = new SubscriptionUtility();

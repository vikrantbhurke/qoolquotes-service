import { SubscriptionStatus } from "./enums";

export class SubscriptionUtility {
  getSubscriptionStatus(subscriptionStatus: string) {
    // PayPal
    switch (subscriptionStatus) {
      case "APPROVAL_PENDING":
        return SubscriptionStatus.Pending;
      case "ACTIVE":
        return SubscriptionStatus.Active;
      case "SUSPENDED":
        return SubscriptionStatus.Suspended;
      case "CANCELLED":
        return SubscriptionStatus.Canceled;
      // Stripe
      case "incomplete":
        return SubscriptionStatus.Pending;
      case "active":
        return SubscriptionStatus.Active;
      default:
        return SubscriptionStatus.Inactive;
    }
  }
}

export const subscriptionUtility = new SubscriptionUtility();

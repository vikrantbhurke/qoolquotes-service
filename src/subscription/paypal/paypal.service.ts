import { UserService } from "../index";

export class PayPalService {
  userService: UserService;

  setUserService(userService: UserService) {
    this.userService = userService;
  }

  async updateUserSubscriptionStatus(subscriptionDetails: any) {
    // Update user subscription status
  }
  async addUserCustomerId(userDetails: any) {
    // Add user customer ID
  }
  async removeUserCustomerId(userDetails: any) {
    // Remove user customer ID
  }
}

export const paypalService = new PayPalService();

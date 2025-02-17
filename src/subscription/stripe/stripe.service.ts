import { UserService } from "../index";

export class StripeService {
  userService: UserService;

  setUserService(userService: UserService) {
    this.userService = userService;
  }

  async updateUserSubscriptionStatus(subscriptionDetails: any) {
    await this.userService.updateUserSubscriptionStatus(subscriptionDetails);
  }
  async addUserCustomerId(userDetails: any) {
    await this.userService.addUserCustomerId(userDetails);
  }
  async removeUserCustomerId(userDetails: any) {
    await this.userService.removeUserCustomerId(userDetails);
  }
}

export const stripeService = new StripeService();

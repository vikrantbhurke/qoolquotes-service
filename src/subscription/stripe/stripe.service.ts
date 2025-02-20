import { EmailDTO, UpdateUserDTO } from "../../user/dtos";
import { UserService } from "../index";

export class StripeService {
  userService: UserService;

  setUserService(userService: UserService) {
    this.userService = userService;
  }

  async updateUserByEmail(emailDTO: EmailDTO, updateUserDTO: UpdateUserDTO) {
    return await this.userService.updateUserByEmail(emailDTO, updateUserDTO);
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

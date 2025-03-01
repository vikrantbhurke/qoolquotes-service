import { EmailDTO, UpdateUserDTO } from "../../user/dtos";
import { UserService } from "./index";

export class StripeService {
  userService: UserService;

  setUserService(userService: UserService) {
    this.userService = userService;
  }

  async updateUserByEmail(emailDTO: EmailDTO, updateUserDTO: UpdateUserDTO) {
    return await this.userService.updateUserByEmail(emailDTO, updateUserDTO);
  }
}

export const stripeService = new StripeService();

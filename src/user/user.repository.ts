import User from "./user.model";
import { createModel } from "../global/decorators/create";
import { deleteModelById } from "../global/decorators/delete";
import { updateModelById } from "../global/decorators/update";
import {
  checkModel,
  getModelByField,
  getModelById,
} from "../global/decorators/read";
import { getUserByIdConfig } from "./user.config";
import { EmailDTO, UsernameDTO } from "./dtos";

export class UserRepository {
  @createModel(User)
  async signUpUser(newUser: any, user?: any) {
    return user;
  }

  @getModelByField(User, {})
  async getUserByUsername(usernameDTO: UsernameDTO, user?: any) {
    return user;
  }

  @checkModel(User)
  async checkUserByEmail(emailDTO: EmailDTO, exists?: any) {
    return exists;
  }

  @getModelById(User, getUserByIdConfig)
  async getUserById(uid: string, user?: any) {
    return user;
  }

  @updateModelById(User)
  async updateUserById(uid: string, updatedUser: any, user?: any) {
    return user;
  }

  @deleteModelById(User)
  async deleteUserById(uid: string, user?: any) {
    return user;
  }
}

export const userRepository = new UserRepository();

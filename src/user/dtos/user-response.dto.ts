import { Schema } from "mongoose";

export default class UserResponseDTO {
  id: Schema.Types.ObjectId;
  profilepic: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  subscription: string;
  subscriptionStatus: string;
  subscriptionId: string;
}

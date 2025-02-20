import { Schema } from "mongoose";

export default class UserResponseDTO {
  id: Schema.Types.ObjectId;
  profilepic: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  customerId: string;
  subscriptionStatus: string;
  subscriptionId: string;
}

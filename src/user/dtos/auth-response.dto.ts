import { Schema } from "mongoose";

export default class AuthResponseDTO {
  id: Schema.Types.ObjectId;
  profilepic: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  customerId: string;
  subscriptionStatus: string;
  token: string;
  role: string;
}

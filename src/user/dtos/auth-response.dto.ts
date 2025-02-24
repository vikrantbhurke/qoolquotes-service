import { Schema } from "mongoose";

export default class AuthResponseDTO {
  id: Schema.Types.ObjectId;
  profilepic: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  subscription: string;
  subscriptionStatus: string;
  subscriptionId: string;
  token: string;
  role: string;
}

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Document } from "mongoose";
import { Gender, Role } from "./enums";
import { Status, Subscription } from "../subscription/enums";

@modelOptions({
  schemaOptions: { collection: "Users", timestamps: true },
})
export class User extends Document {
  @prop({ type: String, default: "" })
  profilepic: string;

  @prop({ type: String, required: true })
  firstname: string;

  @prop({ type: String, required: true })
  lastname: string;

  @prop({ type: String, required: true, unique: true })
  username: string;

  @prop({ type: String, required: true, unique: true })
  email: string;

  @prop({ type: String, required: true })
  hashedPassword: string;

  @prop({ enum: Role, required: true, default: Role.Private })
  role: Role;

  @prop({ enum: Gender, required: true })
  gender: Gender;

  @prop({ enum: Status, default: Status.Inactive })
  subscriptionStatus: Status;

  @prop({ type: String, default: "none" })
  subscriptionId: string;

  @prop({ enum: Subscription, default: Subscription.Free })
  subscription: Subscription;

  @prop({ type: Boolean, default: false })
  isVerified: boolean;

  @prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export default getModelForClass(User);

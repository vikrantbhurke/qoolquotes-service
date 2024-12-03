import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Document } from "mongoose";
import { Reason } from "./enums";

@modelOptions({
  schemaOptions: {
    collection: "Messages",
    timestamps: true,
  },
})
export class Message extends Document {
  @prop({ type: String, required: true })
  title: string;

  @prop({ enum: Reason, required: true })
  reason: Reason;

  @prop({ type: String, required: true })
  description: string;

  @prop({ type: String, required: true })
  email: string;

  @prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export default getModelForClass(Message);

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Document } from "mongoose";

@modelOptions({
  schemaOptions: { collection: "Topics", timestamps: true },
})
export class Topic extends Document {
  @prop({ type: String, required: true })
  name: string;

  @prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export default getModelForClass(Topic);

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Document } from "mongoose";

@modelOptions({
  schemaOptions: { collection: "CitedQuotes", timestamps: true },
})
export class CitedQuote extends Document {
  @prop({ type: String, required: true })
  content: string;

  @prop({ type: String, required: true })
  author: string;

  @prop({ type: String, required: true })
  citation: string;

  @prop({ type: String, required: true })
  email: string;

  @prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export default getModelForClass(CitedQuote);

import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Document } from "mongoose";

@modelOptions({
  schemaOptions: { collection: "QuoteIds", timestamps: true },
})
export class QuoteId extends Document {
  @prop({ type: String })
  quoteId: string;
}

export default getModelForClass(QuoteId);

import { Document } from "mongoose";
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: { collection: "QuoteIds", timestamps: true },
})
export class QuoteId extends Document {
  @prop({ type: String })
  qid: string;
}

export default getModelForClass(QuoteId);

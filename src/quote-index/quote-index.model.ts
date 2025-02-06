import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Document } from "mongoose";

@modelOptions({
  schemaOptions: { collection: "QuoteIndex", timestamps: true },
})
export class QuoteIndex extends Document {
  @prop({ type: Number, default: 0 })
  index: number;
}

export default getModelForClass(QuoteIndex);

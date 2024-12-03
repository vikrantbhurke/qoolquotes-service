import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Document, Schema } from "mongoose";

@modelOptions({
  schemaOptions: { collection: "QuotesLikers", timestamps: true },
})
export class QuoteLiker extends Document {
  @prop({ type: Schema.Types.ObjectId, ref: "Quote", required: true })
  quoteId: Schema.Types.ObjectId;

  @prop({ type: Schema.Types.ObjectId, ref: "User", required: true })
  likerId: Schema.Types.ObjectId;

  @prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export default getModelForClass(QuoteLiker);

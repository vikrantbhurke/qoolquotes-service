import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Document, Schema } from "mongoose";

@modelOptions({
  schemaOptions: { collection: "Quotes", timestamps: true },
})
export class Quote extends Document {
  @prop({ type: String, required: true })
  content: string;

  @prop({ type: Schema.Types.ObjectId, ref: "Author", required: true })
  authorId: Schema.Types.ObjectId;

  @prop({ type: Schema.Types.ObjectId, ref: "Topic", required: true })
  topicIds: Schema.Types.ObjectId[];

  @prop({ type: Number, default: 0 })
  likes: number;

  @prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export default getModelForClass(Quote);

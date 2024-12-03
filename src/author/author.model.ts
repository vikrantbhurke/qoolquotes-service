import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Document } from "mongoose";

@modelOptions({ schemaOptions: { collection: "Authors", timestamps: true } })
export class Author extends Document {
  @prop({ type: String, required: true })
  name: string;

  @prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export default getModelForClass(Author);

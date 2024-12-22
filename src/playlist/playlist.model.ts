import { Access } from "./enums";
import { Document, Schema } from "mongoose";
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: { collection: "Playlists", timestamps: true },
})
export class Playlist extends Document {
  @prop({ type: String, required: true })
  name: string;

  @prop({ type: String })
  description: string;

  @prop({ type: Schema.Types.ObjectId, ref: "User", required: true })
  creatorId: Schema.Types.ObjectId;

  @prop({ enum: Access, required: true, default: Access.Public })
  access: Access;

  @prop({ type: Number, default: 0 })
  likes: number;

  @prop({ type: Number, default: 0 })
  quotes: number;

  @prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export default getModelForClass(Playlist);

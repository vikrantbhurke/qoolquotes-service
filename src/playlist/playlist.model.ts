import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Document, Schema } from "mongoose";
import { Access } from "./enums";

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

  @prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export default getModelForClass(Playlist);

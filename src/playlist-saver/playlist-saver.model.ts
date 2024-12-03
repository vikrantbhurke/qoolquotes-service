import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Document, Schema } from "mongoose";

@modelOptions({
  schemaOptions: { collection: "PlaylistsSavers", timestamps: true },
})
export class PlaylistSaver extends Document {
  @prop({ type: Schema.Types.ObjectId, ref: "Playlist", required: true })
  playlistId: Schema.Types.ObjectId;

  @prop({ type: Schema.Types.ObjectId, ref: "User", required: true })
  saverId: Schema.Types.ObjectId;

  @prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export default getModelForClass(PlaylistSaver);

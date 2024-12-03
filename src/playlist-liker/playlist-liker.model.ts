import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Document, Schema } from "mongoose";

@modelOptions({
  schemaOptions: { collection: "PlaylistsLikers", timestamps: true },
})
export class PlaylistLiker extends Document {
  @prop({ type: Schema.Types.ObjectId, ref: "Playlist", required: true })
  playlistId: Schema.Types.ObjectId;

  @prop({ type: Schema.Types.ObjectId, ref: "User", required: true })
  likerId: Schema.Types.ObjectId;

  @prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export default getModelForClass(PlaylistLiker);

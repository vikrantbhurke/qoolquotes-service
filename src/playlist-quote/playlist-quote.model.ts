import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Document, Schema } from "mongoose";

@modelOptions({
  schemaOptions: { collection: "PlaylistsQuotes", timestamps: true },
})
export class PlaylistQuote extends Document {
  @prop({ type: Schema.Types.ObjectId, ref: "Playlist", required: true })
  playlistId: Schema.Types.ObjectId;

  @prop({ type: Schema.Types.ObjectId, ref: "Quote", required: true })
  quoteId: Schema.Types.ObjectId;

  @prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export default getModelForClass(PlaylistQuote);

import { Schema } from "mongoose";
import { Access } from "../enums";

export default class PlaylistResponseDTO {
  id: Schema.Types.ObjectId;
  name: string;
  description: string;
  creatorId: Schema.Types.ObjectId;
  access: Access;
  likes: number;
}

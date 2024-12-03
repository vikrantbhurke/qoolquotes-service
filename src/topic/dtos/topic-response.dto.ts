import { Schema } from "mongoose";

export default class TopicResponseDTO {
  id: Schema.Types.ObjectId;
  name: string;
}

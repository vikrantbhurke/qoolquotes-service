import { Schema } from "mongoose";

export default class QuoteResponseDTO {
  id: Schema.Types.ObjectId;
  content: string;
  authorId: Schema.Types.ObjectId;
  topicIds: Schema.Types.ObjectId[];
  likes: number;
}

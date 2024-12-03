import { Schema } from "mongoose";

export default class AuthorResponseDTO {
  id: Schema.Types.ObjectId;
  name: string;
}

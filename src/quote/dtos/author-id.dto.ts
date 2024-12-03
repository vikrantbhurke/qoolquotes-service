import { IsNotEmpty, IsString } from "class-validator";

export default class AuthorIdDTO {
  @IsString()
  @IsNotEmpty()
  authorId: string;
}

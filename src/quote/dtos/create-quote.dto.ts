import { IsNotEmpty, IsString } from "class-validator";

export default class CreateQuoteDTO {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  author: string;
}

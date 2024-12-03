import { IsNotEmpty, IsString } from "class-validator";

export default class ContentDTO {
  @IsString()
  @IsNotEmpty()
  content: string;
}

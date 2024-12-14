import { IsNotEmpty, IsString } from "class-validator";

export default class NameDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

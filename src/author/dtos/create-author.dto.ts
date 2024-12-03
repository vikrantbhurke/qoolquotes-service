import { IsNotEmpty, IsString } from "class-validator";

export default class CreateAuthorDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

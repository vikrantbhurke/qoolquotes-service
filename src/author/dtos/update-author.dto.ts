import { IsNotEmpty, IsString } from "class-validator";

export default class UpdateAuthorDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

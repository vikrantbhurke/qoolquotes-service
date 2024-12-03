import { IsNotEmpty, IsString } from "class-validator";

export default class UsernameDTO {
  @IsString()
  @IsNotEmpty()
  username: string;
}

import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export default class EmailDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

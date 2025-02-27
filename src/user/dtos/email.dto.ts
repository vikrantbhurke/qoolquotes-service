import { IsEmail, IsNotEmpty } from "class-validator";

export default class EmailDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

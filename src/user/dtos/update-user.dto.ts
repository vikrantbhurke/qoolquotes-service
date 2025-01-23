import {
  IsAlpha,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsStrongPassword,
} from "class-validator";
import { UserError } from "../user.error";

export default class UpdateUserDTO {
  @IsOptional()
  profilepic?: string;

  @IsOptional()
  @IsAlpha(undefined, {
    message: UserError.Firstname,
  })
  firstname?: string;

  @IsOptional()
  @IsAlpha(undefined, {
    message: UserError.Lastname,
  })
  lastname?: string;

  @IsOptional()
  @IsEmail(undefined, {
    message: UserError.Email,
  })
  email?: string;

  @IsOptional()
  @IsStrongPassword(undefined, {
    message: UserError.Password,
  })
  password?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}

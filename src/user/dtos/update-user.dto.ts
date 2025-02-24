import {
  IsAlpha,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsStrongPassword,
} from "class-validator";
import { UserError } from "../user.error";
import { Status, Subscription } from "../../subscription/enums";

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
  @IsEnum(Status)
  subscriptionStatus?: Status;

  @IsOptional()
  subscriptionId?: string;

  @IsOptional()
  @IsEnum(Subscription)
  subscription?: Subscription;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}

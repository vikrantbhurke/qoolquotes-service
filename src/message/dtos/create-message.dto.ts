import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Reason } from "../enums";
import { MessageError } from "../message.error";

export default class CreateMessageDTO {
  @IsString({
    message: MessageError.Title,
  })
  @IsNotEmpty()
  title: string;

  @IsString({
    message: MessageError.Description,
  })
  @IsNotEmpty()
  description: string;

  @IsEnum(Reason, {
    message: MessageError.Reason,
  })
  @IsNotEmpty()
  reason: Reason;

  @IsString({
    message: MessageError.Email,
  })
  @IsNotEmpty()
  email: string;
}

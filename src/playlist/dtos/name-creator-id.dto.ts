import { IsNotEmpty, IsString } from "class-validator";

export default class NameCreatorIdDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  creatorId: string;
}

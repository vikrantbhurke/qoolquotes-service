import { IsNotEmpty, IsString } from "class-validator";

export default class CreatorIdDTO {
  @IsString()
  @IsNotEmpty()
  creatorId: string;
}

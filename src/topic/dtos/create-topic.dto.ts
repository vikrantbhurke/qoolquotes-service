import { IsNotEmpty, IsString } from "class-validator";

export default class CreateTopicDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

import { IsNotEmpty, IsString } from "class-validator";

export default class UpdateTopicDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

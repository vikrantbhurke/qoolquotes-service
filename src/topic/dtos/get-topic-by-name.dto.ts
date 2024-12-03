import { IsNotEmpty, IsString } from "class-validator";

export default class GetTopicByNameDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

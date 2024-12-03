import { IsNotEmpty, IsString } from "class-validator";

export default class TopicIdDTO {
  @IsString()
  @IsNotEmpty()
  topicIds: string;
}

import { IsOptional, IsString } from "class-validator";

export default class UpdateQuoteDTO {
  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  authorId: string;

  @IsOptional()
  topicIds: string[];
}

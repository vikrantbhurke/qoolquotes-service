import { IsNotEmpty, IsString } from "class-validator";

export default class QuoteIdDTO {
  @IsString()
  @IsNotEmpty()
  quoteId: string;
}

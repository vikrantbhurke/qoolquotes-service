import { IsNotEmpty, IsString } from "class-validator";

export default class QuoteIdLikerIdDTO {
  @IsString()
  @IsNotEmpty()
  quoteId: string;

  @IsString()
  @IsNotEmpty()
  likerId: string;
}

import { IsNotEmpty, IsString } from "class-validator";
import { CitedQuoteError } from "../cited-quote.error";

export default class CreateCitedQuoteDTO {
  @IsString({
    message: CitedQuoteError.Content,
  })
  @IsNotEmpty()
  content: string;

  @IsString({
    message: CitedQuoteError.Author,
  })
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  citation: string;

  @IsString({
    message: CitedQuoteError.Email,
  })
  @IsNotEmpty()
  email: string;
}

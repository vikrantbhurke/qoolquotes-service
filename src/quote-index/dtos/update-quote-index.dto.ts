import { IsNumber, IsOptional } from "class-validator";

export default class UpdateQuoteIndexDTO {
  @IsNumber()
  @IsOptional()
  index: number;
}

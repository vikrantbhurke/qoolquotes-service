import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { Order } from "../../global/enums";

export class GetModelsDTO {
  @IsNotEmpty({ message: "Page number is required." })
  @IsNumber(undefined, { message: "Page number must be a number." })
  page: number;

  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @IsEnum(Order, { message: "Order must be Asc or Desc." })
  order: Order;
}

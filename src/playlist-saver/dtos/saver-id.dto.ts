import { IsNotEmpty, IsString } from "class-validator";

export default class SaverIdDTO {
  @IsString()
  @IsNotEmpty()
  saverId: string;
}

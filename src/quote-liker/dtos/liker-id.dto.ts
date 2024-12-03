import { IsNotEmpty, IsString } from "class-validator";

export default class LikerIdDTO {
  @IsString()
  @IsNotEmpty()
  likerId: string;
}

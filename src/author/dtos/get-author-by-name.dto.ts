import { IsNotEmpty, IsString } from "class-validator";

export default class GetAuthorByNameDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

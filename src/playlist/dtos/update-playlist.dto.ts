import { IsEnum, IsOptional, IsString } from "class-validator";
import { Access } from "../enums";
import { PlaylistError } from "../playlist.error";

export default class UpdatePlaylistDTO {
  @IsString({
    message: PlaylistError.Name,
  })
  name: string;

  @IsOptional()
  @IsString({
    message: PlaylistError.Description,
  })
  description: string;

  @IsOptional()
  @IsEnum(Access, {
    message: PlaylistError.Access,
  })
  access: Access;
}

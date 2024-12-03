import { IsNotEmpty, IsString } from "class-validator";

export default class PlaylistIdLikerIdDTO {
  @IsString()
  @IsNotEmpty()
  playlistId: string;

  @IsString()
  @IsNotEmpty()
  likerId: string;
}

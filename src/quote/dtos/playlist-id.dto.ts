import { IsNotEmpty, IsString } from "class-validator";

export default class PlaylistIdDTO {
  @IsString()
  @IsNotEmpty()
  playlistId: string;
}

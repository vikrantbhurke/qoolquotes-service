import { IsNotEmpty, IsString } from "class-validator";

export default class DeletePlaylistSaverDTO {
  @IsString()
  @IsNotEmpty()
  playlistId: string;

  @IsString()
  @IsNotEmpty()
  saverId: string;
}

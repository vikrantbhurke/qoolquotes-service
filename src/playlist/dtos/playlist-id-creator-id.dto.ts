import { IsNotEmpty, IsString } from "class-validator";

export default class PlaylistIdCreatorIdDTO {
  @IsString()
  @IsNotEmpty()
  playlistId: string;

  @IsString()
  @IsNotEmpty()
  creatorId: string;
}

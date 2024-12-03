import { IsNotEmpty, IsString } from "class-validator";

export default class PlaylistIdQuoteIdDTO {
  @IsString()
  @IsNotEmpty()
  playlistId: string;

  @IsString()
  @IsNotEmpty()
  quoteId: string;
}

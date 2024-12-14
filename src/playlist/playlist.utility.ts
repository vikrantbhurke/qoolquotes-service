import { Schema } from "mongoose";
import { PlaylistResponseDTO } from "./dtos";
import { Playlist } from "./playlist.model";

export class PlaylistUtility {
  convertPlaylistToPlaylistDTO(playlist: Playlist): PlaylistResponseDTO {
    const playlistDTO = new PlaylistResponseDTO();
    playlistDTO.id = playlist._id as Schema.Types.ObjectId;
    playlistDTO.name = playlist.name;
    playlistDTO.description = playlist.description;
    playlistDTO.creatorId = playlist.creatorId;
    playlistDTO.access = playlist.access;
    return playlistDTO;
  }
}

export const playlistUtility = new PlaylistUtility();

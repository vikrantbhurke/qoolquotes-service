import {
  deleteModelByField,
  deleteModelsByField,
} from "../global/decorators/delete";
import PlaylistLiker from "./playlist-liker.model";
import { createModel } from "../global/decorators/create";
import { LikerIdDTO, PlaylistIdLikerIdDTO, PlaylistIdDTO } from "./dtos";
import { countModelsByField, checkModel } from "../global/decorators/read";

export class PlaylistLikerRepository {
  @createModel(PlaylistLiker)
  async createPlaylistLiker(
    playlistIdLikerIdDTO: PlaylistIdLikerIdDTO,
    playlistLiker?: any
  ) {
    return playlistLiker;
  }

  @checkModel(PlaylistLiker)
  async checkPlaylistLiker(
    playlistIdLikerIdDTO: PlaylistIdLikerIdDTO,
    exists?: any
  ) {
    return exists;
  }

  @countModelsByField(PlaylistLiker)
  async countPlaylistsLikersByPlaylistId(
    playlistIdDTO: PlaylistIdDTO,
    count?: number
  ) {
    return count;
  }

  @deleteModelByField(PlaylistLiker)
  async deletePlaylistLiker(
    playlistIdLikerIdDTO: PlaylistIdLikerIdDTO,
    playlistLiker?: any
  ) {
    return playlistLiker;
  }

  @deleteModelsByField(PlaylistLiker)
  async deletePlaylistsLikersByPlaylistId(playlistId: PlaylistIdDTO) {}

  @deleteModelsByField(PlaylistLiker)
  async deletePlaylistsLikersByLikerId(likerIdDTO: LikerIdDTO) {}
}

export const playlistLikerRepository = new PlaylistLikerRepository();

import {
  countModelsByField,
  getModelById,
  getModels,
  getModelsByField,
  searchModels,
} from "../global/decorators/read";
import { createModel } from "../global/decorators/create";
import Playlist from "./playlist.model";
import {
  getPlaylistByIdConfig,
  getPlaylistsByCreatorIdConfig,
  getPlaylistsConfig,
  searchPlaylistsConfig,
} from "./playlist.config";
import { updateModelById } from "../global/decorators/update";
import {
  deleteModelById,
  deleteModelsByField,
} from "../global/decorators/delete";
import { CreatorIdDTO, UpdatePlaylistDTO } from "./dtos";

export class PlaylistRepository {
  @createModel(Playlist)
  async createPlaylist(newPlaylist: any, playlist?: any) {
    return playlist;
  }

  @countModelsByField(Playlist)
  async countPlaylistsByCreatorId(creatorIdDTO: CreatorIdDTO, count?: number) {
    return count;
  }

  @getModels(Playlist, getPlaylistsConfig)
  async getPlaylists(page: number, playlistsPage?: any) {
    return playlistsPage;
  }

  @searchModels(Playlist, searchPlaylistsConfig)
  async searchPlaylists(page: number, search: string, playlistsPage?: any) {
    return playlistsPage;
  }

  @getModelsByField(Playlist, getPlaylistsByCreatorIdConfig)
  async getPlaylistsByCreatorId(
    page: number,
    creatorIdDTO: CreatorIdDTO,
    playlistsPage?: any
  ) {
    return playlistsPage;
  }

  @getModelById(Playlist, getPlaylistByIdConfig)
  async getPlaylistById(pid: string, playlist?: any) {
    return playlist;
  }

  @updateModelById(Playlist)
  async updatePlaylistById(
    pid: string,
    updatePlaylistDTO: UpdatePlaylistDTO,
    playlist?: any
  ) {
    return playlist;
  }

  @deleteModelById(Playlist)
  async deletePlaylistById(pid: string, playlist?: any) {
    return playlist;
  }

  @deleteModelsByField(Playlist)
  async deletePlaylistsByCreatorId(creatorIdDTO: CreatorIdDTO) {}
}

export const playlistRepository = new PlaylistRepository();

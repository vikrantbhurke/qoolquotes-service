import {
  getModelById,
  searchModels,
  getModelsByField,
  countModelsByField,
  getModelsByFieldDynamic,
} from "../global/decorators/read";
import {
  getPlaylistsConfig,
  getPlaylistByIdConfig,
  searchPlaylistsConfig,
  getPlaylistsByCreatorIdConfig,
} from "./playlist.config";
import {
  deleteModelById,
  deleteModelsByField,
} from "../global/decorators/delete";
import Playlist from "./playlist.model";
import { CreatorIdDTO, UpdatePlaylistDTO } from "./dtos";
import { createModel } from "../global/decorators/create";
import {
  decNumModelById,
  incNumModelById,
  updateModelById,
} from "../global/decorators/update";

export class PlaylistRepository {
  @createModel(Playlist)
  async createPlaylist(newPlaylist: any, playlist?: any) {
    return playlist;
  }

  @countModelsByField(Playlist)
  async countPlaylistsByCreatorId(creatorIdDTO: CreatorIdDTO, count?: number) {
    return count;
  }

  @getModelsByFieldDynamic(Playlist, getPlaylistsConfig)
  async getPlaylists(getPlaylistsDTO: any, fieldObj: any, playlistsPage?: any) {
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

  @incNumModelById(Playlist, "likes")
  async incPlaylistLikes(pid: string, playlist?: any) {
    return playlist;
  }

  @decNumModelById(Playlist, "likes")
  async decPlaylistLikes(pid: string, playlist?: any) {
    return playlist;
  }

  @incNumModelById(Playlist, "quotes")
  async incPlaylistQuotes(pid: string, playlist?: any) {
    return playlist;
  }

  @decNumModelById(Playlist, "quotes")
  async decPlaylistQuotes(pid: string, playlist?: any) {
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

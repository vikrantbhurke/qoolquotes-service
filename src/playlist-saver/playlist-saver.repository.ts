import PlaylistSaver from "./playlist-saver.model";
import {
  deleteModelByField,
  deleteModelsByField,
} from "../global/decorators/delete";
import { createModel } from "../global/decorators/create";
import {
  countModelsByField,
  getModelsByField,
  checkModel,
} from "../global/decorators/read";
import { Page } from "../global/types/page.type";
import { getPlaylistBySaverIdConfig } from "./playlist-saver.config";
import { PlaylistIdSaverIdDTO, SaverIdDTO, PlaylistIdDTO } from "./dtos";

export class PlaylistSaverRepository {
  @createModel(PlaylistSaver)
  async createPlaylistSaver(
    playlistIdSaverIdDTO: PlaylistIdSaverIdDTO,
    playlistSaver?: any
  ) {
    return playlistSaver;
  }

  @countModelsByField(PlaylistSaver)
  async countPlaylistsSaversBySaverId(saverIdDTO: SaverIdDTO, count?: number) {
    return count;
  }

  @checkModel(PlaylistSaver)
  async checkPlaylistSaver(
    playlistIdSaverIdDTO: PlaylistIdSaverIdDTO,
    exists?: any
  ) {
    return exists;
  }

  @getModelsByField(PlaylistSaver, getPlaylistBySaverIdConfig)
  async getPlaylistsSaversBySaverId(
    page: number,
    saverIdDTO: SaverIdDTO,
    playlistsSaversPage?: Page
  ) {
    return playlistsSaversPage;
  }

  @deleteModelByField(PlaylistSaver)
  async deletePlaylistSaver(
    playlistIdSaverIdDTO: PlaylistIdSaverIdDTO,
    playlistSaver?: any
  ) {
    return playlistSaver;
  }

  @deleteModelsByField(PlaylistSaver)
  async deletePlaylistsSaversByPlaylistId(playlistIdDTO: PlaylistIdDTO) {}

  @deleteModelsByField(PlaylistSaver)
  async deletePlaylistsSaversBySaverId(saverIdDTO: SaverIdDTO) {}
}

export const playlistSaverRepository = new PlaylistSaverRepository();

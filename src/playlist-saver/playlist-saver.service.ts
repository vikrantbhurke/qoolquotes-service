import { PLAYLIST_LIMIT } from "../global/constants/constants";
import { PlaylistIdSaverIdDTO, SaverIdDTO, PlaylistIdDTO } from "./dtos";
import { PlaylistSaverRepository } from "./index";

export class PlaylistSaverService {
  private playlistSaverRepository: PlaylistSaverRepository;

  setPlaylistSaverRepository(
    playlistSaverRepository: PlaylistSaverRepository
  ): void {
    this.playlistSaverRepository = playlistSaverRepository;
  }

  async createPlaylistSaver(playlistIdSaverIdDTO: PlaylistIdSaverIdDTO) {
    const count = await this.countPlaylistsSaversBySaverId({
      saverId: playlistIdSaverIdDTO.saverId,
    });

    if (count && count >= PLAYLIST_LIMIT)
      throw new Error(`You can't save more than ${PLAYLIST_LIMIT} playlists.`);

    return await this.playlistSaverRepository.createPlaylistSaver(
      playlistIdSaverIdDTO
    );
  }

  async countPlaylistsSaversBySaverId(saverIdDTO: SaverIdDTO) {
    return await this.playlistSaverRepository.countPlaylistsSaversBySaverId(
      saverIdDTO
    );
  }

  async checkPlaylistSaver(playlistIdSaverIdDTO: PlaylistIdSaverIdDTO) {
    return await this.playlistSaverRepository.checkPlaylistSaver(
      playlistIdSaverIdDTO
    );
  }

  async getPlaylistsSaversBySaverId(page: number, saverIdDTO: SaverIdDTO) {
    return await this.playlistSaverRepository.getPlaylistsSaversBySaverId(
      page,
      saverIdDTO
    );
  }

  async deletePlaylistSaver(playlistIdSaverIdDTO: PlaylistIdSaverIdDTO) {
    return await this.playlistSaverRepository.deletePlaylistSaver(
      playlistIdSaverIdDTO
    );
  }

  async deletePlaylistsSaversByPlaylistId(playlistIdDTO: PlaylistIdDTO) {
    return await this.playlistSaverRepository.deletePlaylistsSaversByPlaylistId(
      playlistIdDTO
    );
  }

  async deletePlaylistsSaversBySaverId(saverIdDTO: SaverIdDTO) {
    return await this.playlistSaverRepository.deletePlaylistsSaversBySaverId(
      saverIdDTO
    );
  }
}

export const playlistSaverService = new PlaylistSaverService();

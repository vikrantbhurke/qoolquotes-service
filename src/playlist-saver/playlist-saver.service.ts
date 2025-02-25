import { PlaylistSaverRepository } from "./index";
import {
  SAVE_PLAYLIST_FREE_LIMIT,
  SAVE_PLAYLIST_PAID_LIMIT,
} from "../global/constants/constants";
import { PlaylistIdSaverIdDTO, SaverIdDTO, PlaylistIdDTO } from "./dtos";
import { UserService } from "../user";
import { Role } from "../user/enums";

export class PlaylistSaverService {
  playlistSaverRepository: PlaylistSaverRepository;
  userService: UserService;

  setPlaylistSaverRepository(
    playlistSaverRepository: PlaylistSaverRepository
  ): void {
    this.playlistSaverRepository = playlistSaverRepository;
  }

  setUserService(userService: UserService): void {
    this.userService = userService;
  }

  async createPlaylistSaver(playlistIdSaverIdDTO: PlaylistIdSaverIdDTO) {
    const user = await this.userService.getUserById(
      playlistIdSaverIdDTO.saverId
    );

    if (!user) throw new Error("User not found.");
    const userRole = user.role;

    const count = await this.countPlaylistsSaversBySaverId({
      saverId: playlistIdSaverIdDTO.saverId,
    });

    if (
      userRole === Role.Private &&
      count &&
      count >= SAVE_PLAYLIST_FREE_LIMIT
    ) {
      throw new Error(
        `You can't save more than ${SAVE_PLAYLIST_FREE_LIMIT} playlists.`
      );
    } else {
      if (count && count >= SAVE_PLAYLIST_PAID_LIMIT)
        throw new Error(
          `You can't save more than ${SAVE_PLAYLIST_PAID_LIMIT} playlists.`
        );
    }

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

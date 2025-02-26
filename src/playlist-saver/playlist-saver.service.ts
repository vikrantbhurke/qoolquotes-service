import { PlaylistSaverRepository } from "./index";
import {
  SAVE_PLAYLIST_FREE_LIMIT,
  SAVE_PLAYLIST_PAID_LIMIT,
} from "../global/constants/constants";
import { PlaylistIdSaverIdDTO, SaverIdDTO, PlaylistIdDTO } from "./dtos";
import { UserService } from "../user";
import { Role } from "../user/enums";
import { Status } from "../subscription/enums";

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

    const count = await this.countPlaylistsSaversBySaverId({
      saverId: playlistIdSaverIdDTO.saverId,
    });

    const userIsActive = user.subscriptionStatus === Status.Active;
    const userIsInactive = user.subscriptionStatus === Status.Inactive;
    const userIsSuspended = user.subscriptionStatus === Status.Suspended;

    const maxFreeLimit = `You can't save more than ${SAVE_PLAYLIST_FREE_LIMIT} playlists. Subscribe to remove limit.`;
    const maxPaidLimit = `You can't save more than ${SAVE_PLAYLIST_PAID_LIMIT} playlists. Maximum playlist limit reached.`;
    const withinLimit = `Activate your subscription to save more playlists.`;

    if (userIsInactive && count && count >= SAVE_PLAYLIST_FREE_LIMIT)
      throw new Error(maxFreeLimit);

    if (
      (userIsActive || userIsSuspended) &&
      count &&
      count >= SAVE_PLAYLIST_PAID_LIMIT
    )
      throw new Error(maxPaidLimit);

    if (
      userIsSuspended &&
      count &&
      count >= SAVE_PLAYLIST_FREE_LIMIT &&
      count < SAVE_PLAYLIST_PAID_LIMIT
    )
      throw new Error(withinLimit);

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

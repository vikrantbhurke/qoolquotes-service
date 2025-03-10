import { PlaylistQuoteRepository } from "./index";
import {
  QUOTE_FREE_LIMIT,
  QUOTE_PAID_LIMIT,
} from "../global/constants/constants";
import { UserService } from "../user";
import { PlaylistService } from "../playlist/playlist.service";
import { PlaylistIdQuoteIdDTO, PlaylistIdDTO, QuoteIdDTO } from "./dtos";
import { Role } from "../user/enums";
import { Status } from "../subscription/enums";

export class PlaylistQuoteService {
  playlistQuoteRepository: PlaylistQuoteRepository;
  playlistService: PlaylistService;
  userService: UserService;

  setPlaylistQuoteRepository(
    playlistQuoteRepository: PlaylistQuoteRepository
  ): void {
    this.playlistQuoteRepository = playlistQuoteRepository;
  }

  setPlaylistService(playlistService: PlaylistService): void {
    this.playlistService = playlistService;
  }

  setUserService(userService: UserService): void {
    this.userService = userService;
  }

  async createPlaylistQuote(playlistIdQuoteIdDTO: PlaylistIdQuoteIdDTO) {
    const playlist = await this.playlistService.getPlaylistById(
      playlistIdQuoteIdDTO.playlistId
    );

    if (!playlist) throw new Error("Playlist not found.");

    const user = await this.userService.getUserById(
      playlist.creatorId._id.toString()
    );

    if (!user) throw new Error("User not found.");
    const userRole = user.role;

    const count = await this.countPlaylistsQuotesByPlaylistId({
      playlistId: playlistIdQuoteIdDTO.playlistId,
    });

    const userIsActive = user.subscriptionStatus === Status.Active;
    const userIsInactive = user.subscriptionStatus === Status.Inactive;
    const userIsSuspended = user.subscriptionStatus === Status.Suspended;

    const maxFreeLimit = `You can't add more than ${QUOTE_FREE_LIMIT} quotes to a playlist. Subscribe to remove limit.`;
    const maxPaidLimit = `You can't add more than ${QUOTE_PAID_LIMIT} quotes to a playlist. Maximum quote limit reached.`;
    const withinLimit = `Activate your subscription to add more quotes.`;

    if (userIsInactive && count && count >= QUOTE_FREE_LIMIT)
      throw new Error(maxFreeLimit);

    if ((userIsActive || userIsSuspended) && count && count >= QUOTE_PAID_LIMIT)
      throw new Error(maxPaidLimit);

    if (
      userIsSuspended &&
      count &&
      count >= QUOTE_FREE_LIMIT &&
      count < QUOTE_PAID_LIMIT
    )
      throw new Error(withinLimit);

    await this.playlistService.incPlaylistQuotes(
      playlistIdQuoteIdDTO.playlistId
    );

    return await this.playlistQuoteRepository.createPlaylistQuote(
      playlistIdQuoteIdDTO
    );
  }

  async countPlaylistsQuotesByPlaylistId(playlistIdDTO: PlaylistIdDTO) {
    return await this.playlistQuoteRepository.countPlaylistsQuotesByPlaylistId(
      playlistIdDTO
    );
  }

  async checkPlaylistQuote(playlistIdQuoteIdDTO: PlaylistIdQuoteIdDTO) {
    return await this.playlistQuoteRepository.checkPlaylistQuote(
      playlistIdQuoteIdDTO
    );
  }

  async getPlaylistQuoteByPlaylistId(playlistIdDTO: PlaylistIdDTO) {
    return await this.playlistQuoteRepository.getPlaylistQuoteByPlaylistId(
      playlistIdDTO
    );
  }

  async getPlaylistsQuotesByPlaylistId(
    page: number,
    playlistIdDTO: PlaylistIdDTO
  ) {
    return await this.playlistQuoteRepository.getPlaylistsQuotesByPlaylistId(
      page,
      playlistIdDTO
    );
  }

  async getPlaylistsQuotesByQuoteId(page: number, quoteIdDTO: QuoteIdDTO) {
    return await this.playlistQuoteRepository.getPlaylistsQuotesByQuoteId(
      page,
      quoteIdDTO
    );
  }

  async deletePlaylistQuote(playlistIdQuoteIdDTO: PlaylistIdQuoteIdDTO) {
    const { playlistId } = playlistIdQuoteIdDTO;

    await this.playlistQuoteRepository.deletePlaylistQuote(
      playlistIdQuoteIdDTO
    );

    const quote = await this.getPlaylistQuoteByPlaylistId({
      playlistId,
    });

    if (!quote) await this.playlistService.deletePlaylistById(playlistId);
    else await this.playlistService.decPlaylistQuotes(playlistId);
  }

  async deletePlaylistsQuotesByPlaylistId(playlistIdDTO: PlaylistIdDTO) {
    await this.playlistQuoteRepository.deletePlaylistsQuotesByPlaylistId(
      playlistIdDTO
    );
  }
}

export const playlistQuoteService = new PlaylistQuoteService();

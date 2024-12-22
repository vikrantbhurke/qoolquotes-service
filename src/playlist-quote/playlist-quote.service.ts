import { PlaylistQuoteRepository } from "./index";
import { QUOTE_LIMIT } from "../global/constants/constants";
import { PlaylistService } from "../playlist/playlist.service";
import { PlaylistIdQuoteIdDTO, PlaylistIdDTO, QuoteIdDTO } from "./dtos";

export class PlaylistQuoteService {
  playlistQuoteRepository: PlaylistQuoteRepository;
  playlistService: PlaylistService;

  setPlaylistQuoteRepository(
    playlistQuoteRepository: PlaylistQuoteRepository
  ): void {
    this.playlistQuoteRepository = playlistQuoteRepository;
  }

  setPlaylistService(playlistService: PlaylistService): void {
    this.playlistService = playlistService;
  }

  async createPlaylistQuote(playlistIdQuoteIdDTO: PlaylistIdQuoteIdDTO) {
    await this.playlistService.incPlaylistQuotes(
      playlistIdQuoteIdDTO.playlistId
    );

    const count = await this.countPlaylistsQuotesByPlaylistId({
      playlistId: playlistIdQuoteIdDTO.playlistId,
    });

    if (count && count >= QUOTE_LIMIT)
      throw new Error(
        `You can't add more than ${QUOTE_LIMIT} quotes to a playlist.`
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

    await this.playlistService.decPlaylistQuotes(playlistId);

    await this.playlistQuoteRepository.deletePlaylistQuote(
      playlistIdQuoteIdDTO
    );

    const quote = await this.getPlaylistQuoteByPlaylistId({
      playlistId,
    });

    if (!quote) await this.playlistService.deletePlaylistById(playlistId);
  }

  async deletePlaylistsQuotesByPlaylistId(playlistIdDTO: PlaylistIdDTO) {
    return await this.playlistQuoteRepository.deletePlaylistsQuotesByPlaylistId(
      playlistIdDTO
    );
  }
}

export const playlistQuoteService = new PlaylistQuoteService();

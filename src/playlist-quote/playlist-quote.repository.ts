import PlaylistQuote from "./playlist-quote.model";
import {
  deleteModelByField,
  deleteModelsByField,
} from "../global/decorators/delete";
import { createModel } from "../global/decorators/create";
import {
  countModelsByField,
  getModelsByField,
  checkModel,
  getModelByField,
} from "../global/decorators/read";
import { Page } from "../global/types/page.type";
import {
  getPlaylistsByQuoteIdConfig,
  getQuotesByPlaylistIdConfig,
} from "./playlist-quote.config";
import { PlaylistIdQuoteIdDTO, PlaylistIdDTO, QuoteIdDTO } from "./dtos";

export class PlaylistQuoteRepository {
  @createModel(PlaylistQuote)
  async createPlaylistQuote(
    playlistIdQuoteIdDTO: PlaylistIdQuoteIdDTO,
    playlistQuote?: any
  ) {
    return playlistQuote;
  }

  @checkModel(PlaylistQuote)
  async checkPlaylistQuote(
    playlistIdQuoteIdDTO: PlaylistIdQuoteIdDTO,
    exists?: any
  ) {
    return exists;
  }

  @countModelsByField(PlaylistQuote)
  async countPlaylistsQuotesByPlaylistId(
    playlistIdDTO: PlaylistIdDTO,
    count?: number
  ) {
    return count;
  }

  @getModelByField(PlaylistQuote, {})
  async getPlaylistQuoteByPlaylistId(
    playlistIdDTO: PlaylistIdDTO,
    playlistQuote?: any
  ) {
    return playlistQuote;
  }

  @getModelsByField(PlaylistQuote, getQuotesByPlaylistIdConfig)
  async getPlaylistsQuotesByPlaylistId(
    page: number,
    playlistIdDTO: PlaylistIdDTO,
    playlistsQuotesPage?: Page
  ) {
    return playlistsQuotesPage;
  }

  @getModelsByField(PlaylistQuote, getPlaylistsByQuoteIdConfig)
  async getPlaylistsQuotesByQuoteId(
    page: number,
    quoteIdDTO: QuoteIdDTO,
    playlistsQuotesPage?: Page
  ) {
    return playlistsQuotesPage;
  }

  @deleteModelByField(PlaylistQuote)
  async deletePlaylistQuote(playlistIdDTO: PlaylistIdDTO, playlistQuote?: any) {
    return playlistQuote;
  }

  @deleteModelsByField(PlaylistQuote)
  async deletePlaylistsQuotesByPlaylistId(playlistIdDTO: PlaylistIdDTO) {}
}

export const playlistQuoteRepository = new PlaylistQuoteRepository();

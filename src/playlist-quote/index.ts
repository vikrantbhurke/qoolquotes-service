import { PlaylistQuoteController } from "./playlist-quote.controller";
import {
  playlistQuoteService,
  PlaylistQuoteService,
} from "./playlist-quote.service";
import {
  playlistQuoteRepository,
  PlaylistQuoteRepository,
} from "./playlist-quote.repository";
import { playlistService } from "../playlist";

playlistQuoteService.setPlaylistQuoteRepository(playlistQuoteRepository);
playlistQuoteService.setPlaylistService(playlistService);

export {
  playlistQuoteService,
  playlistQuoteRepository,
  PlaylistQuoteController,
  PlaylistQuoteService,
  PlaylistQuoteRepository,
};

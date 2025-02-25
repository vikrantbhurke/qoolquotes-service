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
import { userService } from "../user";

playlistQuoteService.setPlaylistQuoteRepository(playlistQuoteRepository);
playlistQuoteService.setPlaylistService(playlistService);
playlistQuoteService.setUserService(userService);

export {
  playlistQuoteService,
  playlistQuoteRepository,
  PlaylistQuoteController,
  PlaylistQuoteService,
  PlaylistQuoteRepository,
};

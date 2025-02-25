import { PlaylistController } from "./playlist.controller";
import { playlistService, PlaylistService } from "./playlist.service";
import { playlistRepository, PlaylistRepository } from "./playlist.repository";
import { playlistUtility, PlaylistUtility } from "./playlist.utility";
import { playlistQuoteService } from "../playlist-quote";
import { playlistSaverService } from "../playlist-saver";
import { playlistLikerService } from "../playlist-liker";
import { userService } from "../user";
import { deletionTracker } from "../global/utilities";

playlistService.setPlaylistRepository(playlistRepository);
playlistService.setPlaylistQuoteService(playlistQuoteService);
playlistService.setPlaylistSaverService(playlistSaverService);
playlistService.setPlaylistLikerService(playlistLikerService);
playlistService.setUserService(userService);
playlistService.setDeletionTracker(deletionTracker);

export {
  playlistService,
  playlistRepository,
  playlistUtility,
  PlaylistController,
  PlaylistService,
  PlaylistRepository,
  PlaylistUtility,
};

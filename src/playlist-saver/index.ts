import { PlaylistSaverController } from "./playlist-saver.controller";
import {
  playlistSaverService,
  PlaylistSaverService,
} from "./playlist-saver.service";
import {
  playlistSaverRepository,
  PlaylistSaverRepository,
} from "./playlist-saver.repository";
import { userService } from "../user";

playlistSaverService.setPlaylistSaverRepository(playlistSaverRepository);
playlistSaverService.setUserService(userService);

export {
  playlistSaverService,
  playlistSaverRepository,
  PlaylistSaverController,
  PlaylistSaverService,
  PlaylistSaverRepository,
};

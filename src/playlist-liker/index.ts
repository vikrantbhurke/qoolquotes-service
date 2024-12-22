import { PlaylistLikerController } from "./playlist-liker.controller";
import {
  playlistLikerService,
  PlaylistLikerService,
} from "./playlist-liker.service";
import {
  playlistLikerRepository,
  PlaylistLikerRepository,
} from "./playlist-liker.repository";
import { playlistService } from "../playlist/playlist.service";

playlistLikerService.setPlaylistLikerRepository(playlistLikerRepository);
playlistLikerService.setPlaylistService(playlistService);

export {
  playlistLikerService,
  playlistLikerRepository,
  PlaylistLikerController,
  PlaylistLikerService,
  PlaylistLikerRepository,
};

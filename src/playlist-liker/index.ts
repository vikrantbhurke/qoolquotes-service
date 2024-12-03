import { PlaylistLikerController } from "./playlist-liker.controller";
import {
  playlistLikerService,
  PlaylistLikerService,
} from "./playlist-liker.service";
import {
  playlistLikerRepository,
  PlaylistLikerRepository,
} from "./playlist-liker.repository";

playlistLikerService.setPlaylistLikerRepository(playlistLikerRepository);

export {
  playlistLikerService,
  playlistLikerRepository,
  PlaylistLikerController,
  PlaylistLikerService,
  PlaylistLikerRepository,
};

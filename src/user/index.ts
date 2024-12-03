import { deletionTracker } from "../global/utilities";
import { UserController } from "./user.controller";
import { userService, UserService } from "./user.service";
import { userRepository, UserRepository } from "./user.repository";
import { userUtility, UserUtility } from "./user.utility";
import { playlistService } from "../playlist";
import { quoteLikerService } from "../quote-liker";
import { playlistLikerService } from "../playlist-liker";
import { playlistSaverService } from "../playlist-saver";

userService.setUserRepository(userRepository);
userService.setUserUtility(userUtility);
userService.setPlaylistService(playlistService);
userService.setQuoteLikerService(quoteLikerService);
userService.setPlaylistLikerService(playlistLikerService);
userService.setPlaylistSaverService(playlistSaverService);
userService.setDeletionTracker(deletionTracker);

export {
  userService,
  userRepository,
  userUtility,
  UserController,
  UserService,
  UserRepository,
  UserUtility,
};

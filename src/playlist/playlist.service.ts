import {
  CreatorIdDTO,
  CreatePlaylistDTO,
  UpdatePlaylistDTO,
  PlaylistIdCreatorIdDTO,
  GetPlaylistsDTO,
} from "./dtos";
import { PlaylistRepository } from "./index";
import { PlaylistSaverService } from "../playlist-saver";
import { PlaylistQuoteService } from "../playlist-quote";
import { PlaylistLikerService } from "../playlist-liker";
import { UserService } from "../user";
import { DeletionTracker } from "../global/utilities";
import {
  CREATE_PLAYLIST_FREE_LIMIT,
  CREATE_PLAYLIST_PAID_LIMIT,
} from "../global/constants/constants";
import { SaverIdDTO } from "../playlist-saver/dtos";
import { Access } from "./enums";
import { Role } from "../user/enums";
import { Status } from "../subscription/enums";

export class PlaylistService {
  playlistRepository: PlaylistRepository;
  playlistQuoteService: PlaylistQuoteService;
  playlistSaverService: PlaylistSaverService;
  playlistLikerService: PlaylistLikerService;
  userService: UserService;
  deletionTracker: DeletionTracker;

  setPlaylistRepository(playlistRepository: PlaylistRepository): void {
    this.playlistRepository = playlistRepository;
  }

  setPlaylistQuoteService(playlistQuoteService: PlaylistQuoteService): void {
    this.playlistQuoteService = playlistQuoteService;
  }

  setPlaylistSaverService(playlistSaverService: PlaylistSaverService): void {
    this.playlistSaverService = playlistSaverService;
  }

  setPlaylistLikerService(playlistLikerService: PlaylistLikerService): void {
    this.playlistLikerService = playlistLikerService;
  }

  setUserService(userService: UserService): void {
    this.userService = userService;
  }

  setDeletionTracker(deletionTracker: DeletionTracker) {
    this.deletionTracker = deletionTracker;
  }

  async createPlaylist(createPlaylistDTO: CreatePlaylistDTO) {
    const { name, description, access, creatorId, quoteId } = createPlaylistDTO;

    const user = await this.userService.getUserById(creatorId);
    if (!user) throw new Error("User not found.");

    const count = await this.countPlaylistsByCreatorId({
      creatorId,
    });

    const userIsActive = user.subscriptionStatus === Status.Active;
    const userIsInactive = user.subscriptionStatus === Status.Inactive;
    const userIsSuspended = user.subscriptionStatus === Status.Suspended;

    const maxFreeLimit = `You can't create more than ${CREATE_PLAYLIST_FREE_LIMIT} playlists. Subscribe to remove limit.`;
    const maxPaidLimit = `You can't create more than ${CREATE_PLAYLIST_PAID_LIMIT} playlists. Maximum playlist limit reached.`;
    const withinLimit = `Activate your subscription to create more playlists.`;

    if (userIsInactive && count && count >= CREATE_PLAYLIST_FREE_LIMIT)
      throw new Error(maxFreeLimit);

    if (
      (userIsActive || userIsSuspended) &&
      count &&
      count >= CREATE_PLAYLIST_PAID_LIMIT
    )
      throw new Error(maxPaidLimit);

    if (
      userIsSuspended &&
      count &&
      count >= CREATE_PLAYLIST_FREE_LIMIT &&
      count < CREATE_PLAYLIST_PAID_LIMIT
    )
      throw new Error(withinLimit);

    const playlists = await this.getPlaylistsByCreatorId(0, { creatorId });

    if (!playlists) throw new Error("Playlists not found.");

    for (const playlist of playlists.content)
      if (playlist.name === name)
        throw new Error("Playlist name already exists.");

    const newPlaylist = await this.playlistRepository.createPlaylist({
      name,
      description,
      access,
      creatorId,
    });

    await this.playlistQuoteService.createPlaylistQuote({
      playlistId: newPlaylist._id,
      quoteId,
    });

    return newPlaylist;
  }

  async clonePlaylist(playlistIdCreatorIdDTO: PlaylistIdCreatorIdDTO) {
    const { playlistId, creatorId } = playlistIdCreatorIdDTO;
    const user = await this.userService.getUserById(creatorId);
    if (!user) throw new Error("User not found.");

    const count = await this.countPlaylistsByCreatorId({
      creatorId,
    });

    const userIsActive = user.subscriptionStatus === Status.Active;
    const userIsInactive = user.subscriptionStatus === Status.Inactive;
    const userIsSuspended = user.subscriptionStatus === Status.Suspended;

    const maxFreeLimit = `You can't create more than ${CREATE_PLAYLIST_FREE_LIMIT} playlists. Subscribe to remove limit.`;
    const maxPaidLimit = `You can't create more than ${CREATE_PLAYLIST_PAID_LIMIT} playlists. Maximum playlist limit reached.`;
    const withinLimit = `Activate your subscription to create more playlists.`;

    if (userIsInactive && count && count >= CREATE_PLAYLIST_FREE_LIMIT)
      throw new Error(maxFreeLimit);

    if (
      (userIsActive || userIsSuspended) &&
      count &&
      count >= CREATE_PLAYLIST_PAID_LIMIT
    )
      throw new Error(maxPaidLimit);

    if (
      userIsSuspended &&
      count &&
      count >= CREATE_PLAYLIST_FREE_LIMIT &&
      count < CREATE_PLAYLIST_PAID_LIMIT
    )
      throw new Error(withinLimit);

    const playlists = await this.getPlaylistsByCreatorId(0, { creatorId });
    if (!playlists) throw new Error("Playlists not found.");

    const playlist = await this.getPlaylistById(playlistId);
    if (!playlist) throw new Error("Playlist not found.");

    let playlistName = playlist.name;

    for (const p of playlists.content) {
      if (p.name === playlist.name) {
        playlistName = `${playlist.name} Clone`;
        break;
      }
    }

    const newPlaylist = await this.playlistRepository.createPlaylist({
      name: playlistName,
      description: playlist.description,
      access: playlist.access,
      creatorId,
    });

    let page = 0;

    while (true) {
      const playlistQuotesPage =
        await this.playlistQuoteService.getPlaylistsQuotesByPlaylistId(page, {
          playlistId,
        });

      if (!playlistQuotesPage?.content.length) break;

      for (const playlistQuote of playlistQuotesPage.content)
        await this.playlistQuoteService.createPlaylistQuote({
          playlistId: newPlaylist._id,
          quoteId: playlistQuote.quoteId,
        });

      if (playlistQuotesPage.lastPage) break;
      page++;
    }

    return newPlaylist;
  }

  async countPlaylistsByCreatorId(creatorIdDTO: CreatorIdDTO) {
    return await this.playlistRepository.countPlaylistsByCreatorId(
      creatorIdDTO
    );
  }

  async getPlaylists(getPlaylistsDTO: GetPlaylistsDTO) {
    return await this.playlistRepository.getPlaylists(getPlaylistsDTO, {
      access: Access.Public,
    });
  }

  async searchPlaylists(page: number, search: string) {
    return await this.playlistRepository.searchPlaylists(page, search);
  }

  async getPlaylistsByCreatorId(page: number, creatorIdDTO: CreatorIdDTO) {
    return await this.playlistRepository.getPlaylistsByCreatorId(
      page,
      creatorIdDTO
    );
  }

  async getPlaylistsBySaverId(page: number, saverIdDTO: SaverIdDTO) {
    const playlistsSaverPage =
      await this.playlistSaverService.getPlaylistsSaversBySaverId(
        page,
        saverIdDTO
      );

    if (!playlistsSaverPage) throw new Error("Playlists not found.");

    let playlists = [];

    for (const playlistSaver of playlistsSaverPage.content) {
      const playlist = await this.getPlaylistById(playlistSaver.playlistId);
      if (!playlist) throw new Error("Playlist not found.");
      playlists.push(playlist);
    }

    return {
      ...playlistsSaverPage,
      content: playlists,
    };
  }

  async getPlaylistById(pid: string) {
    return await this.playlistRepository.getPlaylistById(pid);
  }

  async updatePlaylistById(pid: string, updatePlaylistDTO: UpdatePlaylistDTO) {
    return await this.playlistRepository.updatePlaylistById(
      pid,
      updatePlaylistDTO
    );
  }

  async incPlaylistLikes(pid: string) {
    return await this.playlistRepository.incPlaylistLikes(pid);
  }

  async decPlaylistLikes(pid: string) {
    return await this.playlistRepository.decPlaylistLikes(pid);
  }

  async incPlaylistQuotes(pid: string) {
    return await this.playlistRepository.incPlaylistQuotes(pid);
  }

  async decPlaylistQuotes(pid: string) {
    return await this.playlistRepository.decPlaylistQuotes(pid);
  }

  async deletePlaylistById(pid: string) {
    if (this.deletionTracker.has(pid)) return;
    this.deletionTracker.add(pid);

    await this.playlistQuoteService.deletePlaylistsQuotesByPlaylistId({
      playlistId: pid,
    });

    await this.playlistLikerService.deletePlaylistsLikersByPlaylistId({
      playlistId: pid,
    });

    await this.playlistSaverService.deletePlaylistsSaversByPlaylistId({
      playlistId: pid,
    });

    const playlist = await this.playlistRepository.deletePlaylistById(pid);

    this.deletionTracker.remove(pid);

    return playlist;
  }

  async deletePlaylistsByCreatorId(creatorIdDTO: CreatorIdDTO) {
    let page = 0;

    while (true) {
      const playlistsPage = await this.getPlaylistsByCreatorId(
        page,
        creatorIdDTO
      );

      if (!playlistsPage.content.length) break;

      for (const playlist of playlistsPage.content)
        await this.deletePlaylistById(playlist._id);

      if (playlistsPage.lastPage) break;
      page++;
    }
  }
}

export const playlistService = new PlaylistService();

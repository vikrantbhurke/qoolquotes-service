import { PlaylistRepository } from "./index";
import { PlaylistSaverService } from "../playlist-saver";
import { PlaylistQuoteService } from "../playlist-quote";
import { PlaylistLikerService } from "../playlist-liker";
import { DeletionTracker } from "../global/utilities";
import {
  PlaylistIdCreatorIdDTO,
  CreatePlaylistDTO,
  CreatorIdDTO,
  UpdatePlaylistDTO,
} from "./dtos";
import { SaverIdDTO } from "../playlist-saver/dtos";
import { PLAYLIST_LIMIT } from "../global/constants/constants";

export class PlaylistService {
  playlistRepository: PlaylistRepository;
  playlistQuoteService: PlaylistQuoteService;
  playlistSaverService: PlaylistSaverService;
  playlistLikerService: PlaylistLikerService;
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

  setDeletionTracker(deletionTracker: DeletionTracker) {
    this.deletionTracker = deletionTracker;
  }

  async createPlaylist(createPlaylistDTO: CreatePlaylistDTO) {
    const { name, description, access, creatorId, quoteId } = createPlaylistDTO;

    const count = await this.countPlaylistsByCreatorId({
      creatorId,
    });

    if (count && count >= PLAYLIST_LIMIT)
      throw new Error(
        `You can't create more than ${PLAYLIST_LIMIT} playlists.`
      );

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

  async clonePlaylist(clonePlaylistDTO: PlaylistIdCreatorIdDTO) {
    const { playlistId, creatorId } = clonePlaylistDTO;

    const count = await this.countPlaylistsByCreatorId({
      creatorId,
    });

    if (count && count >= PLAYLIST_LIMIT)
      throw new Error(`You can't clone more than ${PLAYLIST_LIMIT} playlists.`);

    const playlist = await this.getPlaylistById(playlistId);

    if (!playlist) throw new Error("Playlist not found.");

    const newPlaylist = await this.playlistRepository.createPlaylist({
      name: playlist.name,
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

  async getPlaylists(page: number) {
    return await this.playlistRepository.getPlaylists(page);
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

  async deletePlaylistsByCreatorId(
    deletePlaylistsByCreatorIdDTO: CreatorIdDTO
  ) {
    let page = 0;

    while (true) {
      const playlistsPage = await this.getPlaylistsByCreatorId(
        page,
        deletePlaylistsByCreatorIdDTO
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
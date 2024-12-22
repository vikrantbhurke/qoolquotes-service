import { PlaylistLikerRepository } from "./index";
import { PlaylistIdLikerIdDTO, LikerIdDTO, PlaylistIdDTO } from "./dtos";
import { PlaylistService } from "../playlist/playlist.service";

export class PlaylistLikerService {
  playlistLikerRepository: PlaylistLikerRepository;
  playlistService: PlaylistService;

  setPlaylistLikerRepository(
    playlistLikerRepository: PlaylistLikerRepository
  ): void {
    this.playlistLikerRepository = playlistLikerRepository;
  }

  setPlaylistService(playlistService: PlaylistService): void {
    this.playlistService = playlistService;
  }

  async createPlaylistLiker(playlistIdLikerIdDTO: PlaylistIdLikerIdDTO) {
    await this.playlistService.incPlaylistLikes(
      playlistIdLikerIdDTO.playlistId
    );

    return await this.playlistLikerRepository.createPlaylistLiker(
      playlistIdLikerIdDTO
    );
  }

  async countPlaylistsLikersByPlaylistId(playlistIdDTO: PlaylistIdDTO) {
    return await this.playlistLikerRepository.countPlaylistsLikersByPlaylistId(
      playlistIdDTO
    );
  }

  async checkPlaylistLiker(playlistIdLikerIdDTO: PlaylistIdLikerIdDTO) {
    return await this.playlistLikerRepository.checkPlaylistLiker(
      playlistIdLikerIdDTO
    );
  }

  async deletePlaylistLiker(playlistIdLikerIdDTO: PlaylistIdLikerIdDTO) {
    await this.playlistService.decPlaylistLikes(
      playlistIdLikerIdDTO.playlistId
    );

    return await this.playlistLikerRepository.deletePlaylistLiker(
      playlistIdLikerIdDTO
    );
  }

  async deletePlaylistsLikersByPlaylistId(playlistIdDTO: PlaylistIdDTO) {
    return await this.playlistLikerRepository.deletePlaylistsLikersByPlaylistId(
      playlistIdDTO
    );
  }

  async deletePlaylistsLikersByLikerId(likerIdDTO: LikerIdDTO) {
    return await this.playlistLikerRepository.deletePlaylistsLikersByLikerId(
      likerIdDTO
    );
  }
}

export const playlistLikerService = new PlaylistLikerService();

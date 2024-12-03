import { PlaylistIdLikerIdDTO, LikerIdDTO, PlaylistIdDTO } from "./dtos";
import { PlaylistLikerRepository } from "./index";

export class PlaylistLikerService {
  private playlistLikerRepository: PlaylistLikerRepository;

  setPlaylistLikerRepository(
    playlistLikerRepository: PlaylistLikerRepository
  ): void {
    this.playlistLikerRepository = playlistLikerRepository;
  }

  async createPlaylistLiker(playlistIdLikerIdDTO: PlaylistIdLikerIdDTO) {
    return await this.playlistLikerRepository.createPlaylistLiker(
      playlistIdLikerIdDTO
    );
  }

  async checkPlaylistLiker(playlistIdLikerIdDTO: PlaylistIdLikerIdDTO) {
    return await this.playlistLikerRepository.checkPlaylistLiker(
      playlistIdLikerIdDTO
    );
  }

  async countPlaylistsLikersByPlaylistId(playlistIdDTO: PlaylistIdDTO) {
    return await this.playlistLikerRepository.countPlaylistsLikersByPlaylistId(
      playlistIdDTO
    );
  }

  async deletePlaylistLiker(playlistIdLikerIdDTO: PlaylistIdLikerIdDTO) {
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
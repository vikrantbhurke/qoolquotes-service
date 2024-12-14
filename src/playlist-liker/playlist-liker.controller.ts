import { Response } from "express";
import { PlaylistLikerService, playlistLikerService } from "./index";
import { Controller, Delete, Get, Param, Post, Res } from "routing-controllers";

@Controller("/playlists-likers")
export class PlaylistLikerController {
  playlistLikerService: PlaylistLikerService;

  constructor() {
    this.playlistLikerService = playlistLikerService;
  }

  @Post("/playlistId/:pid/likerId/:lid")
  async likePlaylist(
    @Param("pid") pid: string,
    @Param("lid") lid: string,
    @Res() response: Response
  ) {
    try {
      await this.playlistLikerService.createPlaylistLiker({
        playlistId: pid,
        likerId: lid,
      });

      return response.status(200).send({ message: "Playlist liked." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/playlistId/:pid/likes")
  async countPlaylistLikes(
    @Param("pid") pid: string,
    @Res() response: Response
  ) {
    try {
      const count =
        await this.playlistLikerService.countPlaylistsLikersByPlaylistId({
          playlistId: pid,
        });

      return response.status(200).json({ count });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/playlistId/:pid/likerId/:lid")
  async checkPlaylistLiker(
    @Param("pid") pid: string,
    @Param("lid") lid: string,
    @Res() response: Response
  ) {
    try {
      const exists = await this.playlistLikerService.checkPlaylistLiker({
        playlistId: pid,
        likerId: lid,
      });

      return response.status(200).json({ exists });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Delete("/playlistId/:pid/likerId/:lid")
  async unlikePlaylist(
    @Param("pid") pid: string,
    @Param("lid") lid: string,
    @Res() response: Response
  ) {
    try {
      await this.playlistLikerService.deletePlaylistLiker({
        playlistId: pid,
        likerId: lid,
      });

      return response.status(200).send({ message: "Playlist unliked." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }
}

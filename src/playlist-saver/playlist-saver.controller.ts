import { Response } from "express";
import { PlaylistSaverService, playlistSaverService } from "./index";
import { Controller, Delete, Get, Param, Post, Res } from "routing-controllers";

@Controller("/playlists-savers")
export class PlaylistSaverController {
  playlistSaverService: PlaylistSaverService;

  constructor() {
    this.playlistSaverService = playlistSaverService;
  }

  @Post("/playlistId/:pid/saverId/:sid")
  async savePlaylist(
    @Param("pid") pid: string,
    @Param("sid") sid: string,
    @Res() response: Response
  ) {
    try {
      await this.playlistSaverService.createPlaylistSaver({
        playlistId: pid,
        saverId: sid,
      });

      return response.status(201).send({ message: "Playlist saved." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/playlistId/:pid/saverId/:sid")
  async checkPlaylistSaver(
    @Param("pid") pid: string,
    @Param("sid") sid: string,
    @Res() response: Response
  ) {
    try {
      const exists = await this.playlistSaverService.checkPlaylistSaver({
        playlistId: pid,
        saverId: sid,
      });

      return response.status(200).json({ exists });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Delete("/playlistId/:pid/saverId/:sid")
  async removePlaylist(
    @Param("pid") pid: string,
    @Param("sid") sid: string,
    @Res() response: Response
  ) {
    try {
      await this.playlistSaverService.deletePlaylistSaver({
        playlistId: pid,
        saverId: sid,
      });

      return response.status(200).send({ message: "Playlist removed." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Delete("/saverId/:sid")
  async removePlaylistsBySaverId(
    @Param("sid") sid: string,
    @Res() response: Response
  ) {
    try {
      await this.playlistSaverService.deletePlaylistsSaversBySaverId({
        saverId: sid,
      });

      return response.status(200).send({ message: "Playlists removed." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }
}

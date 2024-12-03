import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  QueryParams,
  Res,
} from "routing-controllers";
import {
  PlaylistService,
  playlistService,
  PlaylistUtility,
  playlistUtility,
} from "./index";
import {
  CreatePlaylistDTO,
  GetPlaylistsDTO,
  PlaylistResponseDTO,
  UpdatePlaylistDTO,
} from "./dtos";
import { Response } from "express";
import { Page } from "global/types/page.type";
import { Playlist } from "./playlist.model";

@Controller("/playlists")
export class PlaylistController {
  playlistService: PlaylistService;
  playlistUtility: PlaylistUtility;

  constructor() {
    this.playlistService = playlistService;
    this.playlistUtility = playlistUtility;
  }

  @Post()
  async createPlaylist(
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    createPlaylistDTO: CreatePlaylistDTO,
    @Res() response: Response
  ) {
    try {
      await this.playlistService.createPlaylist(createPlaylistDTO);
      return response.status(201).send({ message: "Playlist created." });
    } catch (error: any) {
      let message;
      if (error.code === 11000) message = "Playlist already exists.";
      else message = error.message;
      return response.status(500).send({ message });
    }
  }

  @Post("/playlistId/:pid/creatorId/:cid")
  async clonePlaylist(
    @Param("pid") pid: string,
    @Param("cid") cid: string,
    @Res() response: Response
  ) {
    try {
      await this.playlistService.clonePlaylist({
        playlistId: pid,
        creatorId: cid,
      });

      return response.status(201).send({ message: "Playlist cloned." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get()
  async getPlaylists(
    @QueryParams() { page }: GetPlaylistsDTO,
    @Res() response: Response
  ) {
    try {
      const playlistsPage: Page = await this.playlistService.getPlaylists(page);

      const playlistsDTO: PlaylistResponseDTO[] = playlistsPage.content.map(
        (playlist) =>
          this.playlistUtility.convertPlaylistToPlaylistDTO(playlist)
      );

      const playlistsPageDTO: Page = {
        ...playlistsPage,
        content: playlistsDTO,
      };

      return response.status(200).json(playlistsPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/search/:search")
  async searchPlaylists(
    @QueryParams() { page }: GetPlaylistsDTO,
    @Param("search") search: string,
    @Res() response: Response
  ) {
    try {
      const playlistsPage: Page = await this.playlistService.searchPlaylists(
        page,
        search
      );

      const playlistsDTO: PlaylistResponseDTO[] = playlistsPage.content.map(
        (playlist) =>
          this.playlistUtility.convertPlaylistToPlaylistDTO(playlist)
      );

      const playlistsPageDTO: Page = {
        ...playlistsPage,
        content: playlistsDTO,
      };

      return response.status(200).json(playlistsPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/creatorId/:cid")
  async getPlaylistsByCreatorId(
    @QueryParams() { page }: GetPlaylistsDTO,
    @Param("cid") cid: string,
    @Res()
    response: Response
  ) {
    try {
      const playlistsPage: Page =
        await this.playlistService.getPlaylistsByCreatorId(page, {
          creatorId: cid,
        });

      const playlistsDTO: PlaylistResponseDTO[] = playlistsPage.content.map(
        (playlist) =>
          this.playlistUtility.convertPlaylistToPlaylistDTO(playlist)
      );

      const playlistsPageDTO: Page = {
        ...playlistsPage,
        content: playlistsDTO,
      };

      return response.status(200).json(playlistsPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/saverId/:sid")
  async getPlaylistsBySaverId(
    @QueryParams() { page }: GetPlaylistsDTO,
    @Param("sid") sid: string,
    @Res() response: Response
  ) {
    try {
      const playlistsPage: Page =
        await this.playlistService.getPlaylistsBySaverId(page, {
          saverId: sid,
        });

      const playlistsDTO: PlaylistResponseDTO[] = playlistsPage.content.map(
        (playlist) =>
          this.playlistUtility.convertPlaylistToPlaylistDTO(playlist)
      );

      const playlistsPageDTO: Page = {
        ...playlistsPage,
        content: playlistsDTO,
      };

      return response.status(200).json(playlistsPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/:pid")
  async getPlaylistById(@Param("pid") pid: string, @Res() response: Response) {
    try {
      const playlist: Playlist = await this.playlistService.getPlaylistById(
        pid
      );

      const playlistDTO =
        this.playlistUtility.convertPlaylistToPlaylistDTO(playlist);

      return response.status(200).json(playlistDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Patch("/:pid")
  async updatePlaylistById(
    @Param("pid") pid: string,
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    updatePlaylistDTO: UpdatePlaylistDTO,
    @Res() response: Response
  ) {
    try {
      await this.playlistService.updatePlaylistById(pid, updatePlaylistDTO);
      return response.status(200).send({ message: "Playlist updated." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Delete("/:pid")
  async deletePlaylistById(
    @Param("pid") pid: string,
    @Res() response: Response
  ) {
    try {
      await this.playlistService.deletePlaylistById(pid);
      return response.status(200).send({ message: "Playlist deleted." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Delete("/creatorId/:cid")
  async deletePlaylistsByCreatorId(
    @Param("cid") cid: string,
    @Res() response: Response
  ) {
    try {
      await this.playlistService.deletePlaylistsByCreatorId({ creatorId: cid });
      return response.status(200).send({ message: "Playlists deleted." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }
}

import { Response } from "express";
import { PlaylistQuoteService, playlistQuoteService } from "./index";
import { Controller, Delete, Get, Param, Post, Res } from "routing-controllers";

@Controller("/playlists-quotes")
export class PlaylistQuoteController {
  playlistQuoteService: PlaylistQuoteService;

  constructor() {
    this.playlistQuoteService = playlistQuoteService;
  }

  @Post("/playlistId/:pid/quoteId/:qid")
  async addQuoteToPlaylist(
    @Param("pid") pid: string,
    @Param("qid") qid: string,
    @Res() response: Response
  ) {
    try {
      await this.playlistQuoteService.createPlaylistQuote({
        playlistId: pid,
        quoteId: qid,
      });

      return response.status(200).send({ message: "Quote added to playlist." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/playlistId/:pid/quotes")
  async countPlaylistQuotes(
    @Param("pid") pid: string,
    @Res() response: Response
  ) {
    try {
      const count =
        await this.playlistQuoteService.countPlaylistsQuotesByPlaylistId({
          playlistId: pid,
        });

      return response.status(200).json({ count });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/playlistId/:pid/quoteId/:qid")
  async checkPlaylistQuote(
    @Param("pid") pid: string,
    @Param("qid") qid: string,
    @Res() response: Response
  ) {
    try {
      const exists = await this.playlistQuoteService.checkPlaylistQuote({
        playlistId: pid,
        quoteId: qid,
      });

      return response.status(200).json({ exists });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Delete("/playlistId/:pid/quoteId/:qid")
  async removeQuoteFromPlaylist(
    @Param("pid") pid: string,
    @Param("qid") qid: string,
    @Res() response: Response
  ) {
    try {
      await this.playlistQuoteService.deletePlaylistQuote({
        playlistId: pid,
        quoteId: qid,
      });

      return response
        .status(200)
        .send({ message: "Quote removed from playlist." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }
}

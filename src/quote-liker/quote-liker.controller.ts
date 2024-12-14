import { Response } from "express";
import { QuoteLikerService, quoteLikerService } from "./index";
import { Controller, Delete, Get, Param, Post, Res } from "routing-controllers";

@Controller("/quotes-likers")
export class QuoteLikerController {
  quoteLikerService: QuoteLikerService;

  constructor() {
    this.quoteLikerService = quoteLikerService;
  }

  @Post("/quoteId/:qid/likerId/:lid")
  async likeQuote(
    @Param("qid") qid: string,
    @Param("lid") lid: string,
    @Res() response: Response
  ) {
    try {
      await this.quoteLikerService.createQuoteLiker({
        quoteId: qid,
        likerId: lid,
      });

      return response.status(200).send({ message: "Quote liked." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/quoteId/:qid/likes")
  async countQuoteLikes(@Param("qid") qid: string, @Res() response: Response) {
    try {
      const count = await this.quoteLikerService.countQuotesLikersByQuoteId({
        quoteId: qid,
      });
      return response.status(200).json({ count });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/quoteId/:qid/likerId/:lid")
  async checkQuoteLiker(
    @Param("qid") qid: string,
    @Param("lid") lid: string,
    @Res() response: Response
  ) {
    try {
      const exists = await this.quoteLikerService.checkQuoteLiker({
        quoteId: qid,
        likerId: lid,
      });

      return response.status(200).json({ exists });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Delete("/quoteId/:qid/likerId/:lid")
  async unlikeQuote(
    @Param("qid") qid: string,
    @Param("lid") lid: string,
    @Res() response: Response
  ) {
    try {
      await this.quoteLikerService.deleteQuoteLiker({
        quoteId: qid,
        likerId: lid,
      });

      return response.status(200).send({ message: "Quote unliked." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }
}

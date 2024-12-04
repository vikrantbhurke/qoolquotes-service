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
  QuoteService,
  quoteService,
  QuoteUtility,
  quoteUtility,
} from "./index";
import { Response } from "express";
import { Page } from "global/types/page.type";
import {
  CreateQuoteDTO,
  GetQuotesDTO,
  QuoteResponseDTO,
  UpdateQuoteDTO,
} from "./dtos";
import { Quote } from "./quote.model";

@Controller("/quotes")
export class QuoteController {
  quoteService: QuoteService;
  quoteUtility: QuoteUtility;

  constructor() {
    this.quoteService = quoteService;
    this.quoteUtility = quoteUtility;
  }

  @Post("/bulk")
  async createQuotes(
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    createQuotesDTO: CreateQuoteDTO[],
    @Res() response: Response
  ) {
    try {
      await this.quoteService.createQuotes(createQuotesDTO);
      return response.status(201).send({ message: "Quotes created." });
    } catch (error: any) {
      let message;
      if (error.code === 11000) message = "Quote already exists.";
      else message = error.message;
      return response.status(500).send({ message });
    }
  }

  @Post()
  async createQuote(
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    createQuoteDTO: CreateQuoteDTO,
    @Res() response: Response
  ) {
    try {
      await this.quoteService.createQuote(createQuoteDTO);
      return response.status(201).send({ message: "Quote created." });
    } catch (error: any) {
      let message;
      if (error.code === 11000) message = "Quote already exists.";
      else message = error.message;
      return response.status(500).send({ message });
    }
  }

  @Get("/random")
  async getRandomQuotes(
    @QueryParams() { pageSize }: any,
    @Res() response: Response
  ) {
    try {
      const quotesPage: Page = await this.quoteService.getRandomQuotes(
        pageSize
      );

      const quotesDTO: QuoteResponseDTO[] = quotesPage.content.map((quote) =>
        this.quoteUtility.convertQuoteToQuoteDTO(quote)
      );

      const quotesPageDTO: Page = {
        ...quotesPage,
        content: quotesDTO,
      };

      return response.status(200).json(quotesPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/search/:search")
  async searchQuotes(
    @QueryParams() { page }: GetQuotesDTO,
    @Param("search") search: string,
    @Res() response: Response
  ) {
    try {
      const quotesPage: Page = await this.quoteService.searchQuotes(
        page,
        search
      );

      const quotesDTO: QuoteResponseDTO[] = quotesPage.content.map((quote) =>
        this.quoteUtility.convertQuoteToQuoteDTO(quote)
      );

      const quotesPageDTO: Page = {
        ...quotesPage,
        content: quotesDTO,
      };

      return response.status(200).json(quotesPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/topicId/:tid")
  async getQuotesByTopicId(
    @QueryParams() { page }: GetQuotesDTO,
    @Param("tid") tid: string,
    @Res()
    response: Response
  ) {
    try {
      const quotesPage: Page = await this.quoteService.getQuotesByTopicId(
        page,
        {
          topicIds: tid,
        }
      );

      const quotesDTO: QuoteResponseDTO[] = quotesPage.content.map((quote) =>
        this.quoteUtility.convertQuoteToQuoteDTO(quote)
      );

      const quotesPageDTO: Page = {
        ...quotesPage,
        content: quotesDTO,
      };

      return response.status(200).json(quotesPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/authorId/:aid")
  async getQuotesByAuthorId(
    @QueryParams() { page }: GetQuotesDTO,
    @Param("aid") aid: string,
    @Res()
    response: Response
  ) {
    try {
      const quotesPage: Page = await this.quoteService.getQuotesByAuthorId(
        page,
        {
          authorId: aid,
        }
      );

      const quotesDTO: QuoteResponseDTO[] = quotesPage.content.map((quote) =>
        this.quoteUtility.convertQuoteToQuoteDTO(quote)
      );

      const quotesPageDTO: Page = {
        ...quotesPage,
        content: quotesDTO,
      };

      return response.status(200).json(quotesPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/playlistId/:pid")
  async getQuotesByPlaylistId(
    @QueryParams() { page }: GetQuotesDTO,
    @Param("pid") pid: string,
    @Res()
    response: Response
  ) {
    try {
      const quotesPage: Page = await this.quoteService.getQuotesByPlaylistId(
        page,
        {
          playlistId: pid,
        }
      );

      const quotesDTO: QuoteResponseDTO[] = quotesPage.content.map((quote) =>
        this.quoteUtility.convertQuoteToQuoteDTO(quote)
      );

      const quotesPageDTO: Page = {
        ...quotesPage,
        content: quotesDTO,
      };

      return response.status(200).json(quotesPageDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Get("/:qid")
  async getQuoteById(@Param("qid") qid: string, @Res() response: Response) {
    try {
      const quote: Quote = await this.quoteService.getQuoteById(qid);
      const quoteDTO = this.quoteUtility.convertQuoteToQuoteDTO(quote);
      return response.status(200).json(quoteDTO);
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Patch("/:qid")
  async updateQuoteById(
    @Param("qid") qid: string,
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    updateQuoteDTO: UpdateQuoteDTO,
    @Res() response: Response
  ) {
    try {
      await this.quoteService.updateQuoteById(qid, updateQuoteDTO);
      return response.status(200).send({ message: "Quote updated." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }

  @Delete("/:qid")
  async deleteQuoteById(@Param("qid") qid: string, @Res() response: Response) {
    try {
      await this.quoteService.deleteQuoteById(qid);
      return response.status(200).send({ message: "Quote deleted." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }
}

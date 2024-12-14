import { Response } from "express";
import { CreateCitedQuoteDTO } from "./dtos";
import { CitedQuoteService, citedQuoteService } from "./index";
import { Body, Controller, Post, Res } from "routing-controllers";

@Controller("/cited-quotes")
export class CitedQuoteController {
  citedQuoteService: CitedQuoteService;

  constructor() {
    this.citedQuoteService = citedQuoteService;
  }

  @Post("/")
  async createCitedQuote(
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } })
    createCitedQuoteDTO: CreateCitedQuoteDTO,
    @Res() response: Response
  ) {
    try {
      this.citedQuoteService.createCitedQuote(createCitedQuoteDTO);
      return response.status(201).send({ message: "Cited quote sent." });
    } catch (error: any) {
      return response.status(500).send({ message: error.message });
    }
  }
}

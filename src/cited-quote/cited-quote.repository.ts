import { createModel } from "../global/decorators/create";
import CitedQuote from "./cited-quote.model";
import { CreateCitedQuoteDTO } from "./dtos";

export class CitedQuoteRepository {
  @createModel(CitedQuote)
  async createCitedQuote(
    createCitedQuoteDTO: CreateCitedQuoteDTO,
    citedQuote?: any
  ) {
    return citedQuote;
  }
}

export const citedQuoteRepository = new CitedQuoteRepository();

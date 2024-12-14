import CitedQuote from "./cited-quote.model";
import { CreateCitedQuoteDTO } from "./dtos";
import { createModel } from "../global/decorators/create";

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

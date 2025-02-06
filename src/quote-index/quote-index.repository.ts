import QuoteIndex from "./quote-index.model";
import { UpdateQuoteIndexDTO } from "./dtos";
import { getOneModel } from "../global/decorators/read";
import { updateOneModel } from "../global/decorators/update";

export class QuoteIndexRepository {
  @getOneModel(QuoteIndex)
  async getQuoteIndex(quoteIndex?: any) {
    return quoteIndex;
  }

  @updateOneModel(QuoteIndex)
  async updateQuoteIndex(
    updateQuoteIndexDTO: UpdateQuoteIndexDTO,
    quoteIndex?: any
  ) {
    return quoteIndex;
  }
}

export const quoteIndexRepository = new QuoteIndexRepository();

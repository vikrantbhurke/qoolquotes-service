import QuoteId from "./quote-id.model";
import { countModels, getOneModelByIndex } from "../global/decorators/read";

export class QuoteIdRepository {
  @getOneModelByIndex(QuoteId)
  async getQuoteIdByIndex(index: number, quoteId?: any) {
    return quoteId;
  }

  @countModels(QuoteId)
  async countQuoteIds(count?: number) {
    return count;
  }
}

export const quoteIdRepository = new QuoteIdRepository();

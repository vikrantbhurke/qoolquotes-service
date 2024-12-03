import {
  deleteModelByField,
  deleteModelsByField,
} from "../global/decorators/delete";
import QuoteLiker from "./quote-liker.model";
import { createModel } from "../global/decorators/create";
import { LikerIdDTO, QuoteIdDTO, QuoteIdLikerIdDTO } from "./dtos";
import { checkModel, countModelsByField } from "../global/decorators/read";

export class QuoteLikerRepository {
  @createModel(QuoteLiker)
  async createQuoteLiker(
    quoteIdLikerIdDTO: QuoteIdLikerIdDTO,
    quoteLiker?: any
  ) {
    return quoteLiker;
  }

  @checkModel(QuoteLiker)
  async checkQuoteLiker(quoteIdLikerIdDTO: QuoteIdLikerIdDTO, exists?: any) {
    return exists;
  }

  @countModelsByField(QuoteLiker)
  async countQuotesLikersByQuoteId(quoteIdDTO: QuoteIdDTO, count?: number) {
    return count;
  }

  @deleteModelByField(QuoteLiker)
  async deleteQuoteLiker(
    quoteIdLikerIdDTO: QuoteIdLikerIdDTO,
    quoteLiker?: any
  ) {
    return quoteLiker;
  }

  @deleteModelsByField(QuoteLiker)
  async deleteQuotesLikersByQuoteId(quoteIdDTO: QuoteIdDTO) {}

  @deleteModelsByField(QuoteLiker)
  async deleteQuotesLikersByLikerId(likerIdDTO: LikerIdDTO) {}
}

export const quoteLikerRepository = new QuoteLikerRepository();

import { LikerIdDTO, QuoteIdDTO, QuoteIdLikerIdDTO } from "./dtos";
import { QuoteLikerRepository } from "./index";

export class QuoteLikerService {
  private quoteLikerRepository: QuoteLikerRepository;

  setQuoteLikerRepository(quoteLikerRepository: QuoteLikerRepository): void {
    this.quoteLikerRepository = quoteLikerRepository;
  }

  async createQuoteLiker(quoteIdLikerIdDTO: QuoteIdLikerIdDTO) {
    return await this.quoteLikerRepository.createQuoteLiker(quoteIdLikerIdDTO);
  }

  async checkQuoteLiker(quoteIdLikerIdDTO: QuoteIdLikerIdDTO) {
    return await this.quoteLikerRepository.checkQuoteLiker(quoteIdLikerIdDTO);
  }

  async countQuotesLikersByQuoteId(quoteIdDTO: QuoteIdDTO) {
    return await this.quoteLikerRepository.countQuotesLikersByQuoteId(
      quoteIdDTO
    );
  }

  async deleteQuoteLiker(quoteIdLikerIdDTO: QuoteIdLikerIdDTO) {
    return await this.quoteLikerRepository.deleteQuoteLiker(quoteIdLikerIdDTO);
  }

  async deleteQuotesLikersByQuoteId(quoteIdDTO: QuoteIdDTO) {
    return await this.quoteLikerRepository.deleteQuotesLikersByQuoteId(
      quoteIdDTO
    );
  }

  async deleteQuotesLikersByLikerId(likerIdDTO: LikerIdDTO) {
    return await this.quoteLikerRepository.deleteQuotesLikersByLikerId(
      likerIdDTO
    );
  }
}

export const quoteLikerService = new QuoteLikerService();

import { QuoteIdRepository } from "./index";

export class QuoteIdService {
  quoteIdRepository: QuoteIdRepository;

  setQuoteIdRepository(quoteIdRepository: QuoteIdRepository) {
    this.quoteIdRepository = quoteIdRepository;
  }

  async getQuoteIdByIndex(index: number) {
    return await this.quoteIdRepository.getQuoteIdByIndex(index);
  }

  async countQuoteIds() {
    return await this.quoteIdRepository.countQuoteIds();
  }
}

export const quoteIdService = new QuoteIdService();

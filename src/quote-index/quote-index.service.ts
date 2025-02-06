import { QuoteIdService } from "../quote-id";
import { QuoteIndexRepository } from "./index";
import cron from "node-cron";

export class QuoteIndexService {
  quoteIdService: QuoteIdService;
  quoteIndexRepository: QuoteIndexRepository;

  setQuoteIndexRepository(quoteIndexRepository: QuoteIndexRepository) {
    this.quoteIndexRepository = quoteIndexRepository;
  }

  setQuoteIdService(quoteIdService: QuoteIdService) {
    this.quoteIdService = quoteIdService;
  }

  async getQuoteIndex() {
    return await this.quoteIndexRepository.getQuoteIndex();
  }

  async updateQuoteIndex() {
    try {
      let quoteIndex = await this.getQuoteIndex();
      const totalIds = await this.quoteIdService.countQuoteIds();
      if (!totalIds) throw new Error("No Quote Ids found");
      quoteIndex.index = (quoteIndex.index + 1) % totalIds;
      await this.quoteIndexRepository.updateQuoteIndex(quoteIndex);
    } catch (error) {
      console.error("Error updating Todays Quote:", error);
    }
  }
}

export const quoteIndexService = new QuoteIndexService();

// "0 0 * * *" // Every day at midnight
// "*/10 * * * * *" // Every 10 seconds

cron.schedule(
  "0 0 * * *",
  () => {
    quoteIndexService.updateQuoteIndex();
  },
  { timezone: "UTC" }
);

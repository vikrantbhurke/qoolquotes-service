import { QuoteService } from "../quote";
import { CreateCitedQuoteDTO } from "./dtos";
import { CitedQuoteRepository } from "./index";

export class CitedQuoteService {
  citedQuoteRepository: CitedQuoteRepository;
  quoteService: QuoteService;

  setCitedQuoteRepository(citedQuoteRepository: CitedQuoteRepository): void {
    this.citedQuoteRepository = citedQuoteRepository;
  }

  setQuoteService(quoteService: QuoteService): void {
    this.quoteService = quoteService;
  }

  async createCitedQuote(createCitedQuoteDTO: CreateCitedQuoteDTO) {
    const { content } = createCitedQuoteDTO;
    const exists = await this.quoteService.checkQuoteByContent({ content });
    if (exists) throw new Error("Quote already exists in the database.");

    return await this.citedQuoteRepository.createCitedQuote(
      createCitedQuoteDTO
    );
  }
}

export const citedQuoteService = new CitedQuoteService();

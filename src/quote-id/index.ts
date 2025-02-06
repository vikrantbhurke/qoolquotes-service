import { quoteIdService, QuoteIdService } from "./quote-id.service";
import { quoteIdRepository, QuoteIdRepository } from "./quote-id.repository";

quoteIdService.setQuoteIdRepository(quoteIdRepository);

export { quoteIdService, quoteIdRepository, QuoteIdService, QuoteIdRepository };
